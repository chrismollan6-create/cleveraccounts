import { PDFDocument, PDFFont, PDFImage, PDFPage, StandardFonts, rgb } from 'pdf-lib';

/**
 * Seals a signed document: stamps the captured signature into every signature
 * location in the document and appends a signing-certificate page. Runs
 * server-side in the /api/sign/sign route immediately after Apex accepts the
 * signature; the sealed PDF is posted back to Salesforce.
 *
 * Placement — verified against the real FreeAgent accounts + CT600 bundle
 * (one PDF, multiple signature spots):
 *   - Accounts pages: a standalone `Signed` label under the signature line,
 *     with a `Date` label beside it. Appears on the director's report AND on
 *     each balance sheet copy (full + filleted). Signature goes ABOVE the
 *     label; the signing date goes above the Date label.
 *   - CT600 declaration page: `Name` / `Date` boxes (975/980) — signature to
 *     the right of Name, date to the right of Date.
 * Anchor search uses pdfjs-dist text extraction (pdf-lib cannot read text).
 * When staff pin an explicit page/corner from the send screen, that preset is
 * used instead. If no anchors are found, falls back to a corner block on the
 * last page.
 *
 * Sealing is deliberately non-fatal: if anything here throws, the route marks
 * Seal_Status__c = Failed and the signature remains fully valid — the
 * evidence lives on the Salesforce record, not in this stamp.
 */

export interface CoverLetterContent {
  noPayment?: boolean;
  taxLiability?: string | null;
  paymentDue?: string | null;
  paymentReference?: string | null;
  revenue?: string | null;
  profit?: string | null;
  dividends?: string | null;
  adjustments?: string[];
  dlaNote?: string | null;
  commentary?: string | null;
}

export interface SealParams {
  pdfBytes: Uint8Array;
  signatureDataUrl?: string | null; // PNG data URL when drawn
  typedName?: string | null;        // set when the signer typed instead
  signerName: string;
  signerEmail: string;
  signedAtIso: string;
  signerIp: string;
  documentTitle: string;
  documentType: string;
  sourcePdfSha256: string;
  approvalStatement: string;
  brandName: string;
  brandPrimaryHex?: string | null;  // letter accent colour, e.g. '#1A7A9B'
  businessName?: string | null;
  periodEndIso?: string | null;
  coverLetter?: CoverLetterContent | null; // prepended as branded letter pages
  confirmations?: string[];         // signer confirmations, printed on the certificate
  stampPage?: number | null;        // 1-based; with stampPosition = explicit preset
  stampPosition?: string | null;    // 'Auto Anchor' | 'Bottom Left' | 'Bottom Centre' | 'Bottom Right'
}

interface TextItem {
  page: number; // 0-based
  str: string;
  x: number;
  y: number;
}

interface Spot {
  page: number;      // 0-based
  x: number;
  y: number;         // where the CONTENT's baseline/bottom goes (PDF coords)
  kind: 'signature' | 'date';
}

const GREY = rgb(0.35, 0.4, 0.47);
const DARK = rgb(0.06, 0.09, 0.16);
const INK = rgb(0.1, 0.2, 0.55); // handwriting-ish blue for typed signatures + dates
const LINE = rgb(0.8, 0.84, 0.89);

export async function sealPdf(params: SealParams): Promise<Uint8Array> {
  const doc = await PDFDocument.load(params.pdfBytes, { ignoreEncryption: true });
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const png = params.signatureDataUrl
    ? await doc.embedPng(dataUrlToBytes(params.signatureDataUrl))
    : null;

  const explicitPreset =
    params.stampPosition && params.stampPosition !== 'Auto Anchor';

  let stamped = 0;
  if (!explicitPreset) {
    let spots: Spot[] = [];
    try {
      spots = findSpots(await extractText(params.pdfBytes));
    } catch (err) {
      console.error('pdf-seal: text extraction failed, falling back to preset:', err);
    }
    const pages = doc.getPages();
    const dateStr = formatShortUk(params.signedAtIso);
    for (const spot of spots.slice(0, 12)) {
      const page = pages[spot.page];
      if (!page) continue;
      if (spot.kind === 'signature') {
        drawSignature(page, spot.x, spot.y, png, params, italic);
        stamped++;
      } else {
        page.drawText(dateStr, { x: spot.x, y: spot.y, size: 11, font: helvetica, color: INK });
      }
    }
  }

  // Preset / fallback: one block on the chosen (or last) page.
  if (stamped === 0) {
    const pages = doc.getPages();
    const pageIndex =
      params.stampPage && params.stampPage >= 1 && params.stampPage <= pages.length
        ? params.stampPage - 1
        : pages.length - 1;
    drawCornerBlock(pages[pageIndex], params, png, helvetica, helveticaBold, italic);
  }

  if (params.coverLetter) {
    try {
      prependCoverLetter(doc, params, helvetica, helveticaBold, italic);
    } catch (err) {
      console.error('pdf-seal: cover letter render failed (continuing without):', err);
    }
  }

  appendCertificate(doc, params, helvetica, helveticaBold, italic);
  return doc.save();
}

