// Second pass: fetch each imported record's contract PDF from the URL captured in
// import-ir35-results.json and attach it as a ContentVersion, so the assessment can
// run contract-aware. Only .pdf URLs (Gemini can't read .doc/.docx).
//   node scripts/attach-ir35-pdfs.js <authFile>
const fs = require('fs');
const API = 'v62.0';

(async () => {
  const authFile = process.argv[2] || '._sbauth.json';
  const sb = JSON.parse(fs.readFileSync(authFile, 'utf8').replace(/^﻿/, ''));
  const URL = sb.instanceUrl, TOK = sb.accessToken;
  const h = { Authorization: `Bearer ${TOK}` };
  const results = JSON.parse(fs.readFileSync('scripts/import-ir35-results.json', 'utf8'));

  let ok = 0, fail = 0, skip = 0;
  for (const r of results) {
    if (r.ext !== 'pdf' || !r.contractUrl) { skip++; continue; }
    try {
      const resp = await fetch(r.contractUrl);
      if (!resp.ok) { console.log(`  ${r.name}: HTTP ${resp.status}`); fail++; continue; }
      const buf = Buffer.from(await resp.arrayBuffer());
      const title = decodeURIComponent(r.contractUrl.split('/').pop());
      const cvRes = await (await fetch(`${URL}/services/data/${API}/sobjects/ContentVersion`, {
        method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, PathOnClient: title, VersionData: buf.toString('base64'), FirstPublishLocationId: r.id })
      })).json();
      if (cvRes.id) { ok++; console.log(`  ${String(ok).padStart(2)}. ${r.name}: attached (${(buf.length / 1024).toFixed(0)}kb)`); }
      else { fail++; console.log(`  ${r.name}: FAIL ${JSON.stringify(cvRes).slice(0, 160)}`); }
    } catch (e) { fail++; console.log(`  ${r.name}: ERR ${e.message}`); }
  }
  console.log(`\nattached: ${ok}  failed: ${fail}  skipped (non-pdf / no url): ${skip}`);
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
