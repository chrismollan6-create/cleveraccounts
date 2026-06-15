"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2, AlertCircle, CheckCircle2, Plus, X, UploadCloud, HelpCircle,
  User, History, ClipboardList, Briefcase, Users, TrendingUp, Info, FileText,
  CalendarClock, Landmark, ShieldCheck,
} from "lucide-react";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { useBrand } from "@/lib/useBrand";

// ─── Questionnaire config ───────────────────────────────────────────────────
// `key` matches the field name on IR35OpinionController.IR35Request (Apex).

type QType = "text" | "yesno" | "choice";
interface Question {
  key: string;
  label: string;
  type: QType;
  options?: string[]; // for type "choice"
  hint?: string; // small grey helper under the field
  tip?: string;  // (?) tooltip giving IR35 context
}
interface SectionDef {
  title: string;
  description: string;
  icon: React.ReactNode;
  // "The current contract" carries the contract dates + upload at the top.
  withContractFields?: boolean;
  questions: Question[];
}

// Always shown — general background, not tied to a specific contract.
const CONTRACTING_PROFILE: SectionDef = {
  title: "Contracting Profile",
  description: "A little about how you operate as a contractor.",
  icon: <History size={18} />,
  questions: [
    { key: "q1TimeContracting", type: "text", label: "How long have you been operating as a contractor / freelance professional?", hint: "For example “6 years”, or “since 2018”." },
    { key: "q3EngagementsOver2Years", type: "text", label: "Have any of the above engagements been running for more than 2 years?", tip: "If you expect to be at the same workplace for more than 24 months and spend 40%+ of your time there, travel and subsistence stop being claimable — so it helps us to know." },
    { key: "q4SimultaneousContracts", type: "text", label: "Do you, or have you in the past, had contracts running at the same time?" },
    { key: "q5HmrcContact", type: "text", label: "Have you ever been contacted by HMRC about your IR35 status?", hint: "If yes, a brief note on what it concerned and the outcome." },
    { key: "q6OtherBusinessIncome", type: "text", label: "Do you have other sources of business income?", hint: "e.g. other clients, products, or services your company provides." },
  ],
};

