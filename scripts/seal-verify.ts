/* Placement report: where did the seal put the signature/date relative to the
   anchors in the sealed PDF? Run with: npx tsx scripts/seal-verify.ts */
import { readFileSync } from 'fs';

const SEALED =
  'C:/Users/chris/AppData/Local/Temp/claude/c--Users-chris-CleverAccountsSandbox/f2f3aabc-ab00-49db-bfc8-06b6061906bd/scratchpad/sealed-typed.pdf';

async function main() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(readFileSync(SEALED)),
    disableFontFace: true,
  }).promise;

  console.log('pages:', doc.numPages);
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items
      .filter((i: any) => 'str' in i && i.str.trim())
      .map((i: any) => ({ str: i.str.trim(), x: Math.round(i.transform[4]), y: Math.round(i.transform[5]) }));

    const anchors = items.filter((i: any) => i.str === 'Signed' || i.str === 'Date' || i.str === 'Name');
    const stamps = items.filter((i: any) => i.str === 'Samuel Smith' || /^\d{2}\/\d{2}\/\d{4}$/.test(i.str));
    const isDecl = items.some((i: any) => i.str.includes('I declare that the information'));
    if (anchors.length || stamps.length) {
      console.log(`\n--- page ${p}${isDecl ? ' (CT600 declaration)' : ''}`);
      for (const a of anchors) console.log(`  anchor  ${a.str.padEnd(7)} x=${a.x} y=${a.y}`);
      for (const s of stamps) console.log(`  STAMP   ${s.str.padEnd(12)} x=${s.x} y=${s.y}`);
    }
    if (p === doc.numPages) {
      const certTitle = items.find((i: any) => i.str === 'Signing Certificate');
      console.log(`\nlast page has certificate: ${!!certTitle}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