// ---------------------------------------------------------------------------
// Covering letter (prepended pages)
// ---------------------------------------------------------------------------

function prependCoverLetter(
  doc: PDFDocument,
  params: SealParams,
  helvetica: PDFFont,
  helveticaBold: PDFFont,
  italic: PDFFont,
) {
  const letter = params.coverLetter!;
  const accent = hexToRgb(params.brandPrimaryHex) ?? rgb(0.1, 0.48, 0.61);
  const A4: [number, number] = [595.28, 841.89];
  const marginX = 56;
  const maxW = A4[0] - marginX * 2;

  let letterPageCount = 0;
  let page = doc.insertPage(letterPageCount++, A4);
  let y = 0;

  const newPage = () => {
    page = doc.insertPage(letterPageCount++, A4);
    y = A4[1] - 64;
  };
  const need = (h: number) => {
    if (y - h < 72) newPage();
  };

  // Header band
  page.drawRectangle({ x: 0, y: A4[1] - 10, width: A4[0], height: 10, color: accent });
  y = A4[1] - 70;
  page.drawText(params.brandName, { x: marginX, y, size: 12, font: helveticaBold, color: accent });
  y -= 34;
  page.drawText('Financial accounts', { x: marginX, y, size: 26, font: helveticaBold, color: DARK });
  y -= 30;
  if (params.documentType.includes('CT600')) {
    page.drawText('and corporation tax return', { x: marginX, y, size: 26, font: helveticaBold, color: DARK });
    y -= 30;
  }
  y -= 2;
  if (params.businessName) {
    page.drawText(params.businessName, { x: marginX, y, size: 13, font: helveticaBold, color: DARK });
    y -= 16;
  }
  if (params.periodEndIso) {
    page.drawText(`For the year ended ${formatDateUk(params.periodEndIso)}`, {
      x: marginX, y, size: 10.5, font: helvetica, color: GREY,
    });
    y -= 16;
  }
  y -= 12;
  page.drawLine({ start: { x: marginX, y }, end: { x: A4[0] - marginX, y }, thickness: 1, color: LINE });
  y -= 26;

  // Commentary
  if (letter.commentary) {
    need(40);
    page.drawText('YOUR ACCOUNTANT’S COMMENTARY', { x: marginX, y, size: 8, font: helveticaBold, color: GREY });
    y -= 16;
    for (const para of letter.commentary.split(/\n\n+/)) {
      need(48);
      y = drawWrapped(page, para.replace(/\s+/g, ' ').trim(), marginX, y, maxW, 10.5, helvetica, DARK) - 6;
    }
    y -= 12;
  }

  // Figures
  const figures: Array<[string, string]> = [];
  if (letter.revenue) figures.push(['Revenue earned during the year', letter.revenue]);
  if (letter.profit) figures.push(['Profit / (loss) generated during the year', letter.profit]);
  if (letter.dividends) figures.push(['Dividends taken from the company', letter.dividends]);
  if (figures.length) {
    need(30 + figures.length * 22);
    page.drawText('THE YEAR AT A GLANCE', { x: marginX, y, size: 8, font: helveticaBold, color: GREY });
    y -= 18;
    for (const [label, value] of figures) {
      page.drawLine({ start: { x: marginX, y: y - 6 }, end: { x: A4[0] - marginX, y: y - 6 }, thickness: 0.5, color: LINE });
      page.drawText(label, { x: marginX, y, size: 10.5, font: helvetica, color: DARK });
      page.drawText(value, { x: A4[0] - marginX - helveticaBold.widthOfTextAtSize(value, 10.5), y, size: 10.5, font: helveticaBold, color: DARK });
      y -= 22;
    }
    y -= 10;
  }

  // Tax + payment
  if (letter.noPayment) {
    need(40);
    page.drawText('CORPORATION TAX', { x: marginX, y, size: 8, font: helveticaBold, color: GREY });
    y -= 16;
    y = drawWrapped(page,
      'There is no corporation tax to pay for this period — nothing needs to be paid to HMRC.',
      marginX, y, maxW, 10.5, helvetica, DARK) - 14;
  } else if (letter.taxLiability || letter.paymentDue || letter.paymentReference) {
    need(120);
    page.drawText('CORPORATION TAX TO PAY', { x: marginX, y, size: 8, font: helveticaBold, color: GREY });
    y -= 20;
    if (letter.taxLiability) {
      page.drawText(letter.taxLiability, { x: marginX, y, size: 18, font: helveticaBold, color: DARK });
      if (letter.paymentDue) {
        page.drawText(`due by ${formatDateUk(letter.paymentDue)}`, {
          x: marginX + helveticaBold.widthOfTextAtSize(letter.taxLiability, 18) + 10,
          y: y + 1, size: 10.5, font: helvetica, color: GREY,
        });
      }
      y -= 22;
    } else if (letter.paymentDue) {
      page.drawText(`Payment due by ${formatDateUk(letter.paymentDue)}`, { x: marginX, y, size: 10.5, font: helvetica, color: DARK });
      y -= 16;
    }
    const payRows: Array<[string, string]> = [
      ['Pay to', 'HMRC'],
      ['Sort code / account', '08-32-10 / 12001039'],
    ];
    if (letter.paymentReference) payRows.push(['Payment reference', letter.paymentReference]);
    for (const [label, value] of payRows) {
      page.drawText(label, { x: marginX, y, size: 9.5, font: helvetica, color: GREY });
      page.drawText(value, { x: marginX + 130, y, size: 9.5, font: helveticaBold, color: DARK });
      y -= 14;
    }
    y -= 4;
    y = drawWrapped(page,
      'Use the exact payment reference shown — an incorrect reference delays HMRC allocating your payment. '
      + 'Late payment accrues daily interest; contact HMRC early if you need a payment plan.',
      marginX, y, maxW, 8.5, helvetica, GREY) - 14;
  }

  // Adjustments
  if (letter.adjustments && letter.adjustments.length) {
    need(30 + letter.adjustments.length * 16);
    page.drawText('YEAR-END ADJUSTMENTS MADE', { x: marginX, y, size: 8, font: helveticaBold, color: GREY });
    y -= 16;
    for (const adj of letter.adjustments) {
      need(20);
      page.drawText('•', { x: marginX, y, size: 10.5, font: helvetica, color: accent });
      y = drawWrapped(page, adj, marginX + 12, y, maxW - 12, 10.5, helvetica, DARK) - 3;
    }
    y -= 12;
  }

  // DLA note
  if (letter.dlaNote) {
    need(48);
    page.drawText('DIRECTOR’S LOAN ACCOUNT', { x: marginX, y, size: 8, font: helveticaBold, color: GREY });
    y -= 16;
    y = drawWrapped(page, letter.dlaNote.replace(/\s+/g, ' ').trim(), marginX, y, maxW, 10.5, helvetica, DARK) - 12;
  }

  need(30);
  y = drawWrapped(page,
    'The full accounts follow this letter. It is your responsibility to check they are accurate before '
    + 'signing — if anything looks wrong, contact us before approving.',
    marginX, y, maxW, 8.5, italic, GREY);

  // Footer on each letter page
  for (let i = 0; i < letterPageCount; i++) {
    const p = doc.getPage(i);
    p.drawLine({ start: { x: marginX, y: 56 }, end: { x: A4[0] - marginX, y: 56 }, thickness: 0.5, color: LINE });
    p.drawText(`${params.brandName} — ${params.documentTitle}`, { x: marginX, y: 44, size: 7.5, font: helvetica, color: GREY });
  }
}

