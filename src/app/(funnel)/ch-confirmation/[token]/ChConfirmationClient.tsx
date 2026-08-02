'use client';

import { useState, useEffect, type ComponentType, type ReactNode } from 'react';
import {
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  Tag,
  FileText,
  Lock,
  Loader2,
  PenLine,
  CalendarClock,
  AlertTriangle,
  CreditCard,
  ExternalLink,
  Landmark,
  KeyRound,
} from 'lucide-react';
import type { ChConfirmationDto, IdvPerson } from './page';
import { sicDescription } from '@/lib/sic-codes';

/** Same premium elevation as the VAT approval + accounts signing pages, so the three read as one system. */
const CARD =
  'bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-14px_rgba(16,24,40,0.14)]';

interface SectionDef {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}
const SECTIONS: SectionDef[] = [
  { key: 'companyName', label: 'Company name', icon: Tag },
  { key: 'registeredOffice', label: 'Registered office', icon: Building2 },
  { key: 'officers', label: 'Directors', icon: Users },
  { key: 'pscs', label: 'People with significant control', icon: ShieldCheck },
  { key: 'sic', label: 'Nature of business', icon: Tag },
  // Registered email deliberately omitted: we don't sync it, it's optional on the CS01, and it only
  // ever showed "Not on record" — noise. The company's CH-registered email is unaffected.
];
const CAPITAL_SECTION: SectionDef = { key: 'capital', label: 'Statement of capital', icon: Landmark };

type ChangeVal = Record<string, string | string[]>;

/** True when the client has entered enough structured detail for a flagged section to be actioned. */
function changeComplete(key: string, c: ChangeVal): boolean {
  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  switch (key) {
    case 'companyName':
      return !!s(c.newName);
    case 'registeredOffice':
      return !!(s(c.line1) && s(c.town) && s(c.postcode));
    case 'officers': {
      const act = s(c.action);
      if (act === 'remove') return !!s(c.director);
      if (act === 'changeName') return !!(s(c.director) && s(c.forename) && s(c.surname));
      if (act === 'add') return !!(s(c.forename) && s(c.surname) && /.+@.+\..+/.test(s(c.email)) && s(c.mobile));
      return false;
    }
    case 'pscs':
      return !!(s(c.changeType) && s(c.name));
    case 'sic':
      return Array.isArray(c.codes) && c.codes.length > 0;
    case 'capital':
      return !!s(c.note);
    case 'email':
      return /.+@.+\..+/.test(s(c.email));
    default:
      return false;
  }
}

/** A short human summary of a structured change, stored as the section note for staff. */
function changeSummary(key: string, c: ChangeVal): string {
  const g = (k: string) => (typeof c[k] === 'string' ? (c[k] as string).trim() : '');
  switch (key) {
    case 'companyName':
      return `New name: ${g('newName')}`;
    case 'registeredOffice':
      return ['New office:', g('line1'), g('line2'), g('town'), g('county'), g('postcode')]
        .filter(Boolean)
        .join(' ');
    case 'officers': {
      const act = g('action');
      if (act === 'remove') return `Remove director: ${g('director')}`;
      if (act === 'changeName') return `Rename director ${g('director')} → ${g('forename')} ${g('surname')}`;
      if (act === 'add') return `Add director: ${g('forename')} ${g('surname')} · ${g('email')} · ${g('mobile')}`;
      return 'Director change';
    }
    case 'pscs':
      return `${g('changeType')} — ${g('name')}${g('details') ? ': ' + g('details') : ''}`;
    case 'email':
      return `New email: ${g('email')}`;
    case 'sic':
      return `SIC: ${(Array.isArray(c.codes) ? c.codes : []).join(', ')}`;
    case 'capital':
      return `Capital: ${g('note')}`;
    default:
      return '';
  }
}

const COMPLETE_HINT: Record<string, string> = {
  companyName: 'Enter the new company name.',
  registeredOffice: 'Enter the new address — line 1, town and postcode.',
  officers: 'Pick a director to remove or rename, or add one — and fill in the details.',
  pscs: 'Choose what’s changed and enter the person’s name.',
  sic: 'Add at least one SIC code.',
  capital: 'Tell us what’s changed about your shares or share capital.',
  email: 'Enter a valid email address.',
};

