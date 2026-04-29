import FormPageLayout from "@/components/layout/FormPageLayout";

// ---- SVG Icon Components ----

function IconUserPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

function IconCalendarClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.8 15.8 20 18l-2.2 2.2" />
      <path d="M17.8 15.8c.3-.4.6-.8.9-1.3" />
      <path d="M15 22v-3h3" />
    </svg>
  );
}

function IconAlertCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9.5 16h5" />
      <path d="M9.5 12h5" />
      <path d="M9.5 8h5" />
    </svg>
  );
}

function IconUserCheck({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function IconFileCheck({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

function IconFingerprint({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" />
      <path d="M12 2a10 10 0 0 1 8.447 4.5" />
      <path d="M12 2a10 10 0 0 0-8.447 4.5" />
      <path d="M12 20a10 10 0 0 0 8.447-4.5" />
      <path d="M12 20a10 10 0 0 1-8.447-4.5" />
      <path d="M12 14a2 2 0 0 1 2 2" />
      <path d="M12 14a2 2 0 0 0-2 2" />
      <path d="M12 14a2 2 0 0 0 2-2" />
      <path d="M12 14a2 2 0 0 1-2-2" />
      <path d="M12 10a2 2 0 0 0 2-2" />
      <path d="M12 10a2 2 0 0 1-2-2" />
    </svg>
  );
}

function IconDatabase({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function IconHandshake({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2 4-4" />
      <path d="m5 12 2 2 4-4" />
      <path d="M12 19L2 9l6.5-6.5a1.28 1.28 0 0 1 1.8 0L22 12l-4.5 4.5a1.28 1.28 0 0 1-1.8 0Z" />
    </svg>
  );
}

function IconCheckCircle({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconShieldCheck({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// ---- Sub-components ----

function FlowArrow() {
  return (
    <div className="flex justify-center text-[#A0B9C0] text-3xl leading-none py-1">↓</div>
  );
}

function TimelineItem({ date, text, isLast = false }: { date: string; text: string; isLast?: boolean }) {
  return (
    <div className="relative pl-10 pb-8">
      {!isLast && (
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[#A0B9C0]" />
      )}
      <div className="absolute left-[10px] top-[5px] w-5 h-5 rounded-full bg-[#34545D] border-[3px] border-[#F8FAFC]" />
      <h3 className="text-lg font-bold text-[#34545D]">{date}</h3>
      <p className="text-[#5D7B83]">{text}</p>
    </div>
  );
}

function GreenCheckItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <span className="mr-2 text-[#7CB342] mt-1 shrink-0">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

// ---- Page ----

export default function CompaniesHouseVerificationPage() {
  return (
    <>
      <FormPageLayout
        title="Understanding the New Companies House Rules"
        description="Simplifying the Economic Crime and Corporate Transparency Act for You"
      >
        {/* intentionally empty — content lives below */}
        <div />
      </FormPageLayout>

      <div className="bg-[#F8FAFC] py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">

          {/* Why These Changes Matter */}
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-3xl font-bold text-[#34545D] mb-4">Why These Changes Matter</h2>
            <p className="text-[#5D7B83] max-w-4xl mx-auto mb-6">
              The Economic Crime and Corporate Transparency Act (ECCTA) gives Companies House new powers to query information, strengthen checks on company names, introduce new rules for registered office addresses, and require new lawful purpose statements. These changes are designed to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#E0EBF0] p-4 rounded-lg">
                <p className="text-5xl">🛡️</p>
                <h3 className="text-xl font-semibold text-[#34545D] mt-2">Protect Your Business</h3>
                <p className="text-sm text-[#5D7B83] mt-1">To prevent companies from being used for unlawful activities and protect legitimate businesses from fraud.</p>
              </div>
              <div className="bg-[#E0EBF0] p-4 rounded-lg">
                <p className="text-5xl">🔎</p>
                <h3 className="text-xl font-semibold text-[#34545D] mt-2">Ensure Accuracy</h3>
                <p className="text-sm text-[#5D7B83] mt-1">To ensure that the information on the Companies House register is accurate and complete, providing reliable data for all.</p>
              </div>
              <div className="bg-[#E0EBF0] p-4 rounded-lg">
                <p className="text-5xl">🏛️</p>
                <h3 className="text-xl font-semibold text-[#34545D] mt-2">Strengthen Compliance</h3>
                <p className="text-sm text-[#5D7B83] mt-1">To ensure that all required documents are delivered to Companies House correctly and on time.</p>
              </div>
            </div>
          </section>

          {/* What You Need to Do */}
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-3xl font-bold text-[#34545D] mb-4">What You Need to Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="bg-[#E0EBF0] p-4 rounded-lg flex flex-col items-center">
                <span className="text-[#34545D]"><IconUserPlus /></span>
                <h3 className="text-xl font-semibold text-[#34545D] mt-2">Verify your Identity</h3>
                <p className="text-[#5D7B83] text-sm mt-2">
                  Anyone who is an officer of a company (Directors &amp; Company Secretaries), or Shareholders with a 25% or more holding in a company will have to prove they are who they say they are by verifying their identity (IDV).
                </p>
              </div>
              <div className="bg-[#E0EBF0] p-4 rounded-lg flex flex-col items-center">
                <span className="text-[#34545D]"><IconCalendarClock /></span>
                <h3 className="text-xl font-semibold text-[#34545D] mt-2">Existing &amp; New Companies</h3>
                <ul className="list-disc list-inside text-sm text-[#5D7B83] space-y-1 ml-4 mt-2 text-left">
                  <li>Applies to existing Officers and Shareholders, with a transition period for verification.</li>
                  <li>Mandatory for all new registered company Directors, Company Secretaries, and Shareholders.</li>
                  <li>Also applies to those delivering documents to the Registrar (Clever).</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center">
                <span className="text-red-600"><IconAlertCircle /></span>
                <h3 className="text-xl font-semibold text-red-700 mt-2">Act Soon</h3>
                <p className="text-red-700 font-semibold text-sm mt-2">
                  It is important to adhere to these new rules as soon as possible, as in the near future, if you have not verified your identity Clever will not be able to file the necessary documents with Companies House.
                </p>
              </div>
            </div>
          </section>

          {/* Who Needs Verification + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <section className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
              <h2 className="text-3xl font-bold text-[#34545D] mb-4">Who Needs to Be Verified?</h2>
              <p className="text-[#5D7B83] mb-6 text-sm">
                Under the new ECCTA regulations, key individuals associated with UK companies are now required to verify their identity with Companies House. This ensures greater transparency and helps combat economic crime.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#E0EBF0] p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-[#34545D]"><IconUser /></span>
                  <h3 className="text-base font-semibold text-[#34545D] mt-2">Directors</h3>
                </div>
                <div className="bg-[#E0EBF0] p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-[#34545D]"><IconUsers /></span>
                  <h3 className="text-base font-semibold text-[#34545D] mt-2">PSCs (Persons with Significant Control)</h3>
                </div>
                <div className="bg-[#E0EBF0] p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-[#34545D]"><IconBriefcase /></span>
                  <h3 className="text-base font-semibold text-[#34545D] mt-2">Company Secretaries</h3>
                </div>
                <div className="bg-[#E0EBF0] p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-[#34545D]"><IconBuilding /></span>
                  <h3 className="text-base font-semibold text-[#34545D] mt-2">Others Involved in Company Management</h3>
                </div>
              </div>
            </section>

            <section className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-center text-[#34545D] mb-4">Important Dates for Your Identity Verification*</h2>
              <p className="text-[#5D7B83] text-center mb-8 text-sm">
                The rollout of identity verification checks is phased. We&apos;ll guide you through the key deadlines that apply to you.
              </p>
              <div className="relative">
                <TimelineItem
                  date="18 March 2025"
                  text="Clever can register with Companies House to test systems and encourage early client adoption."
                />
                <TimelineItem
                  date="08 April 2025"
                  text="You can voluntarily verify your identity if you are a Director or Person with Significant Control (PSC)."
                />
                <TimelineItem
                  date="Autumn 2025"
                  text="Identity verification becomes mandatory for all new company incorporations and newly appointed directors and PSCs."
                />
                <TimelineItem
                  date="Autumn 2025 – 2026"
                  text="A 12-month transition period begins for existing directors and PSCs to complete their identity verification."
                />
                <TimelineItem
                  date="Autumn 2026"
                  text="Existing directors and PSCs must have completed identity verification by this date."
                  isLast
                />
              </div>
              <p className="text-sm text-center text-gray-500 mt-4">*These dates are subject to change by Companies House.</p>
            </section>
          </div>

          {/* How Clever Supports You */}
          <section className="bg-[#34545D] text-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-center mb-6">How Clever Supports You</h2>
            <p className="text-[#E0EBF0] text-center max-w-3xl mx-auto mb-8">
              Under these new regulations, Clever is committed to ensuring your compliance. We will guide you through the identity verification process, ensuring all requirements are met seamlessly and efficiently.
            </p>
            <h3 className="text-2xl font-bold text-center mb-4">What We Do to Verify Your Identity:</h3>
            <ul className="list-none text-[#E0EBF0] max-w-2xl mx-auto mb-8 space-y-3">
              <GreenCheckItem icon={<IconUserCheck />}>
                We collect your full name, date of birth, and address.
              </GreenCheckItem>
              <GreenCheckItem icon={<IconFileCheck />}>
                We review documents that verify your identity.
              </GreenCheckItem>
              <GreenCheckItem icon={<IconFingerprint />}>
                We ensure your identity belongs to you by cross-referencing documents and, if applicable, biometric data.
              </GreenCheckItem>
              <GreenCheckItem icon={<IconDatabase />}>
                We maintain comprehensive records of all identity checks for the required period.
              </GreenCheckItem>
            </ul>
            <p className="text-[#E0EBF0] text-center max-w-3xl mx-auto mt-6">
              Please note: Clever will charge a small fee of £49 + VAT for this service as a one-off cost.
            </p>
          </section>

          {/* The Two Paths to Verification */}
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-center text-[#34545D] mb-2">The Two Paths to Verification</h2>
            <p className="text-[#5D7B83] text-center max-w-3xl mx-auto mb-8">
              You have two main ways to complete your identity verification, and we can assist with both: using a digital app or a manual review process. Both paths require strict adherence to Companies House&apos;s rigorous standards.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Path 1 */}
              <div className="bg-[#E0EBF0] p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-[#34545D] mb-4 text-center">
                  Path 1: Clever Handles Your Verification{" "}
                  <span className="text-[#4CAF50]">(Recommended)</span>
                </h3>
                <div className="space-y-4">
                  <FlowArrow />
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-[#A0B9C0]">
                    <p className="text-[#5D7B83]">
                      <span className="font-semibold text-[#34545D]">Step 1.</span> Complete a quick identification check via our partner, Credas, and provide us with suitable identification such as a biometric passport and a recent utility bill.
                    </p>
                  </div>
                  <FlowArrow />
                  <div className="p-4 bg-[#DCEDC8] rounded-lg">
                    <p className="text-[#5D7B83]">
                      <span className="font-semibold text-[#34545D]">Step 2.</span> Once reviewed and approved by us, Companies House will send an email confirming that your identity has been verified. This email will contain a unique verification code you will need when transacting with Companies House.{" "}
                      <span className="underline font-semibold text-[#34545D]">Please share this unique ID code with us for our records and future filings.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Path 2 */}
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-[#34545D] text-center mb-4">Path 2: You Self-Verify Directly with Companies House</h3>
                <p className="text-[#5D7B83] text-center mb-6">
                  If you prefer to verify your identity yourself, please follow these steps:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-[#A0B9C0]">
                    <span className="font-semibold text-[#34545D]">1. Visit Companies House:</span>{" "}
                    <a href="https://www.gov.uk/guidance/verify-your-identity-for-companies-house" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] underline font-medium">
                      Verify your identity for Companies House
                    </a>
                  </div>
                  <FlowArrow />
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-[#A0B9C0]">
                    <span className="font-semibold text-[#34545D]">2. Prepare Your Documents:</span> You&apos;ll need one of the following:
                    <ul className="list-disc list-inside text-sm text-[#5D7B83] space-y-1 ml-4 mt-2">
                      <li>Biometric passport from any country</li>
                      <li>UK photo driving licence (full or provisional)</li>
                      <li>UK biometric residence permit (BRP)</li>
                      <li>UK biometric residence card (BRC)</li>
                      <li>UK Frontier Worker permit (FWP)</li>
                      <li>Your current address, and the year you moved in</li>
                    </ul>
                  </div>
                  <FlowArrow />
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-[#A0B9C0]">
                    <span className="font-semibold text-[#34545D]">3. GOV.UK One Login:</span> Sign in to or create a GOV.UK One Login:{" "}
                    <a href="https://signin.account.gov.uk/sign-in-or-create" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] underline font-medium">
                      GOV.UK One Login
                    </a>
                  </div>
                  <FlowArrow />
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-[#A0B9C0]">
                    <span className="font-semibold text-[#34545D]">4. Use the App:</span> Download the Gov One Login ID app from your phone&apos;s app store and follow the instructions.
                  </div>
                  <FlowArrow />
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-[#A0B9C0]">
                    <span className="font-semibold text-[#34545D]">5. Get Your Personal Code:</span> Your unique Personal Code will be provided at the end of this process.
                  </div>
                  <FlowArrow />
                  <div className="p-3 bg-[#DCEDC8] rounded-lg text-center">
                    <span className="font-semibold text-[#34545D]">
                      6. <span className="underline">Inform Clever:</span> Please share your personal code with us as soon as possible, along with the codes for all other Directors, Company Secretaries, and People of Significant Control.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* The High Cost of Non-Compliance */}
          <section className="bg-red-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-xl">
            <h2 className="text-3xl font-bold text-center text-red-800 mb-6">The High Cost of Non-Compliance</h2>
            <p className="text-red-700 text-center max-w-3xl mx-auto mb-8">
              Not completing the required identity verification can lead to serious issues, impacting your company and your ability to file with Companies House.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-red-700">
              <div className="p-4">
                <p className="text-5xl">🚫</p>
                <h3 className="text-xl font-bold mt-2">Rejected Filings</h3>
                <p className="text-sm mt-1">New company incorporations or other filings may be rejected by Companies House.</p>
              </div>
              <div className="p-4">
                <p className="text-5xl">💸</p>
                <h3 className="text-xl font-bold mt-2">Fines &amp; Penalties</h3>
                <p className="text-sm mt-1">Civil penalties issued by the Registrar of Companies, and potentially criminal proceedings with significant fines.</p>
              </div>
              <div className="p-4">
                <p className="text-5xl">⚖️</p>
                <h3 className="text-xl font-bold mt-2">Director Disqualification</h3>
                <p className="text-sm mt-1">Individuals who fail to verify their identity may be prohibited from holding a directorship.</p>
              </div>
              <div className="p-4">
                <p className="text-5xl">⚠️</p>
                <h3 className="text-xl font-bold mt-2">Compliance Issues</h3>
                <p className="text-sm mt-1">Your company may face compliance challenges and scrutiny from Companies House.</p>
              </div>
            </div>
          </section>

          {/* The ACSP Role */}
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-center text-[#34545D] mb-6">Our Role Under These New Regulations</h2>
            <p className="text-[#5D7B83] text-center max-w-4xl mx-auto mb-8">
              Clever is registered with Companies House as an Authorised Corporate Service Provider (ACSP). This means we are authorised to verify the identity of our clients and submit this information to Companies House on your behalf. Our role is to ensure that your company remains compliant with the new regulations by streamlining the identity verification process for you.
            </p>
            <ul className="list-none max-w-2xl mx-auto space-y-3 text-[#5D7B83]">
              <GreenCheckItem icon={<IconHandshake />}>
                We act as your trusted intermediary, simplifying the identity verification process.
              </GreenCheckItem>
              <GreenCheckItem icon={<IconCheckCircle />}>
                We ensure that all data submitted to Companies House is accurate and compliant.
              </GreenCheckItem>
              <GreenCheckItem icon={<IconShieldCheck />}>
                We provide a secure and efficient platform for your identity verification.
              </GreenCheckItem>
            </ul>
          </section>

        </div>

        <footer className="text-center mt-12 text-[#5D7B83] text-sm px-4">
          <p>© 2025 Clever. All rights reserved.</p>
          <p className="mt-1">
            For more information, visit{" "}
            <a href="https://www.gov.uk/companies-house" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] underline">
              Companies House official website
            </a>.
          </p>
        </footer>
      </div>
    </>
  );
}
