// Bulk-import historical Gravity-Form IR35 questionnaire submissions (CSV export)
// into SANDBOX as IR35_Opinion__c records, for stress-testing the AI assessment.
// Answers only — contract PDFs are added later (the CSV's contract URLs are written
// to import-ir35-results.json so they can be fetched/attached in a second pass).
//
//   node scripts/import-ir35-csv.js "<path-to-csv>"
//
// Sandbox auth comes from ._sbauth.json ({ instanceUrl, accessToken }).
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const API = 'v62.0';
const TODAY = '2026-06-17';

// question number -> { field, kind }.  kind: 'text' (textarea/string, full value),
// 'yesno' (RESTRICTED picklist -> coerce to Yes/No, keep verbatim in notes).
const QNUM = {
  1:  ['Q1_Time_Contracting__c', 'text'],
  3:  ['Q3_Engagements_Over_2_Years__c', 'text'],
  4:  ['Q4_Simultaneous_Contracts__c', 'text'],
  5:  ['Q5_HMRC_Contact__c', 'text'],
  6:  ['Q6_Other_Business_Income__c', 'text'],
  7:  ['Q7_Task_Or_Project__c', 'text'],
  8:  ['Q8_Previous_PAYE_Employee__c', 'text'],
  9:  ['Q9_Substitution_Allowed__c', 'yesno'],
  10: ['Q10_Substitute_Restrictions__c', 'text'],
  11: ['Q11_Sent_Substitute__c', 'yesno'],
  12: ['Q12_Can_Subcontract__c', 'yesno'],
  13: ['Q13_Additional_Hours__c', 'text'],
  14: ['Q14_Obliged_Accept_Work__c', 'text'],
  15: ['Q15_Client_Controls_How__c', 'yesno'],
  16: ['Q16_Reporting__c', 'text'],
  17: ['Q17_Permission_For_Absence__c', 'yesno'],
  18: ['Q18_Prevented_Other_Clients__c', 'yesno'],
  19: ['Q19_Other_Restrictions__c', 'text'],
  20: ['Q20_Part_Of_Team__c', 'text'],
  21: ['Q21_Manage_Client_Staff__c', 'yesno'],
  22: ['Q22_Treated_As_Employee__c', 'text'],
  23: ['Q23_Client_Provides_Benefits__c', 'yesno'],
  24: ['Q24_Services_Description__c', 'text'],
  25: ['Q25_Autonomy_In_Hours__c', 'yesno'],
  26: ['Q26_Advertising__c', 'yesno'],
  27: ['Q27_Business_Stationery__c', 'yesno'],
  28: ['Q28_Developing_Business__c', 'yesno'],
  29: ['Q29_Home_Office__c', 'text'],
  30: ['Q30_Services_From_Home__c', 'yesno'],
  31: ['Q31_Training_Spend__c', 'text'],
  32: ['Q32_Bad_Debt_Risk__c', 'yesno'],
  33: ['Q33_Own_Equipment__c', 'yesno'],
  34: ['Q34_Rectify_Defects__c', 'yesno'],
  35: ['Q35_Business_Insurance__c', 'yesno'],
};
// human labels for the verbatim-qualifier notes
const QLABEL = {
  9: 'Can use a substitute', 11: 'Has sent a substitute', 12: 'Can sub-contract',
  15: 'Client controls how', 17: 'Needs permission for absence', 18: 'Prevented from other clients',
  21: 'Manages client staff', 23: 'Client provides benefits', 25: 'Autonomy over hours',
  26: 'Advertises / markets', 27: 'Business stationery', 28: 'Developing the business',
  30: 'Works from home', 32: 'Bad-debt risk', 33: 'Supplies own equipment',
  34: 'Rectifies defects at own cost', 35: 'Business insurance',
};

function coerceYesNo(v) {
  const t = (v || '').trim().toLowerCase();
  if (/^y(es)?\b/.test(t)) return 'Yes';
  if (/^no?\b/.test(t) && !/^non/.test(t)) return 'No';  // "No"/"N" but not "None"/"Not sure"
  return null;
}
const isBareYesNo = (v) => /^(yes|no)[.\s]*$/i.test((v || '').trim());
const clip = (v, n) => (v && v.length > n ? v.slice(0, n) : v);
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test((v || '').trim());