export default function ChConfirmationClient({
  token,
  dto,
  brandEmail,
  brandPhone,
}: {
  token: string;
  dto: ChConfirmationDto;
  brandEmail: string;
  brandPhone: string;
}) {
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [changes, setChanges] = useState<Record<string, ChangeVal>>({});
  const [lawful, setLawful] = useState(true); // opt-out: the company confirms it will keep trading lawfully
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | 'confirmed' | 'changes' | 'approved-pending'>(null);
  const [error, setError] = useState('');

  // Identity verification (ECCTA): every director + individual PSC needs a Companies House personal
  // code before we can file. The client enters any that are missing here.
  const [idvPeople, setIdvPeople] = useState<IdvPerson[]>(dto.idvPeople || []);
  const [idvCode, setIdvCode] = useState<Record<string, string>>({});
  const [idvSaving, setIdvSaving] = useState<Record<string, boolean>>({});
  const [idvErr, setIdvErr] = useState<Record<string, string>>({});
  const idvAllVerified = idvPeople.every((p) => p.verified);
  const idvOutstanding = idvPeople.filter((p) => !p.verified).length;

  async function saveIdvCode(person: IdvPerson) {
    const pid = person.id || '';
    const code = (idvCode[pid] || '').trim();
    if (!code) {
      setIdvErr((e) => ({ ...e, [pid]: 'Enter the code.' }));
      return;
    }
    setIdvSaving((s) => ({ ...s, [pid]: true }));
    setIdvErr((e) => ({ ...e, [pid]: '' }));
    try {
      const res = await fetch('/api/ch-confirmation/idv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, type: person.type, id: pid, code }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Could not save the code.');
      if (Array.isArray(data.idvPeople)) setIdvPeople(data.idvPeople as IdvPerson[]);
      else setIdvPeople((ps) => ps.map((p) => (p.id === pid ? { ...p, verified: true } : p)));
    } catch (e) {
      setIdvErr((er) => ({ ...er, [pid]: e instanceof Error ? e.message : 'Could not save the code.' }));
    } finally {
      setIdvSaving((s) => ({ ...s, [pid]: false }));
    }
  }

  // Filing-fee payment state
  const feeRequired = dto.feeRequired !== false && dto.feeStatus !== 'Paid' && dto.feeStatus !== 'Waived';
  const feeAmount = dto.feeAmount ?? 50;
  const [paid, setPaid] = useState(!feeRequired);
  const [payEmail, setPayEmail] = useState('');
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [payError, setPayError] = useState('');

  // On return from Stripe Checkout, verify the session and mark the fee paid.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get('payment');
    const cleanUrl = () => window.history.replaceState({}, '', window.location.pathname);
    if (outcome === 'success') {
      const sid = params.get('session_id') || '';
      setVerifying(true);
      fetch(`/api/ch-confirmation/pay-status?t=${encodeURIComponent(token)}&session=${encodeURIComponent(sid)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.paid) setPaid(true);
          else setPayError('We couldn’t confirm your payment yet. If you’ve paid, give it a moment and refresh.');
        })
        .catch(() => setPayError('We couldn’t confirm your payment. Please refresh, or get in touch.'))
        .finally(() => {
          setVerifying(false);
          cleanUrl();
        });
    } else if (outcome === 'cancelled') {
      setPayError('Payment cancelled — you can try again below.');
      cleanUrl();
    }
  }, [token]);

  async function startPayment() {
    if (!/.+@.+\..+/.test(payEmail)) {
      setPayError('Please enter a valid email address for your receipt.');
      return;
    }
    setPaying(true);
    setPayError('');
    try {
      const origin = window.location.origin;
      const path = window.location.pathname;
      const successUrl = `${origin}${path}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}${path}?payment=cancelled`;
      const res = await fetch('/api/ch-confirmation/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: payEmail, successUrl, cancelUrl }),
      });
      const data = await res.json();
      if (data?.alreadySettled) {
        setPaid(true);
        setPaying(false);
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start the payment. Please try again.');
      window.location.href = data.url; // → Stripe hosted checkout (no setPaying(false); we're leaving)
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Could not start the payment.');
      setPaying(false);
    }
  }

  // Show the statement of capital only when Companies House returned one.
  const activeSections = dto.capital ? [...SECTIONS, CAPITAL_SECTION] : SECTIONS;
  const flaggedKeys = activeSections.filter((s) => flagged[s.key]).map((s) => s.key);
  const anyFlagged = flaggedKeys.length > 0;
  const allFlaggedComplete = flaggedKeys.every((k) => changeComplete(k, changes[k] || {}));
  const labelFor = (k: string) => activeSections.find((s) => s.key === k)?.label || k;

  const setChange = (key: string, patch: ChangeVal) =>
    setChanges((c) => ({ ...c, [key]: { ...(c[key] || {}), ...patch } }));

  const setFlag = (key: string, on: boolean) => {
    setFlagged((f) => ({ ...f, [key]: on }));
    if (!on) {
      setChanges((c) => {
        const next = { ...c };
        delete next[key];
        return next;
      });
    } else if (key === 'sic') {
      // Prefill the SIC editor with what's on file so they edit rather than retype.
      setChanges((c) => (c.sic ? c : { ...c, sic: { codes: [...(dto.sicCodes || [])] } }));
    }
  };

  async function post() {
    // Approve-once: the client approves + pays even when flagging changes. Guards mirror the button.
    if (!lawful) return;
    if (feeRequired && !paid) return;
    if (!idvAllVerified) return;
    if (anyFlagged && !allFlaggedComplete) return;

    setSubmitting(true);
    setError('');
    try {
      const sections: Record<string, { ok: boolean; note: string; change?: ChangeVal }> = {};
      for (const s of activeSections) {
        const isChanged = !!flagged[s.key];
        const c = changes[s.key] || {};
        sections[s.key] = {
          ok: !isChanged,
          note: isChanged ? changeSummary(s.key, c) : '',
          ...(isChanged ? { change: c } : {}),
        };
      }
      const res = await fetch('/api/ch-confirmation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, payload: { sections, lawfulPurpose: lawful, approve: true } }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong.');
      setDone(anyFlagged ? 'approved-pending' : 'confirmed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const FIELD_CLS =
    'w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400';

  function changeFields(key: string): ReactNode {
    const c = changes[key] || {};
    const val = (k: string) => (typeof c[k] === 'string' ? (c[k] as string) : '');
    switch (key) {
      case 'companyName':
        return (
          <div>
            <input
              className={FIELD_CLS}
              placeholder="The exact new company name you’d like"
              value={val('newName')}
              onChange={(e) => setChange(key, { newName: e.target.value })}
            />
            <p className="mt-1.5 text-[12px] text-text-light leading-relaxed">
              A name change needs a members’ resolution and a name-availability check, so we’ll be in touch to
              arrange it — please type the exact name you want.
            </p>
          </div>
        );
      case 'registeredOffice':
        return (
          <div className="grid gap-2">
            <AddressLookup fieldCls={FIELD_CLS} onSelect={(a) => setChange(key, a)} />
            <input className={FIELD_CLS} placeholder="Address line 1" value={val('line1')} onChange={(e) => setChange(key, { line1: e.target.value })} />
            <input className={FIELD_CLS} placeholder="Address line 2 (optional)" value={val('line2')} onChange={(e) => setChange(key, { line2: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className={FIELD_CLS} placeholder="Town / city" value={val('town')} onChange={(e) => setChange(key, { town: e.target.value })} />
              <input className={FIELD_CLS} placeholder="County (optional)" value={val('county')} onChange={(e) => setChange(key, { county: e.target.value })} />
            </div>
            <input
              className={`${FIELD_CLS} uppercase placeholder:normal-case`}
              placeholder="Postcode"
              value={val('postcode')}
              onChange={(e) => setChange(key, { postcode: e.target.value.toUpperCase() })}
            />
          </div>
        );
      case 'officers': {
        const act = val('action');
        return (
          <div className="space-y-2">
            {(dto.officers || []).map((o, i) => {
              const isThis = (a: string) => act === a && val('director') === (o.name || '');
              return (
                <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <span className="text-[13px] text-text truncate min-w-0">
                    <span className="font-semibold">{o.name}</span>
                    {o.role ? <span className="text-text-light"> · {o.role}</span> : null}
                  </span>
                  <div className="flex gap-3 shrink-0">
                    <button type="button" onClick={() => setChange(key, { action: 'remove', director: o.name || '' })} className={`text-[12px] font-semibold ${isThis('remove') ? 'text-rose-700 underline' : 'text-text-light hover:text-rose-700'}`}>Remove</button>
                    <button type="button" onClick={() => setChange(key, { action: 'changeName', director: o.name || '' })} className={`text-[12px] font-semibold ${isThis('changeName') ? 'text-primary underline' : 'text-text-light hover:text-primary'}`}>Change name</button>
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={() => setChange(key, { action: 'add', director: '' })} className={`text-[13px] font-semibold ${act === 'add' ? 'text-primary underline' : 'text-primary hover:underline'}`}>+ Add a director</button>

            {act === 'remove' ? (
              <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2.5 text-[13px] leading-relaxed text-rose-800">
                Removing <strong>{val('director')}</strong> — we’ll be in touch to arrange this. A director can only be
                removed with the proper authorisation, so we’ll confirm it with you before anything is filed.
              </p>
            ) : null}
            {act === 'changeName' ? (
              <div className="grid grid-cols-2 gap-2">
                <input className={FIELD_CLS} placeholder="New forename(s)" value={val('forename')} onChange={(e) => setChange(key, { forename: e.target.value })} />
                <input className={FIELD_CLS} placeholder="New surname" value={val('surname')} onChange={(e) => setChange(key, { surname: e.target.value })} />
              </div>
            ) : null}
            {act === 'add' ? (
              <div className="grid gap-2 rounded-lg bg-primary-50/40 border border-primary/15 p-3">
                <p className="text-[12px] text-text-light leading-relaxed">
                  We’ll verify and set up the new director (identity + checks) before appointing them, so we just need
                  a few details to get started.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input className={FIELD_CLS} placeholder="First name" value={val('forename')} onChange={(e) => setChange(key, { forename: e.target.value })} />
                  <input className={FIELD_CLS} placeholder="Surname" value={val('surname')} onChange={(e) => setChange(key, { surname: e.target.value })} />
                </div>
                <input type="email" className={FIELD_CLS} placeholder="Email address" value={val('email')} onChange={(e) => setChange(key, { email: e.target.value })} />
                <input type="tel" className={FIELD_CLS} placeholder="Mobile number" value={val('mobile')} onChange={(e) => setChange(key, { mobile: e.target.value })} />
              </div>
            ) : null}
          </div>
        );
      }
      case 'pscs': {
        return (
          <div className="grid gap-2">
            <select className={FIELD_CLS} value={val('changeType')} onChange={(e) => setChange(key, { changeType: e.target.value })}>
              <option value="">What’s changed?…</option>
              <option value="add">Add a person with significant control</option>
              <option value="remove">Remove a person with significant control</option>
              <option value="update">Update their details</option>
            </select>
            <input className={FIELD_CLS} placeholder="Person’s full name" value={val('name')} onChange={(e) => setChange(key, { name: e.target.value })} />
            <textarea className={FIELD_CLS} rows={2} placeholder="Any details we should know (optional)" value={val('details')} onChange={(e) => setChange(key, { details: e.target.value })} />
            <p className="text-[12px] text-text-light">We’ll be in touch to arrange this change.</p>
          </div>
        );
      }
      case 'capital':
        return (
          <textarea
            className={FIELD_CLS}
            rows={2}
            placeholder="Tell us what’s changed about your shares or share capital"
            value={val('note')}
            onChange={(e) => setChange(key, { note: e.target.value })}
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className={FIELD_CLS}
            placeholder="New registered email address"
            value={val('email')}
            onChange={(e) => setChange(key, { email: e.target.value })}
          />
        );
      case 'sic':
        return (
          <SicEditor
            codes={Array.isArray(c.codes) ? (c.codes as string[]) : []}
            onChange={(next) => setChange(key, { codes: next })}
            fieldCls={FIELD_CLS}
          />
        );
      default:
        return null;
    }
  }

  // ---------- Success ----------
  if (done) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className={`max-w-lg w-full ${CARD} p-8 sm:p-10`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-8 text-emerald-600 bg-emerald-50 ring-emerald-100">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">
            {done === 'changes' ? 'Thanks — we’ve got your response' : 'Thanks — that’s approved'}
          </h1>
          <p className="text-text-light leading-relaxed">
            {done === 'confirmed'
              ? 'We’ve got everything we need and will file your confirmation statement with Companies House. We’ll let you know once it’s done.'
              : done === 'approved-pending'
              ? 'Thank you — you’ve approved and paid. We’ll file the change(s) you asked for with Companies House first, and once they’re on the register we’ll file your confirmation statement automatically. We’ll email you when it’s done.'
              : 'You’ve told us something’s changed. One of the team will be in touch to get it sorted, then we’ll file your confirmation statement for you.'}
          </p>
          <HelpFooter email={brandEmail} phone={brandPhone} />
        </div>
      </main>
    );
  }

  // ---------- Review ----------
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-8 lg:items-start">
        {/* Left: read-only summary + one decision */}
        <div className={CARD}>
          {/* tinted context band */}
          <div className="px-6 sm:px-9 pt-7 pb-6 border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-transparent">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              <FileText size={13} strokeWidth={2.5} /> Confirmation statement
            </div>
            <h1 className="mt-2.5 text-[1.7rem] sm:text-[2rem] font-bold text-text leading-[1.1] tracking-tight">
              {dto.companyName}
            </h1>
            <p className="mt-1.5 text-sm text-text-light">
              Company {dto.companyNumber}
              {dto.dueDate ? ` · due ${dto.dueDate}` : ''}
            </p>
            <p className="mt-4 text-sm text-text-light leading-relaxed max-w-prose">
              Here’s what Companies House holds for your company. Please check it over, then confirm below — or hit{' '}
              <strong className="font-semibold text-text">Update</strong> next to anything that’s changed.
            </p>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-300 px-4 py-3.5">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="text-[14px] font-bold text-amber-900">
                  {dto.dueDate ? <>You need to approve this by {dto.dueDate}</> : <>Please approve this as soon as you can</>}
                </p>
                <p className="mt-1 text-[13px] text-amber-800 leading-relaxed">
                  Keeping the confirmation statement filed on time is the company directors’ legal responsibility,
                  and we can’t file it until you’ve approved it here. Filed late, the company can be struck off the
                  register and its directors prosecuted and fined — so please don’t leave it.
                </p>
              </div>
            </div>
          </div>

          {/* read-only summary */}
          <div className="px-6 sm:px-9 pt-6 pb-2">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="block h-[3px] w-6 rounded-full bg-primary" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-primary">Details on file</h2>
            </div>
            <div>
              {activeSections.map((s) => {
                const on = !!flagged[s.key];
                const incomplete = on && !changeComplete(s.key, changes[s.key] || {});
                return (
                  <div
                    key={s.key}
                    className={`py-5 border-b border-gray-100 last:border-b-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 transition-colors ${
                      on ? 'bg-amber-50/40 rounded-lg px-3 -mx-3 border-b-transparent' : ''
                    }`}
                  >
                    <div className="sm:w-56 shrink-0 text-[13px] font-medium text-text-light">
                      {s.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      {renderValue(s.key, dto)}
                      {on ? (
                        <div className="mt-3 space-y-2">
                          {changeFields(s.key)}
                          {incomplete ? (
                            <p className="text-[12px] text-amber-700">{COMPLETE_HINT[s.key] || 'Please complete the details above.'}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="shrink-0 sm:pt-0.5">
                      {on ? (
                        <button
                          type="button"
                          onClick={() => setFlag(s.key, false)}
                          className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-700 hover:underline whitespace-nowrap"
                        >
                          Flagged · Undo
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFlag(s.key, true)}
                          className="text-[13px] font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* identity verification (ECCTA) */}
          {idvPeople.length > 0 ? (
            <div className="px-6 sm:px-9 pt-4 pb-2">
              <div className="rounded-xl border border-primary/20 bg-primary-50/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <KeyRound size={16} className="text-primary shrink-0" />
                  <h2 className="text-[15px] font-bold text-text">Identity verification</h2>
                  {idvAllVerified ? (
                    <span className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                      <CheckCircle2 size={13} /> All verified
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide">
                      {idvOutstanding} to verify
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-text-light leading-relaxed">
                  Companies House now requires every director and person with significant control to verify their
                  identity. Enter each person’s Companies House <strong>personal code</strong> below. Don’t have a code
                  yet?{' '}
                  <a
                    href="https://www.gov.uk/guidance/verifying-your-identity-for-companies-house"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Verify at GOV.UK
                  </a>
                  .
                </p>
                {!idvAllVerified ? (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-300 px-3.5 py-2.5 text-[13.5px] font-bold text-amber-900 leading-snug">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                    We can’t file your confirmation statement until every person’s code is recorded.
                  </p>
                ) : null}
                <div className="mt-4 space-y-2">
                  {idvPeople.map((p) => {
                    const pid = p.id || '';
                    return (
                      <div key={pid} className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-text truncate">{p.name}</p>
                            <p className="text-[12px] text-text-light">{p.role}</p>
                          </div>
                          {p.verified ? (
                            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-700 shrink-0">
                              <CheckCircle2 size={15} /> Verified
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 shrink-0">
                              <input
                                className="w-40 sm:w-52 rounded-lg border border-primary/25 bg-white px-3 py-2 text-sm text-text tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                placeholder="Personal code"
                                value={idvCode[pid] || ''}
                                maxLength={13}
                                onChange={(e) => setIdvCode((c) => ({ ...c, [pid]: e.target.value.toUpperCase() }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveIdvCode(p);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => saveIdvCode(p)}
                                disabled={!!idvSaving[pid]}
                                className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                              >
                                {idvSaving[pid] ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                              </button>
                            </div>
                          )}
                        </div>
                        {idvErr[pid] ? <p className="mt-1.5 text-[12px] text-rose-600">{idvErr[pid]}</p> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* decision */}
          <div className="px-6 sm:px-9 pt-4 pb-8">
            {anyFlagged ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
                <p className="text-[15px] font-semibold text-text">
                  You’ve flagged {flaggedKeys.length} change{flaggedKeys.length > 1 ? 's' : ''}
                </p>
                <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                  Send these to us and we’ll action them. Everything else will be confirmed as correct, and we
                  won’t file your confirmation statement with Companies House until each change is resolved.
                </p>

                {/* what's being sent */}
                <ul className="mt-3 space-y-1.5">
                  {flaggedKeys.map((k) => {
                    const done = changeComplete(k, changes[k] || {});
                    return (
                      <li key={k} className="flex items-start gap-2 text-[13px] text-text">
                        <PenLine size={13} className="mt-0.5 shrink-0 text-amber-600" />
                        <span>
                          <strong>{labelFor(k)}</strong>
                          {done ? (
                            <> — {changeSummary(k, changes[k] || {})}</>
                          ) : (
                            <span className="text-amber-700"> — details needed</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-100/70 px-3.5 py-3 text-[13px] leading-relaxed text-amber-900">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>Please double-check every change is correct and intended.</strong> Anything you change
                    here is filed with Companies House and updates the public register — it can’t simply be undone,
                    and we can’t accept responsibility for information that turns out to be inaccurate or incorrect.
                  </span>
                </div>

                {!allFlaggedComplete ? (
                  <p className="mt-3 text-[13px] font-medium text-amber-700">
                    Please fill in the details on each flagged item before you approve below.
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Approve + pay — always shown; with a change flagged, the client approves the intended end-state. */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6 mt-4">
                <p className="text-[15px] font-semibold text-text">{anyFlagged ? 'Approve, pay &amp; submit' : 'Confirm &amp; file'}</p>
                <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                  {anyFlagged
                    ? 'Approve and pay now — we’ll file the change(s) you flagged with Companies House, then file your confirmation statement automatically once they’re on the register. No need to come back.'
                    : 'We won’t file anything with Companies House until you approve it below.'}
                </p>

                {feeRequired ? (
                  paid ? (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-[13px] font-medium text-emerald-800">
                      <CheckCircle2 size={16} /> Filing fee paid — thank you.
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary-50/40 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-text flex items-center gap-1.5">
                            <CreditCard size={15} className="text-primary" /> Companies House filing fee
                          </p>
                          <p className="mt-1 text-[13px] text-text-light leading-relaxed">
                            This is the cost of the Companies House confirmation statement. We file it and pay this
                            to Companies House on your behalf.
                          </p>
                          {dto.chFeesUrl ? (
                            <a
                              href={dto.chFeesUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                            >
                              View Companies House fees <ExternalLink size={11} />
                            </a>
                          ) : null}
                        </div>
                        <div className="text-2xl font-bold text-text tabular-nums shrink-0">£{feeAmount}</div>
                      </div>
                      <input
                        type="email"
                        className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="Email for your receipt"
                        value={payEmail}
                        onChange={(e) => setPayEmail(e.target.value)}
                      />
                      {payError ? <p className="mt-2 text-[13px] text-rose-600">{payError}</p> : null}
                      <button
                        onClick={startPayment}
                        disabled={paying || verifying}
                        className="w-full mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                      >
                        {paying || verifying ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                        {verifying ? 'Checking payment…' : paying ? 'Redirecting to payment…' : `Pay £${feeAmount} & continue`}
                      </button>
                      <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-text-light">
                        <Lock size={11} /> Secure payment by Stripe — you’ll come straight back here to approve.
                      </p>
                    </div>
                  )
                ) : null}

                <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lawful}
                    onChange={(e) => setLawful(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[var(--color-primary,#1A7A9B)] shrink-0"
                  />
                  <span className="text-[13px] text-text leading-relaxed">
                    I confirm the company is trading lawfully and intends to continue carrying on its activities
                    lawfully in the year ahead.
                  </span>
                </label>

                {!lawful ? (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-[13px] leading-relaxed text-amber-800">
                    <span>
                      We can only file a confirmation statement once the company can confirm it will keep trading
                      lawfully. Please{' '}
                      <a className="font-semibold underline" href={`mailto:${brandEmail}`}>get in touch</a> and we’ll
                      help.
                    </span>
                  </p>
                ) : null}

                {!idvAllVerified ? (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-[13px] leading-relaxed text-amber-800">
                    <KeyRound size={15} className="shrink-0 mt-0.5" />
                    <span>
                      Add every director and person with significant control’s Companies House personal code above
                      before approving — we can’t file until each identity is verified.
                    </span>
                  </p>
                ) : null}

                {error ? <p className="text-rose-600 text-sm mt-3">{error}</p> : null}

                {/* what approving will do */}
                <div className="mt-4 rounded-lg border border-gray-200 bg-white/70 px-3.5 py-3 text-[13px] leading-relaxed text-text-light">
                  <p className="font-semibold text-text">When you approve, here’s what happens:</p>
                  <ul className="mt-1.5 space-y-1 list-disc pl-4">
                    {anyFlagged ? <li>We file the change(s) you flagged with Companies House first.</li> : null}
                    <li>
                      We file <strong>{dto.companyName}</strong>’s confirmation statement with Companies House
                      {anyFlagged ? ' once those changes are on the register' : ''}, confirming the details are correct.
                    </li>
                    {feeRequired ? <li>The £{feeAmount} Companies House fee is charged, which we pay to Companies House for you.</li> : null}
                    <li>We email you to confirm once it’s filed.</li>
                  </ul>
                </div>

                <button
                  onClick={post}
                  disabled={submitting || !lawful || (feeRequired && !paid) || !idvAllVerified || (anyFlagged && !allFlaggedComplete)}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {submitting ? 'Submitting…' : anyFlagged ? 'Approve, pay & submit' : 'Approve & confirm these details'}
                </button>
                {feeRequired && !paid ? (
                  <p className="mt-2 text-center text-[12px] text-text-light">Please pay the filing fee above before approving.</p>
                ) : null}
            </div>
          </div>
        </div>

        {/* Right: pinned info rail */}
        <aside className="mt-6 lg:mt-0 lg:sticky lg:top-8 space-y-4">
          <div className={`${CARD} overflow-hidden`}>
            <div className="bg-gradient-to-b from-primary-50 to-primary-50/40 px-5 sm:px-6 py-4 border-b border-primary/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">Your confirmation</p>
              <p className="mt-1.5 text-[15px] font-bold text-text leading-snug">{dto.companyName}</p>
            </div>

            {dto.dueDate ? (
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-start gap-3 bg-amber-50/40">
                <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <CalendarClock size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Approve by</p>
                  <p className="text-lg font-bold text-text leading-tight">{dto.dueDate}</p>
                </div>
              </div>
            ) : null}

            <div className="px-5 sm:px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-light mb-2">What happens next</p>
              <p className="text-[13px] text-text-light leading-relaxed">
                Once you approve, we file your confirmation statement with Companies House and email you when it’s
                done. If you flag a change, we’ll sort it out with you first. Nothing is filed until you approve.
              </p>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 px-1 text-center text-xs leading-relaxed text-text-light">
            <Lock size={11} className="shrink-0" />
            Secure &amp; encrypted. Questions?{' '}
            <a className="text-primary hover:underline" href={`mailto:${brandEmail}`}>{brandEmail}</a>
          </p>
        </aside>
      </div>
    </main>
  );
}

function renderValue(key: string, dto: ChConfirmationDto): ReactNode {
  switch (key) {
    case 'companyName':
      return <p className="text-[15px] font-semibold text-text">{dto.companyName}</p>;
    case 'registeredOffice':
      return <p className="text-[15px] text-text leading-relaxed">{dto.registeredOffice || 'Not on record'}</p>;
    case 'officers':
      return dto.officers && dto.officers.length ? (
        <ul className="space-y-1">
          {dto.officers.map((o, i) => (
            <li key={i} className="text-[15px] text-text">
              <span className="font-semibold">{o.name}</span>
              {o.role ? <span className="text-text-light"> · {o.role}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-text-light">No directors on record</p>
      );
    case 'pscs':
      return dto.pscs && dto.pscs.length ? (
        <ul className="space-y-1">
          {dto.pscs.map((p, i) => (
            <li key={i} className="text-[15px] font-semibold text-text">{p.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-text-light">None on record</p>
      );
    case 'sic':
      return dto.sicCodes && dto.sicCodes.length ? (
        <ul className="space-y-1.5">
          {dto.sicCodes.map((c, i) => {
            const desc = sicDescription(c);
            return (
              <li key={i} className="flex items-baseline gap-2.5">
                <span className="inline-flex items-center rounded-md bg-primary-50 text-primary px-2 py-0.5 text-[13px] font-semibold tabular-nums shrink-0">
                  {c}
                </span>
                {desc ? <span className="text-[15px] text-text">{desc}</span> : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-[15px] text-text-light">No SIC codes on record</p>
      );
    case 'capital': {
      const cap = dto.capital;
      if (!cap) return <p className="text-[15px] text-text-light">Not on record</p>;
      return (
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] text-text">
            {cap.totalShares ? (
              <span>
                <span className="font-semibold tabular-nums">{cap.totalShares}</span> shares
              </span>
            ) : null}
            {cap.totalNominal ? (
              <span className="text-text-light">
                Nominal value {cap.shareCurrency ? `${cap.shareCurrency} ` : ''}
                {cap.totalNominal}
              </span>
            ) : null}
          </div>
          {cap.classes && cap.classes.length ? (
            <ul className="space-y-0.5">
              {cap.classes.map((sc, i) => (
                <li key={i} className="text-[14px] text-text-light">
                  <span className="font-medium text-text">{sc.shareClass || 'Ordinary'}</span>
                  {sc.numShares ? ` · ${sc.numShares} shares` : ''}
                  {sc.aggregateNominal ? ` · nominal ${sc.aggregateNominal}` : ''}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }
    case 'email':
      return <p className="text-[15px] text-text break-words">{dto.registeredEmail || 'Not on record'}</p>;
    default:
      return null;
  }
}

interface PostcoderAddress {
  addressline1?: string;
  addressline2?: string;
  addressline3?: string;
  posttown?: string;
  county?: string;
  postcode?: string;
}

/** Postcode → address search (PostCoder, via /api/address) that fills the office fields. */
function AddressLookup({
  onSelect,
  fieldCls,
}: {
  onSelect: (a: { line1: string; line2: string; town: string; county: string; postcode: string }) => void;
  fieldCls: string;
}) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<PostcoderAddress[]>([]);
  const [error, setError] = useState('');

  async function search() {
    const pc = query.trim();
    if (pc.length < 3) {
      setError('Enter a valid postcode.');
      return;
    }
    setSearching(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(`/api/address?postcode=${encodeURIComponent(pc)}`);
      const data = await res.json();
      if (!res.ok || data?.error || !Array.isArray(data) || data.length === 0) {
        setError('No addresses found — you can enter it manually below.');
        return;
      }
      setResults(data);
    } catch {
      setError('Lookup unavailable — please enter it manually below.');
    } finally {
      setSearching(false);
    }
  }

  function pick(a: PostcoderAddress) {
    onSelect({
      line1: [a.addressline1, a.addressline2].filter(Boolean).join(', ') || a.addressline1 || '',
      line2: a.addressline3 || '',
      town: a.posttown || '',
      county: a.county || '',
      postcode: a.postcode || '',
    });
    setResults([]);
    setQuery(a.postcode || '');
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          className={fieldCls}
          placeholder="Enter postcode to find the address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              search();
            }
          }}
        />
        <button
          type="button"
          onClick={search}
          disabled={searching}
          className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
        >
          {searching ? '…' : 'Find'}
        </button>
      </div>
      {error ? <p className="mt-1 text-[12px] text-amber-700">{error}</p> : null}
      {results.length > 0 ? (
        <div className="mt-2 border border-gray-200 rounded-lg bg-white max-h-48 overflow-y-auto divide-y divide-gray-100">
          {results.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(a)}
              className="w-full text-left px-3 py-2 text-[13px] text-text hover:bg-gray-50"
            >
              {[a.addressline1, a.addressline2, a.posttown, a.postcode].filter(Boolean).join(', ')}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SicEditor({
  codes,
  onChange,
  fieldCls,
}: {
  codes: string[];
  onChange: (next: string[]) => void;
  fieldCls: string;
}) {
  const [val, setVal] = useState('');
  const add = () => {
    const code = val.trim();
    if (!/^\d{4,5}$/.test(code) || codes.includes(code) || codes.length >= 4) {
      setVal('');
      return;
    }
    onChange([...codes, code]);
    setVal('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {codes.length ? (
          codes.map((code) => (
            <span key={code} className="inline-flex items-center gap-1 rounded-md bg-primary-50 text-primary pl-2 pr-1 py-0.5 text-[13px]">
              <span className="font-semibold tabular-nums">{code}</span>
              {sicDescription(code) ? <span className="text-text-light">· {sicDescription(code)}</span> : null}
              <button
                type="button"
                onClick={() => onChange(codes.filter((x) => x !== code))}
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-primary/70 hover:bg-primary/10 hover:text-primary"
                aria-label={`Remove ${code}`}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-[13px] text-text-light">No SIC codes selected.</span>
        )}
      </div>
      {codes.length < 4 ? (
        <div className="flex gap-2">
          <input
            className={fieldCls}
            placeholder="Add SIC code (4–5 digits)"
            value={val}
            maxLength={5}
            inputMode="numeric"
            onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                add();
              }
            }}
          />
          <button
            type="button"
            onClick={add}
            className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-700 hover:bg-amber-50"
          >
            Add
          </button>
        </div>
      ) : (
        <p className="text-[12px] text-text-light">Up to 4 codes on a confirmation statement.</p>
      )}
    </div>
  );
}

function HelpFooter({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-text-light">
      <span>Need help?</span>
      <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
      <span className="text-gray-300 hidden sm:inline">·</span>
      <a className="text-primary hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
    </div>
  );
}