function hexToRgb(hex?: string | null) {
  if (!hex) return null;
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function formatDateUk(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Anchor detection
// ---------------------------------------------------------------------------

async function extractText(pdfBytes: Uint8Array): Promise<TextItem[]> {
  // Dynamic import keeps pdfjs out of the client bundle; legacy build runs in
  // Node without a worker (pdfjs spins up a "fake worker" internally).
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loadingTask = pdfjs.getDocument({
    data: pdfBytes.slice(), // pdfjs transfers/neuters the buffer — keep ours intact
    disableFontFace: true,
  });
  const doc = await loadingTask.promise;

  const items: TextItem[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    for (const item of content.items) {
      if (!('str' in item) || !item.str.trim()) continue;
      items.push({
        page: p - 1,
        str: item.str,
        x: item.transform[4],
        y: item.transform[5],
      });
    }
  }
  await loadingTask.destroy();
  return items;
}

/**
 * Signature spots:
 *  - exact `Signed` label (accounts signature line) → sign above it; the
 *    sibling `Date` label on the same row gets the date above it.
 *  - CT600 declaration page (contains "I declare that the information") with
 *    exact `Name` / `Date` labels → sign/date to the RIGHT of the labels.
 * Exact-case matching avoids sentence text like "...is signed on behalf of...".
 */
function findSpots(items: TextItem[]): Spot[] {
  const spots: Spot[] = [];

  // --- Accounts pattern -----------------------------------------------------
  const signedLabels = items.filter((i) => i.str.trim() === 'Signed');
  for (const label of signedLabels) {
    spots.push({ page: label.page, x: label.x + 4, y: label.y + 20, kind: 'signature' });
    const dateLabel = items.find(
      (i) =>
        i.page === label.page &&
        i.str.trim() === 'Date' &&
        Math.abs(i.y - label.y) < 8 &&
        i.x > label.x,
    );
    if (dateLabel) {
      spots.push({ page: dateLabel.page, x: dateLabel.x + 4, y: dateLabel.y + 20, kind: 'date' });
    }
  }

  // --- CT600 declaration pattern ---------------------------------------------
  const declarationPages = new Set(
    items
      .filter((i) => i.str.includes('I declare that the information'))
      .map((i) => i.page),
  );
  for (const page of declarationPages) {
    const nameLabel = items.find((i) => i.page === page && i.str.trim() === 'Name');
    if (nameLabel) {
      spots.push({ page, x: nameLabel.x + 70, y: nameLabel.y - 4, kind: 'signature' });
    }
    const dateLabel = items.find((i) => i.page === page && i.str.trim() === 'Date');
    if (dateLabel) {
      spots.push({ page, x: dateLabel.x + 70, y: dateLabel.y, kind: 'date' });
    }
  }

  return spots;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function drawSignature(
  page: PDFPage,
  x: number,
  y: number,
  png: PDFImage | null,
  params: SealParams,
  italic: PDFFont,
) {
  if (png) {
    const sigHeight = 32;
    const sigWidth = Math.min(150, (png.width / png.height) * sigHeight);
    page.drawImage(png, { x, y, width: sigWidth, height: sigHeight });
  } else {
    page.drawText(params.typedName || params.signerName, {
      x,
      y: y + 4,
      size: 16,
      font: italic,
      color: INK,
    });
  }
}

function drawCornerBlock(
  page: PDFPage,
  params: SealParams,
  png: PDFImage | null,
  helvetica: PDFFont,
  helveticaBold: PDFFont,
  italic: PDFFont,
) {
  const { width } = page.getSize();
  const blockWidth = 180;
  const blockHeight = 84;
  const margin = 40;
  let x: number;
  switch (params.stampPosition) {
    case 'Bottom Left':
      x = margin;
      break;
    case 'Bottom Centre':
      x = (width - blockWidth) / 2;
      break;
    default: // Bottom Right + fallback
      x = width - blockWidth - margin;
      break;
  }
  const y = margin;

  page.drawRectangle({
    x: x - 8,
    y: y - 8,
    width: blockWidth + 16,
    height: blockHeight + 16,
    color: rgb(1, 1, 1),
    opacity: 0.85,
    borderColor: LINE,
    borderWidth: 0.75,
  });

  let cursorY = y + blockHeight;
  if (png) {
    const sigHeight = 40;
    const sigWidth = Math.min(blockWidth, (png.width / png.height) * sigHeight);
    page.drawImage(png, { x, y: cursorY - sigHeight, width: sigWidth, height: sigHeight });
    cursorY -= sigHeight + 6;
  } else {
    page.drawText(params.typedName || params.signerName, {
      x,
      y: cursorY - 20,
      size: 18,
      font: italic,
      color: INK,
    });
    cursorY -= 30;
  }

  page.drawLine({
    start: { x, y: cursorY },
    end: { x: x + blockWidth, y: cursorY },
    thickness: 0.75,
    color: LINE,
  });
  cursorY -= 11;
  page.drawText(params.signerName, { x, y: cursorY, size: 8.5, font: helveticaBold, color: DARK });
  cursorY -= 11;
  page.drawText(`Signed electronically ${formatUk(params.signedAtIso)}`, {
    x,
    y: cursorY,
    size: 7,
    font: helvetica,
    color: GREY,
  });
  cursorY -= 9;
  page.drawText(`Ref ${params.sourcePdfSha256.slice(0, 16)} · via ${params.brandName}`, {
    x,
    y: cursorY,
    size: 7,
    font: helvetica,
    color: GREY,
  });
}

function appendCertificate(
  doc: PDFDocument,
  params: SealParams,
  helvetica: PDFFont,
  helveticaBold: PDFFont,
  italic: PDFFont,
) {
  const cert = doc.addPage([595.28, 841.89]); // A4 portrait
  const cw = cert.getWidth();
  let cy = 780;

  cert.drawText('Signing Certificate', { x: 56, y: cy, size: 24, font: helveticaBold, color: DARK });
  cy -= 18;
  cert.drawText(params.brandName, { x: 56, y: cy, size: 11, font: helvetica, color: GREY });
  cy -= 28;
  cert.drawLine({ start: { x: 56, y: cy }, end: { x: cw - 56, y: cy }, thickness: 1, color: LINE });
  cy -= 30;

  const rows: Array<[string, string]> = [
    ['Document', params.documentTitle],
    ['Document type', params.documentType],
    ['Signed by', params.signerName],
    ['Signer email', params.signerEmail],
    ['Signed at', `${formatUk(params.signedAtIso)} (UTC)`],
    ['Signer IP address', params.signerIp || 'not recorded'],
    ['Document SHA-256', params.sourcePdfSha256],
  ];
  for (const [label, value] of rows) {
    cert.drawText(label.toUpperCase(), { x: 56, y: cy, size: 8, font: helveticaBold, color: GREY });
    cy -= 14;
    cy = drawWrapped(cert, value, 56, cy, cw - 112, 11, helvetica, DARK) - 12;
  }

  cy -= 6;
  cert.drawText('DECLARATION AGREED BY THE SIGNER', { x: 56, y: cy, size: 8, font: helveticaBold, color: GREY });
  cy -= 14;
  cy = drawWrapped(cert, `"${params.approvalStatement}"`, 56, cy, cw - 112, 10.5, italic, DARK) - 18;

  if (params.confirmations && params.confirmations.length) {
    cert.drawText('CONFIRMATIONS AGREED BY THE SIGNER', { x: 56, y: cy, size: 8, font: helveticaBold, color: GREY });
    cy -= 14;
    for (const c of params.confirmations) {
      cert.drawText('•', { x: 56, y: cy, size: 9.5, font: helvetica, color: GREY });
      cy = drawWrapped(cert, c, 68, cy, cw - 124, 9.5, italic, DARK) - 4;
    }
    cy -= 14;
  }

  drawWrapped(
    cert,
    'This document was signed electronically. The signer authenticated via a private signing link and an ' +
      'identity check against details held on file, and gave explicit consent to sign electronically. The ' +
      'SHA-256 fingerprint above identifies the exact document presented and signed; it was verified at the ' +
      'moment of signing. A full tamper-evident audit trail (creation, delivery, identity check, viewing and ' +
      `signing events with timestamps, IP addresses and browser details) is retained by ${params.brandName} ` +
      'and is available on request.',
    56,
    cy,
    cw - 112,
    9,
    helvetica,
    GREY,
  );

  cert.drawLine({ start: { x: 56, y: 72 }, end: { x: cw - 56, y: 72 }, thickness: 0.75, color: LINE });
  cert.drawText(`Generated by ${params.brandName} document signing`, {
    x: 56,
    y: 58,
    size: 8,
    font: helvetica,
    color: GREY,
  });
}

// ---------------------------------------------------------------------------

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.includes(',') ? dataUrl.slice(dataUrl.indexOf(',') + 1) : dataUrl;
  return Uint8Array.from(Buffer.from(base64, 'base64'));
}

function formatUk(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  } catch {
    return iso;
  }
}

function formatShortUk(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { timeZone: 'UTC' });
  } catch {
    return iso;
  }
}

/** Simple greedy word wrap. Returns the y after the last drawn line. */
function drawWrapped(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
): number {
  const words = text.split(/\s+/);
  let line = '';
  let cursorY = y;
  const lineHeight = size * 1.45;
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      page.drawText(line, { x, y: cursorY, size, font, color });
      cursorY -= lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) {
    page.drawText(line, { x, y: cursorY, size, font, color });
    cursorY -= lineHeight;
  }
  return cursorY;
}
