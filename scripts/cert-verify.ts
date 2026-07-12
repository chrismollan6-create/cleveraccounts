/* Checks the certificate (last) page of the sealed PDF for the confirmations. */
import { readFileSync } from 'fs';

const SEALED =
  'C:/Users/chris/AppData/Local/Temp/claude/c--Users-chris-CleverAccountsSandbox/f2f3aabc-ab00-49db-bfc8-06b6061906bd/scratchpad/sealed-typed.pdf';

async function main() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(readFileSync(SEALED)),
    disableFontFace: true,
  }).promise;
  const cert = await doc.getPage(doc.numPages);
  const text = (await cert.getTextContent()).items
    .filter((i: any) => 'str' in i)
    .map((i: any) => i.str)
    .join(' ');
  console.log('cert has CONFIRMATIONS section:', text.includes('CONFIRMATIONS AGREED BY THE SIGNER'));
  console.log('cert mentions IR35:', text.includes('IR35'));
  console.log('cert mentions 24-month rule:', text.includes('24-month'));
  console.log('total pages:', doc.numPages);
}

main().catch((e) => { console.error(e); process.exit(1); });
