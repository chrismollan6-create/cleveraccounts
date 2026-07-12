/* Local harness: seal the real accounts+CT600 PDF and write the outputs
   to the scratchpad for visual inspection. Run from cleveraccounts/ with:
   npx tsx <path>/seal-test.ts */
import { readFileSync, writeFileSync } from 'fs';
import { sealPdf } from '../src/lib/pdf-seal';

const SRC = 'C:/Users/chris/Downloads/2606619 - BBB ENGINEERING LTD - Year End Accounts 05_04_2026 (1).pdf';
const OUT_DIR = 'C:/Users/chris/AppData/Local/Temp/claude/c--Users-chris-CleverAccountsSandbox/f2f3aabc-ab00-49db-bfc8-06b6061906bd/scratchpad';

async function main() {
  const pdfBytes = new Uint8Array(readFileSync(SRC));
  const base = {
    pdfBytes,
    signerName: 'Samuel Smith',
    signerEmail: 'sam@example.com',
    signedAtIso: new Date().toISOString(),
    signerIp: '203.0.113.9',
    documentTitle: 'Accounts & CT600 — year ended 31 December 2025',
    documentType: 'Accounts & CT600',
    sourcePdfSha256: 'abc123def456abc123def456abc123def456abc123def456abc123def456abcd',
    approvalStatement:
      'I approve these financial statements for the period ended 31 December 2025 on behalf of the board of directors... and I authorise Clever Accounts Ltd to submit the CT600 to HMRC.',
    brandName: 'Clever Accounts',
    stampPage: null,
    stampPosition: 'Auto Anchor',
  };

  // Typed-name mode
  const typed = await sealPdf({ ...base, typedName: 'Samuel Smith', signatureDataUrl: null });
  writeFileSync(`${OUT_DIR}/sealed-typed.pdf`, typed);
  console.log('typed OK', typed.length, 'bytes');

  // Drawn mode — use the brand logo PNG as a stand-in signature image
  const png = readFileSync(
    'C:/Users/chris/CleverAccountsSandbox/cleveraccounts/public/brand/workwell/logo.png',
  );
  const dataUrl = 'data:image/png;base64,' + png.toString('base64');
  const drawn = await sealPdf({ ...base, typedName: null, signatureDataUrl: dataUrl });
  writeFileSync(`${OUT_DIR}/sealed-drawn.pdf`, drawn);
  console.log('drawn OK', drawn.length, 'bytes');
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