// Revealed only once a contract status is chosen in "About this contract".
const CONTRACT_SECTIONS: SectionDef[] = [
  {
    title: "The current contract",
    description: "The engagement you’d like us to review — how it’s structured and priced, and what it says about substitution, obligation and risk.",
    icon: <Briefcase size={18} />,
    withContractFields: true,
    questions: [
      { key: "q7TaskOrProject", type: "text", label: "Is the work task based, or are you responsible for delivering a defined project?" },
      { key: "q8PreviousPayeEmployee", type: "text", label: "Have you previously worked for this client as an employee under PAYE?", hint: "If yes, please give brief details and when." },
      { key: "q9SubstitutionAllowed", type: "yesno", label: "Could your company send another qualified professional as a substitute if you were unable to carry out the services?", tip: "A genuine, unfettered right to send a substitute is a strong pointer towards being outside IR35 — but it has to be real in practice, not just a clause in the contract." },
      { key: "q10SubstituteRestrictions", type: "text", label: "If yes, are there any restrictions on using a substitute?", hint: "e.g. client approval, security clearance, equivalent skills." },
      { key: "q11SentSubstitute", type: "yesno", label: "Have you actually sent a substitute on this engagement?" },
      { key: "q12CanSubcontract", type: "yesno", label: "Can your company sub-contract any of the services?" },
      { key: "q13AdditionalHours", type: "text", label: "If you couldn’t meet the timescale, would you be expected to work extra hours — and would you be paid for them?", tip: "Working unpaid extra hours to deliver a result can point towards being in business on your own account." },
      // Mutuality of obligation
      { key: "obligationOfferAccept", type: "yesno", label: "During the contract, is the client obliged to offer you work and are you obliged to accept it?", tip: "Mutuality of obligation is whether the client must offer you work and you must accept it. It’s one of several factors weighed together — recent case law (PGMOL) treats it as a fairly low bar — not decisive on its own." },
      { key: "paidDuringDowntime", type: "yesno", label: "If there’s no work available, are you still paid?" },
      { key: "noticePeriod", type: "text", label: "What notice period applies if the contract ends early?", hint: "e.g. “1 week either side”, or “immediate”. Short notice points away from employment." },
      // Payment basis
      { key: "paymentBasis", type: "choice", options: ["Fixed price / project sum", "Day rate", "Hourly rate", "Other"], label: "How are you paid?", tip: "One factor among many: a fixed price for a defined deliverable can support being in business on your own account, while a day or hourly rate is more neutral. It’s never decisive on its own." },
      { key: "dayRate", type: "text", label: "Day rate or total contract value", hint: "For context — e.g. “£500/day” or “£40,000 fixed”." },
      { key: "workingHours", type: "text", label: "Typical hours or days per week — and are they set by the client?", hint: "Fixed full-time hours set by the client lean towards inside IR35." },
      { key: "workLocation", type: "choice", options: ["Mainly the client's site", "Mainly home / remote", "My own premises", "A mix"], label: "Where is the work mainly carried out?" },
    ],
  },
  {
    title: "Interaction with the client",
    description: "How you work day-to-day with the end client — covering control, integration and obligation.",
    icon: <Users size={18} />,
    questions: [
      { key: "q14ObligedAcceptWork", type: "text", label: "When the contract ends, if the client offers further work are you obliged to accept it?", hint: "If yes, please explain why." },
      { key: "q15ClientControlsHow", type: "yesno", label: "Can the client direct or control how you provide the services?", tip: "“Control” is a key IR35 test — it’s about whether the client tells you how, when and where to do the work, rather than just what the end result should be." },
      { key: "q16Reporting", type: "text", label: "Do you report to someone day-to-day, or do you give milestone updates to senior management?" },
      { key: "q17PermissionForAbsence", type: "yesno", label: "Do you have to seek permission for planned absences (rather than simply informing the client / agency)?" },
      { key: "q18PreventedOtherClients", type: "yesno", label: "Are you prevented from working for other clients during this engagement?" },
      { key: "q19OtherRestrictions", type: "text", label: "Aside from general health & safety or site rules, does the client require you to conform in any other way?" },
      { key: "q20PartOfTeam", type: "text", label: "Are you part of a team? If so, is it made up of employees, other contractors, or both?" },
      { key: "q21ManageClientStaff", type: "yesno", label: "Are you required to manage the client’s staff?" },
      { key: "q22TreatedAsEmployee", type: "text", label: "Are you treated the same as the client’s employees, or are there clear differences?", tip: "Examples: do you get a staff pass, attend staff events, appear in the internal directory, or use a corporate email address?" },
      { key: "q23ClientProvidesBenefits", type: "yesno", label: "Does the client provide you with any employee-style benefits (sick pay, parental pay, pension)?" },
      { key: "q24ServicesDescription", type: "text", label: "In a few sentences, how are the services performed and how do you interact with the client?" },
      { key: "q25AutonomyInHours", type: "yesno", label: "Within the project timeframe, do you have autonomy over the hours or days you work?" },
    ],
  },
  {
    title: "Business development & financial risk",
    description: "Whether you operate as a genuine business that takes on financial risk.",
    icon: <TrendingUp size={18} />,
    questions: [
      { key: "q26Advertising", type: "yesno", label: "Does your company advertise or market itself (other than through agencies)?" },
      { key: "q27BusinessStationery", type: "yesno", label: "Have you invested in business stationery (letterheads, business cards, etc.)?" },
      { key: "q28DevelopingBusiness", type: "yesno", label: "Are you actively developing the business — new services, tendering, or ad-hoc consultancy?" },
      { key: "q29HomeOffice", type: "text", label: "Do you have a home office with equipment to support your business? Would you class it as a substantial investment?" },
      { key: "q30ServicesFromHome", type: "yesno", label: "Do you carry out any of the services from your home office?" },
      { key: "q31TrainingSpend", type: "text", label: "Does your company pay for training? Roughly how much a year, and is any of it speculative?", tip: "“Speculative” means training you fund yourself that may not be used on a specific contract — a sign of investing in your own business." },
      { key: "q32BadDebtRisk", type: "yesno", label: "Is your business exposed to bad debts (invoiced work that might not be paid)?" },
      { key: "q33OwnEquipment", type: "yesno", label: "Are you required to provide your own equipment for the assignment?" },
      { key: "q34RectifyDefects", type: "yesno", label: "Would you have to put right any defective work at your own expense / in your own time?" },
      { key: "q35BusinessInsurance", type: "yesno", label: "Does your business hold professional insurances (Professional Indemnity, Employer’s & Public Liability)?" },
    ],
  },
  {
    title: "Off-payroll & status determination",
    description: "Since April 2021, for medium and large clients it’s the client — not you — who decides your status. This tells us which rules apply.",
    icon: <Landmark size={18} />,
    questions: [
      { key: "engagementRoute", type: "choice", options: ["Direct with the end client", "Through an agency", "Through an umbrella company"], label: "How are you engaged for this work?" },
      { key: "clientSector", type: "choice", options: ["Public sector", "Private sector", "Not sure"], label: "Is the end client in the public or private sector?" },
      { key: "endClientSmall", type: "choice", options: ["Yes", "No", "Not sure"], label: "Is the end client a small company?", tip: "If the client is medium or large, the off-payroll rules make THEM responsible for deciding your status (and giving you an SDS). If the client is small, responsibility stays with your own company. Size is based on the client’s turnover, balance sheet and staff." },
      { key: "sdsIssued", type: "choice", options: ["Yes", "No", "Not sure"], label: "Has the client given you a Status Determination Statement (SDS)?", tip: "An SDS is the client’s formal written decision on your IR35 status, with reasons. Medium/large clients must provide one." },
      { key: "sdsConclusion", type: "choice", options: ["Outside IR35", "Inside IR35", "Not sure"], label: "If an SDS was issued, what did it conclude?" },
    ],
  },
  {
    title: "Evidence & prior reviews",
    description: "Anything that already supports a view on your status.",
    icon: <ShieldCheck size={18} />,
    questions: [
      { key: "cestResult", type: "choice", options: ["Outside IR35", "Inside IR35", "Unable to determine", "Haven't run it"], label: "Have you run HMRC’s CEST tool? If so, what was the result?", tip: "CEST is HMRC’s free online “Check Employment Status for Tax” tool. The result isn’t legally binding, but HMRC will stand by it if your answers are accurate and reflect how you really work." },
      { key: "confirmationOfArrangements", type: "choice", options: ["Yes", "No", "Not sure"], label: "Would the end client be willing to sign a Confirmation of Arrangements?", tip: "A Confirmation of Arrangements is a document the end client signs confirming how you actually work day-to-day. It’s useful supporting evidence if HMRC ever questions the contract — as long as it matches reality." },
      { key: "priorIr35Review", type: "text", label: "Has this contract, or one with this client, been IR35-reviewed before? If so, what was the outcome?" },
    ],
  },
];