(async () => {
  const csvPath = process.argv[2] || `${process.env.USERPROFILE || ''}/Downloads/ir35-opinion-questionnaire-2026-06-17.csv`;
  const authFile = process.argv[3] || '._sbauth.json';
  const sb = JSON.parse(fs.readFileSync(authFile, 'utf8').replace(/^﻿/, ''));
  const URL = sb.instanceUrl, TOK = sb.accessToken;
  const h = { Authorization: `Bearer ${TOK}`, 'Content-Type': 'application/json' };
  const post = async (sobj, body) =>
    (await fetch(`${URL}/services/data/${API}/sobjects/${sobj}`, { method: 'POST', headers: h, body: JSON.stringify(body) })).json();

  const rows = parse(fs.readFileSync(csvPath), { bom: true, relax_quotes: true, relax_column_count: true, skip_empty_lines: true });
  const headers = rows[0].map(s => s.replace(/\s+/g, ' ').trim());

  // classify each column
  const role = headers.map(t => {
    if (t === "Contractor's Name (First)") return { f: 'Contractor_First_Name__c', kind: 'str', max: 80 };
    if (t === "Contractor's Name (Last)") return { f: 'Contractor_Last_Name__c', kind: 'str', max: 80 };
    if (t === 'Position') return { f: 'Position__c', kind: 'str', max: 120 };
    if (t === 'End Client') return { f: 'End_Client__c', kind: 'str', max: 255 };
    if (t === 'Agency') return { f: 'Agency__c', kind: 'str', max: 255 };
    if (t === 'Contract Start Date') return { f: 'Contract_Start_Date__c', kind: 'date' };
    if (t === 'Contract End Date') return { f: 'Contract_End_Date__c', kind: 'date' };
    if (t === 'Upload a copy of your contract') return { kind: 'url' };
    if (/How many contracts have you had/i.test(t)) return { kind: 'pastcontract' };
    if (/any further information/i.test(t)) return { f: 'Additional_Information__c', kind: 'addl' };
    const m = t.match(/^(\d+)\./);
    if (m && QNUM[+m[1]]) return { f: QNUM[+m[1]][0], kind: QNUM[+m[1]][1], q: +m[1] };
    return null;
  });

  const results = [];
  let imported = 0, skipped = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const get = (pred) => { const idx = role.findIndex(pred); return idx >= 0 ? (row[idx] || '').trim() : ''; };
    const first = get(r => r && r.f === 'Contractor_First_Name__c');
    const last = get(r => r && r.f === 'Contractor_Last_Name__c');

    // junk / abandoned filter
    const answered = role.filter((r, j) => r && (r.kind === 'text' || r.kind === 'yesno') && (row[j] || '').trim()).length;
    if (!first || !last || /sadasd|sdasd|^test$/i.test(first + last) || answered < 8) { skipped++; continue; }

    const payload = {};
    const qualifiers = [];
    const past = [];
    let contractUrl = '';

    role.forEach((r, j) => {
      if (!r) return;
      const raw = (row[j] || '').trim();
      if (r.kind === 'url') { if (raw) contractUrl = raw; return; }
      if (r.kind === 'pastcontract') {
        if (raw) { const p = raw.split('|'); if ((p[2] || '').trim()) past.push({ start: p[0] || '', end: p[1] || '', client: p[2] || '', agency: p[3] || '' }); }
        return;
      }
      if (!raw) return;
      if (r.kind === 'str') payload[r.f] = clip(raw, r.max);
      else if (r.kind === 'date') { if (isDate(raw)) payload[r.f] = raw; }
      else if (r.kind === 'text') payload[r.f] = clip(raw, 32000);
      else if (r.kind === 'addl') payload[r.f] = raw;  // merged with qualifiers below
      else if (r.kind === 'yesno') {
        const c = coerceYesNo(raw);
        if (c) payload[r.f] = c;
        if (!isBareYesNo(raw)) qualifiers.push(`- ${QLABEL[r.q] || ('Q' + r.q)}: ${raw}`);
      }
    });

    // inferred context the old form didn't capture
    const agency = payload.Agency__c || '';
    payload.Engagement_Route__c = (agency && !/^(n\/?a|none|-|direct)/i.test(agency)) ? 'Through an agency' : 'Direct with the end client';
    const start = payload.Contract_Start_Date__c;
    payload.Contract_Status__c = (start && start > TODAY) ? 'New - not yet started' : 'In progress';
    if (past.length) payload.Past_Contracts_JSON__c = JSON.stringify(past);

    // keep every verbatim qualifier so coercion never loses nuance
    if (qualifiers.length) {
      const note = 'Verbatim questionnaire answers (yes/no fields):\n' + qualifiers.join('\n');
      payload.Additional_Information__c = clip((payload.Additional_Information__c ? payload.Additional_Information__c + '\n\n' : '') + note, 32000);
    }

    const res = await post('IR35_Opinion__c', payload);
    if (!res.id) { console.log(`  FAIL ${first} ${last}: ${JSON.stringify(res).slice(0, 240)}`); skipped++; continue; }
    imported++;
    results.push({ id: res.id, name: `${first} ${last}`, endClient: payload.End_Client__c || '', contractUrl, ext: (contractUrl.split('.').pop() || '').toLowerCase() });
    console.log(`  ${String(imported).padStart(2)}. ${first} ${last}  -> ${res.id}  (fields:${Object.keys(payload).length}, qualifiers:${qualifiers.length}, url:${contractUrl ? 'Y' : 'n'})`);
  }

  fs.writeFileSync('scripts/import-ir35-results.json', JSON.stringify(results, null, 2));
  const withPdf = results.filter(r => r.ext === 'pdf').length;
  const withDoc = results.filter(r => ['doc', 'docx'].includes(r.ext)).length;
  console.log(`\nimported: ${imported}  skipped: ${skipped}`);
  console.log(`contract URLs -> pdf: ${withPdf}, doc/docx (Gemini can't read): ${withDoc}, none: ${results.length - withPdf - withDoc}`);
  console.log('wrote scripts/import-ir35-results.json');
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
