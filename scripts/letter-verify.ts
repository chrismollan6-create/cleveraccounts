/* Checks the prepended cover-letter page in the sealed PDF. */
import { readFileSync } from 'fs';

const SEALED =
  'C:/Users/chris/AppData/Local/Temp/claude/c--Users-chris-CleverAccountsSandbox/f2f3aabc-ab00-49db-bfc8-06b6061906bd/scratchpad/sealed-typed.pdf';

async function main() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(readFileSync(SEALED)),
    disableFontFace: true,
  }).promise;
  const page = await doc.getPage(1);
  const text = (await page.getTextContent()).items
    .filter((i: any) => 'str' in i)
    .map((i: any) => i.str.trim())
    .filter(Boolean);
  console.log('letter page 1 first lines:', text.slice(0, 12).join(' | '));
  console.log('has commentary:', text.some((s: string) => s.includes('Turnover for the year')));
  console.log('has tax figure:', text.some((s: string) => s.includes('5,601.01')));
  console.log('has HMRC details:', text.some((s: string) => s.includes('08-32-10')));
  console.log('has adjustments:', text.some((s: string) => s.includes('Reclassified equipment')));
  console.log('total pages:', doc.numPages);
}

main().catch((e) => { console.error(e); process.exit(1); });