const CONTRACT_STATUS_OPTIONS = [
  { value: "New - not yet started", label: "Brand new", description: "A contract you’re about to start or considering — not begun yet." },
  { value: "In progress", label: "In progress", description: "A contract you’re currently working under." },
  { value: "Renewal / extension", label: "Renewal / extension", description: "An extension or renewal of an existing engagement." },
];

const ACCEPTED_FILE = ".pdf,.jpg,.jpeg,.tif,.tiff,.doc,.docx,.bmp,.gif";
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB — keeps the base64 body under Vercel's ~4.5MB limit

interface ContractRow {
  startDate: string;
  endDate: string;
  client: string;
  agency: string;
}

// Shared styling — lifted from the sign-up form so this matches the new design.
const inputCls =
  "w-full px-4 py-3.5 border border-gray-200 rounded-xl text-text placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all bg-white text-[15px] hover:border-gray-300";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1)); // strip "data:...;base64,"
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function IR35Form() {
  const brand = useBrand();
  const searchParams = useSearchParams();
  // The questionnaire is sent as a personalised link, so we already know the
  // client. The link carries the Salesforce Account id, which we forward so the
  // record is linked on creation (no need to ask for company name / email).
  const accountId = searchParams.get("aid") ?? searchParams.get("account") ?? "";

  const [contact, setContact] = useState({
    firstName: "", lastName: "", position: "", endClient: "", agency: "",
    contractStartDate: "", contractEndDate: "", contractStatus: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [pastContracts, setPastContracts] = useState<ContractRow[]>([
    { startDate: "", endDate: "", client: "", agency: "" },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const hasContract = contact.contractStatus !== "";

  const setContactField = (k: string, v: string) => setContact((c) => ({ ...c, [k]: v }));
  const setAnswer = (k: string, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  const updateContractRow = (i: number, k: keyof ContractRow, v: string) =>
    setPastContracts((rows) => rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  const addContractRow = () =>
    setPastContracts((rows) => [...rows, { startDate: "", endDate: "", client: "", agency: "" }]);
  const removeContractRow = (i: number) =>
    setPastContracts((rows) => rows.filter((_, idx) => idx !== i));

  const onFileChange = (f: File | null) => {
    setFileError(null);
    if (f && f.size > MAX_FILE_BYTES) {
      setFile(null);
      setFileError("Please upload a file smaller than 4MB.");
      return;
    }
    setFile(f);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!contact.firstName.trim() || !contact.lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (!contact.contractStatus) {
        setError("Please tell us whether this is a new, ongoing or renewing contract.");
        return;
      }

      setSubmitting(true);
      try {
        let contractFile: { fileName: string; contentType: string; base64: string } | undefined;
        if (file) {
          contractFile = {
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
            base64: await readFileAsBase64(file),
          };
        }

        const filledContracts = pastContracts.filter(
          (r) => r.startDate || r.endDate || r.client || r.agency
        );

        const payload = {
          ...contact,
          ...answers,
          accountId,
          additionalInformation,
          pastContracts: filledContracts,
          contractFile,
          website,
        };

        const res = await fetch("/api/ir35-opinion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Something went wrong. Please try again.");
        }
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [contact, answers, accountId, additionalInformation, pastContracts, file, website]
  );

  // Renders a questionnaire section card (optionally with the contract fields on top).
  const renderSection = (section: SectionDef) => (
    <SectionCard key={section.title} icon={section.icon} title={section.title}
      description={section.description}>
      <div className="space-y-5">
        {section.withContractFields && (
          <>
            <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
              <FieldWrapper label="Contract start date">
                <input type="date" className={inputCls} value={contact.contractStartDate}
                  onChange={(e) => setContactField("contractStartDate", e.target.value)} />
              </FieldWrapper>
              <FieldWrapper label="Contract end date">
                <input type="date" className={inputCls} value={contact.contractEndDate}
                  onChange={(e) => setContactField("contractEndDate", e.target.value)} />
              </FieldWrapper>
            </div>
            <FieldWrapper label="Upload a copy of your contract"
              hint="The single biggest help to our review. PDF, JPG, TIFF, DOC, DOCX, BMP or GIF — max 4MB.">
              <label className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3.5 cursor-pointer hover:border-primary hover:bg-primary/[0.02] transition-all">
                <UploadCloud className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-text-light truncate">
                  {file ? file.name : "Click to choose a file"}
                </span>
                <input type="file" accept={ACCEPTED_FILE} className="hidden"
                  onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
              </label>
              {fileError && <p className="text-xs text-red-500 mt-1.5 font-medium">{fileError}</p>}
            </FieldWrapper>
          </>
        )}
        {section.questions.map((q) => (
          <FieldWrapper key={q.key} label={q.label} hint={q.hint} tip={q.tip}>
            {q.type === "yesno" ? (
              <Choice value={answers[q.key]} onChange={(v) => setAnswer(q.key, v)}
                name={q.key} options={["Yes", "No"]} />
            ) : q.type === "choice" ? (
              <Choice value={answers[q.key]} onChange={(v) => setAnswer(q.key, v)}
                name={q.key} options={q.options ?? []} />
            ) : (
              <textarea rows={3} className={inputCls} value={answers[q.key] ?? ""}
                onChange={(e) => setAnswer(q.key, e.target.value)} />
            )}
          </FieldWrapper>
        ))}
      </div>
    </SectionCard>
  );

  if (submitted) {
    return (
      <FormPageLayout title="IR35 Opinion Questionnaire">
        <div className="py-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-black text-dark mb-3">Thank you — we&apos;ve received your questionnaire</h2>
          <p className="text-text-light leading-relaxed">
            One of our accountants will review your answers alongside your contract, and
            will be in touch with our IR35 opinion. If we need anything further, we&apos;ll let you know.
          </p>
        </div>
      </FormPageLayout>
    );
  }

  return (
    <FormPageLayout
      title="IR35 Opinion Questionnaire"
      description={`Tell us about your engagement and the ${brand.name} team will review it and provide an IR35 opinion.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InfoBox icon={<Info size={18} />}>
          An IR35 assessment looks at <strong>two things together</strong>: the wording of your
          written contract <em>and</em> how you actually work day-to-day with the client. HMRC can
          look past the paperwork to the reality, so we ask for both — please upload your contract
          and answer the questions as accurately as you can. There are no right or wrong answers, and
          the more detail you give, the more reliable our opinion will be.
        </InfoBox>

        {/* ── Your details ── */}
        <SectionCard icon={<User size={18} />} title="Your details"
          description="Tell us who’s completing this questionnaire.">
          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <FieldWrapper label="First name" required>
              <input className={inputCls} value={contact.firstName}
                onChange={(e) => setContactField("firstName", e.target.value)} required />
            </FieldWrapper>
            <FieldWrapper label="Last name" required>
              <input className={inputCls} value={contact.lastName}
                onChange={(e) => setContactField("lastName", e.target.value)} required />
            </FieldWrapper>
            <FieldWrapper label="Position" hint="Your role on the engagement.">
              <input className={inputCls} value={contact.position}
                onChange={(e) => setContactField("position", e.target.value)} />
            </FieldWrapper>
            <div className="hidden sm:block" />
            <FieldWrapper label="End client" hint="The organisation the work is ultimately for.">
              <input className={inputCls} value={contact.endClient}
                onChange={(e) => setContactField("endClient", e.target.value)} />
            </FieldWrapper>
            <FieldWrapper label="Agency" hint="Leave blank if you contract directly.">
              <input className={inputCls} value={contact.agency}
                onChange={(e) => setContactField("agency", e.target.value)} />
            </FieldWrapper>
          </div>
        </SectionCard>

        {/* ── Past contracts ── */}
        <SectionCard icon={<ClipboardList size={18} />} title="Contracts in the past two years"
          description="List the contracts you’ve worked through your company over the last two years.">
          <div className="space-y-3">
            {pastContracts.map((row, i) => (
              <div key={i}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-end rounded-xl bg-gray-50/70 border border-gray-100 p-3">
                <CompactField label="Start date">
                  <input type="date" className={inputCls} value={row.startDate}
                    onChange={(e) => updateContractRow(i, "startDate", e.target.value)} />
                </CompactField>
                <CompactField label="End date">
                  <input type="date" className={inputCls} value={row.endDate}
                    onChange={(e) => updateContractRow(i, "endDate", e.target.value)} />
                </CompactField>
                <CompactField label="Client">
                  <input className={inputCls} value={row.client}
                    onChange={(e) => updateContractRow(i, "client", e.target.value)} />
                </CompactField>
                <CompactField label="Agency">
                  <input className={inputCls} value={row.agency}
                    onChange={(e) => updateContractRow(i, "agency", e.target.value)} />
                </CompactField>
                <button type="button" onClick={() => removeContractRow(i)}
                  disabled={pastContracts.length === 1}
                  className="h-[52px] px-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                  aria-label="Remove contract">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addContractRow}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/[0.02] transition-all text-sm font-semibold text-text-light hover:text-primary">
            <Plus size={16} /> Add another contract
          </button>
        </SectionCard>

        {/* ── Contracting profile (always shown) ── */}
        {renderSection(CONTRACTING_PROFILE)}

        {/* ── About this contract — the gate ── */}
        <SectionCard icon={<CalendarClock size={18} />} title="About this contract"
          description="Choose the contract you’d like us to review — this reveals the contract-specific questions below.">
          <FieldWrapper label="Is this a new contract, one in progress, or a renewal?" required>
            <div className="grid sm:grid-cols-3 gap-3">
              {CONTRACT_STATUS_OPTIONS.map((opt) => {
                const active = contact.contractStatus === opt.value;
                return (
                  <button key={opt.value} type="button"
                    onClick={() => setContactField("contractStatus", opt.value)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      active ? "border-primary bg-primary/5" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}>
                    <span className={`block text-sm font-bold ${active ? "text-primary" : "text-dark"}`}>{opt.label}</span>
                    <span className="block text-xs text-text-light mt-1 leading-relaxed">{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </FieldWrapper>
          {contact.contractStatus === "New - not yet started" && (
            <InfoBox icon={<Info size={18} />}>
              As this contract hasn’t started yet, please answer the questions below based on
              <strong> how you expect to work</strong>. Anything that asks what has happened so far
              (for example whether you’ve sent a substitute) can be left blank.
            </InfoBox>
          )}
        </SectionCard>

        {/* ── Contract-specific sections — gated behind a chosen status ── */}
        {hasContract && (
          <>
            {CONTRACT_SECTIONS.map(renderSection)}

            <SectionCard icon={<FileText size={18} />} title="Anything else?"
              description="Add any further detail that helps us understand your working arrangements.">
              <FieldWrapper label="Additional information">
                <textarea rows={4} className={inputCls} value={additionalInformation}
                  onChange={(e) => setAdditionalInformation(e.target.value)} />
              </FieldWrapper>
            </SectionCard>
          </>
        )}

        {/* honeypot — off-screen, not tab-reachable */}
        <input type="text" name="website" value={website} tabIndex={-1} autoComplete="off"
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute left-[-9999px] w-px h-px opacity-0" aria-hidden="true" />

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 leading-relaxed">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button type="submit" disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-white hover:bg-primary-dark disabled:opacity-60 transition-colors shadow-sm">
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {submitting ? "Submitting…" : "Submit questionnaire"}
          </button>
        </div>
      </form>
    </FormPageLayout>
  );
}

export default function IR35OpinionQuestionnairePage() {
  return (
    <Suspense>
      <IR35Form />
    </Suspense>
  );
}

// ─── Reusable design pieces (matched to the sign-up form) ────────────────────

function SectionCard({ icon, title, description, children }: {
  icon: React.ReactNode; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow p-6 md:p-7 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-bold text-dark text-base leading-tight tracking-tight">{title}</h3>
          {description && <p className="text-sm text-text-light mt-1 leading-relaxed">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function FieldWrapper({ label, required, hint, tip, children }: {
  label: string; required?: boolean; hint?: string; tip?: string; children: React.ReactNode;
}) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-[13px] font-semibold text-dark tracking-tight leading-snug">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {tip && (
          <div className="relative shrink-0">
            <button type="button"
              onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}
              onClick={() => setShowTip((v) => !v)}
              className="text-text-light hover:text-primary transition-colors" aria-label="More information">
              <HelpCircle size={14} />
            </button>
            {showTip && (
              <div className="absolute z-10 left-6 top-0 w-64 bg-dark text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
                {tip}
              </div>
            )}
          </div>
        )}
      </div>
      {children}
      {hint && <p className="text-xs text-text-light mt-1.5">{hint}</p>}
    </div>
  );
}

function CompactField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-text-light mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Choice({ value, onChange, name, options }: {
  value?: string; onChange: (v: string) => void; name: string; options: string[];
}) {
  // Two short options (Yes/No) sit side by side; longer option sets wrap.
  const isBinary = options.length === 2;
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button key={opt} type="button" role="radio" aria-checked={active}
            onClick={() => onChange(active ? "" : opt)}
            className={`${isBinary ? "flex-1 sm:flex-none sm:min-w-[120px]" : ""} px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              active
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 bg-white text-text-light hover:border-gray-300"
            }`}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function InfoBox({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-primary/20 bg-primary/[0.04] text-sm leading-relaxed text-primary-dark">
      {icon && <div className="shrink-0 mt-0.5 text-primary">{icon}</div>}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
