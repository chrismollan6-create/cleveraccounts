// One-off: copy IR35_Opinion__c records (all matching fields + contract files) from
// PRODUCTION to the SANDBOX for a given Account Id. Reads prod creds from .env.local
// and the sandbox token from ._sbauth.json. Run from the cleveraccounts dir:
//   node scripts/copy-ir35.js <AccountId>
const fs = require('fs');
const API = 'v62.0';

function parseEnv(p) {
  const o = {};
  for (const line of fs.readFileSync(p, 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
    const m = line.match(/^\s*(SALESFORCE_[A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) o[m[1]] = m[2].replace(/\r/g, '').replace(/^["'](.*)["']$/, '$1');
  }
  return o;
}

// review/audit fields we never copy (the senior re-does the review in sandbox; the
// User lookup may not resolve there).
const SKIP = new Set(['Id', 'attributes', 'Reviewed_By__c', 'Reviewed_Date__c']);

(async () => {
  const env = parseEnv('.env.local');
  const sb = JSON.parse(fs.readFileSync('._sbauth.json', 'utf8').replace(/^﻿/, ''));
  const SBURL = sb.instanceUrl, SBTOK = sb.accessToken;
  const ACC = process.argv[2];
  if (!ACC) { console.error('Account Id arg required'); process.exit(1); }

  const ptok = await (await fetch(env.SALESFORCE_TOKEN_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: env.SALESFORCE_CLIENT_ID, client_secret: env.SALESFORCE_CLIENT_SECRET })
  })).json();
  const PTOK = ptok.access_token;
  const PURL = env.SALESFORCE_INSTANCE_URL;
  if (!PTOK) { console.error('prod token failed:', JSON.stringify(ptok).slice(0, 200)); process.exit(1); }

  const ph = { Authorization: `Bearer ${PTOK}` };
  const sh = { Authorization: `Bearer ${SBTOK}` };
  const pget = async (q) => (await fetch(`${PURL}/services/data/${API}/query?q=${encodeURIComponent(q)}`, { headers: ph })).json();
  const sbPost = async (sobj, body) => (await fetch(`${SBURL}/services/data/${API}/sobjects/${sobj}`, { method: 'POST', headers: { ...sh, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json();

  // Which fields will the SANDBOX accept on insert?
  const desc = await (await fetch(`${SBURL}/services/data/${API}/sobjects/IR35_Opinion__c/describe`, { headers: sh })).json();
  const createable = new Set((desc.fields || []).filter(f => f.createable).map(f => f.name));
  console.log('sandbox createable IR35 fields:', createable.size);

  const recs = (await pget(`SELECT FIELDS(CUSTOM) FROM IR35_Opinion__c WHERE Account__c='${ACC}' LIMIT 200`)).records || [];
  console.log('prod records to copy:', recs.length);

  for (const r of recs) {
    const oldId = (r.attributes && r.attributes.url || '').split('/').pop();
    const payload = {};
    let dropped = 0;
    for (const [k, v] of Object.entries(r)) {
      if (SKIP.has(k) || v === null) continue;
      if (!createable.has(k)) { dropped++; continue; }
      payload[k] = v;
    }
    payload.Account__c = ACC;

    const res = await sbPost('IR35_Opinion__c', payload);
    if (!res.id) { console.log(`  FAIL ${oldId}: ${JSON.stringify(res).slice(0, 300)}`); continue; }
    const newId = res.id;

    let files = 0;
    const links = (await pget(`SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId='${oldId}'`)).records || [];
    for (const l of links) {
      const cv = ((await pget(`SELECT Id, Title, PathOnClient, FileExtension FROM ContentVersion WHERE ContentDocumentId='${l.ContentDocumentId}' AND IsLatest=true LIMIT 1`)).records || [])[0];
      if (!cv) continue;
      const bin = Buffer.from(await (await fetch(`${PURL}/services/data/${API}/sobjects/ContentVersion/${cv.Id}/VersionData`, { headers: ph })).arrayBuffer());
      const cvRes = await sbPost('ContentVersion', {
        Title: cv.Title,
        PathOnClient: cv.PathOnClient || (cv.Title + '.' + (cv.FileExtension || 'pdf')),
        VersionData: bin.toString('base64'),
        FirstPublishLocationId: newId
      });
      if (cvRes.id) files++; else console.log(`   file fail: ${JSON.stringify(cvRes).slice(0, 160)}`);
    }
    console.log(`  copied ${oldId} -> ${newId}  (fields:${Object.keys(payload).length}, dropped:${dropped}, files:${files})`);
  }
  console.log('done.');
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
