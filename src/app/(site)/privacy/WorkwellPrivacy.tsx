import Link from "next/link";

/**
 * Workwell privacy, data & cookie policy — native rendering of the content
 * previously hosted on workwellaccountancy.com/privacy-data-cookie-policy/.
 *
 * Reproduced verbatim from the published policy. NOTE: the published policy is
 * an engagement/employment privacy notice for the legal entity "Workwell People
 * Solutions Limited" (Co. No. 2407547) and is kept faithful here, including its
 * contact entity and phone number. Two headings on the source page
 * ("DATA PROTECTION PRINCIPLES" and "HOW WE WILL USE INFORMATION ABOUT YOU")
 * have no body text on the original and are intentionally omitted.
 */

type Block =
  | { type: "p"; text: string }
  | { type: "note"; text: string }
  | { type: "strong"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "deflist"; items: { label: string; text: string }[] };

type Section = { title?: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    blocks: [
      { type: "p", text: "Workwell is committed to protecting the privacy and security of your personal information." },
      { type: "p", text: "This privacy notice describes how we collect and use personal information about you during and after you have provided services to us, in accordance with the General Data Protection Regulation (GDPR)." },
      { type: "p", text: "Workwell is a “data controller”. This means that we are responsible for deciding how we hold and use personal information about you. We are required under data protection legislation to notify you of the information contained in this privacy notice." },
      { type: "p", text: "This notice applies to current and former employees, workers, limited company contractors and subcontractors. This notice does not form part of any contract of employment or other contract to provide services. We may update this notice at any time. For the avoidance of doubt, we are required by law to issue this notice to all individuals for which we hold personal data and the issuing of this notice does not alter the terms of any contracts we have agreed with you and does not alter the status under which we have contracted with you. For the avoidance of doubt the GDPR applies to all individuals regardless of their status and this privacy notice does not confer any employment or worker rights onto you, any rights and obligations that you may or may not have are derived from the contract you agreed with us and this notice does not form part of that contract." },
      { type: "p", text: "It is important that you read this notice, together with any other privacy notice we may provide on specific occasions when we are collecting or processing personal information about you, so that you are aware of how and why we are using such information." },
    ],
  },
  {
    title: "The kind of information we hold about you",
    blocks: [
      { type: "p", text: "Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data)." },
      { type: "p", text: "There are “special categories” of more sensitive personal data which require a higher level of protection." },
      { type: "p", text: "We may collect, store, and use the following categories of personal information about you:" },
      {
        type: "ul",
        items: [
          "Personal contact details such as name, title, addresses, telephone numbers, and personal email addresses.",
          "Date of birth.",
          "National Insurance number.",
          "Bank account details, payroll records and tax status information.",
          "Salary, annual leave and pension information for employees only.",
          "Start date.",
          "Location of workplace.",
          "Recruitment information for employees only (including copies of right to work documentation, references and other information included in a CV or cover letter or as part of the application process).",
          "Employment records for employees only (including job titles, work history, working hours, training records and professional memberships).",
          "Disciplinary and grievance information for employees only.",
          "Information about your use of our information and communications systems.",
          "Company details (including company name, address, company bank details, company UTR etc, VAT registration etc).",
        ],
      },
      { type: "p", text: "We may also collect, store and use the following “special categories” of more sensitive personal information for employees only:" },
      { type: "ul", items: ["Information about your health, including any medical condition, health and sickness records."] },
      { type: "note", text: "It should be noted that the above list are examples of information we may have concerning you and it does not mean that we do hold this information on you. For example, if you are engaged under a contract for services by us we will not hold employment records or disciplinary and grievance information about you." },
    ],
  },
  {
    title: "How is your personal information collected?",
    blocks: [
      { type: "p", text: "We typically collect personal information about employees, workers and Sub-contractors through the application, recruitment or engagement process, either directly from individuals or sometimes from our client or background check provider. We may sometimes collect additional information from third parties including former employers, credit reference agencies or other background check agencies." },
      { type: "p", text: "We will collect additional personal information in the course of the services you provide to us throughout the period of you provide services to us." },
      { type: "p", text: "If, under the contract you have agreed with us you have the right to send a substitute or engage hired assistants, we may need to collect some personal information relating to the substitute/assistants you choose to send for health and safety purposes and to ensure the substitute/assistants has the necessary skills and expertise to provide the services. Where this is the case we will notify you at the time." },
    ],
  },
  {
    title: "How we use particularly sensitive personal information",
    blocks: [
      { type: "p", text: "“Special categories” of particularly sensitive personal information require higher levels of protection. We need to have further justification for collecting, storing and using this type of personal information. We may process special categories of personal information in the following circumstances:" },
      {
        type: "ol",
        items: [
          "In limited circumstances, with your explicit written consent.",
          "Where we need to carry out our legal obligations and in line with our data protection policy.",
          "If it is needed in the public interest, such as for equal opportunities monitoring or in relation to our occupational pension scheme, and in line with our data protection policy.",
          "Where it is needed to assess your working capacity on health grounds, subject to appropriate confidentiality safeguards.",
        ],
      },
      { type: "p", text: "Less commonly, we may process this type of information where it is needed in relation to legal claims or where it is needed to protect your interests (or someone else's interests) and you are not capable of giving your consent, or where you have already made the information public. We may also process such information about members or former members in the course of legitimate business activities with the appropriate safeguards." },
      { type: "strong", text: "Our obligations as an engager:" },
      { type: "p", text: "For employees we may use your particularly sensitive personal information in the following ways:" },
      {
        type: "ul",
        items: [
          "We may use information relating to leaves of absence, which may include sickness absence or family related leaves, to comply with employment and other laws.",
          "We may use information about your physical or mental health, or disability status, to ensure your health and safety in the workplace and to assess your fitness to work, to provide appropriate workplace adjustments, to monitor and manage sickness absence and to administer benefits.",
        ],
      },
      { type: "strong", text: "Do we need your consent?" },
      { type: "p", text: "We do not need your consent if we use special categories of your personal information in accordance with our written policy to carry out our legal obligations or exercise specific rights. In limited circumstances, we may approach you for your written consent to allow us to process certain particularly sensitive data. If we do so, we will provide you with full details of the information that we would like and the reason we need it, so that you can carefully consider whether you wish to consent. You should be aware that it is not a condition of your contract with us that you agree to any request for consent from us." },
    ],
  },
  {
    title: "Information about criminal convictions",
    blocks: [
      { type: "p", text: "We may only use information relating to criminal convictions where the law allows us to do so. This will usually be where such processing is necessary to carry out our obligations and provided we do so in line with our data protection policy." },
      { type: "p", text: "Less commonly, we may use information relating to criminal convictions where it is necessary in relation to legal claims, where it is necessary to protect your interests (or someone else's interests) and you are not capable of giving your consent, or where you have already made the information public." },
      { type: "p", text: "We may also process such information about members or former members in the course of legitimate business activities with the appropriate safeguards." },
      { type: "p", text: "We do not envisage that we will hold information about criminal convictions." },
    ],
  },
  {
    title: "Automated decision-making",
    blocks: [
      { type: "p", text: "Automated decision-making takes place when an electronic system uses personal information to make a decision without human intervention. We are allowed to use automated decision-making in the following circumstances:" },
      {
        type: "ol",
        items: [
          "Where we have notified you of the decision and given you 21 days to request a reconsideration.",
          "Where it is necessary to perform the contract with you and appropriate measures are in place to safeguard your rights.",
          "In limited circumstances, with your explicit written consent and where appropriate measures are in place to safeguard your rights.",
        ],
      },
      { type: "p", text: "If we make an automated decision on the basis of any particularly sensitive personal information, we must have either your explicit written consent or it must be justified in the public interest, and we must also put in place appropriate measures to safeguard your rights." },
      { type: "p", text: "You will not be subject to decisions that will have a significant impact on you based solely on automated decision-making, unless we have a lawful basis for doing so and we have notified you." },
      { type: "p", text: "We do not envisage that any decisions will be taken about you using automated means, however we will notify you in writing if this position changes." },
    ],
  },
  {
    title: "Data sharing",
    blocks: [
      { type: "p", text: "We may have to share your data with third parties, including third-party service providers and other entities." },
      { type: "p", text: "We require third parties to respect the security of your data and to treat it in accordance with the law." },
      { type: "p", text: "We may transfer your personal information outside the EU." },
      { type: "p", text: "If we do, you can expect a similar degree of protection in respect of your personal information." },
      { type: "strong", text: "Why might you share my personal information with third parties?" },
      { type: "p", text: "We may share your personal information with third parties where required by law, where it is necessary to administer the working relationship with you or where we have another legitimate interest in doing so." },
      { type: "strong", text: "Which third-parties process my personal information?" },
      { type: "p", text: "The following categories of third party service providers MAY process personal information about you:" },
      {
        type: "ul",
        items: [
          "Payroll and banking services;",
          "Payroll administration;",
          "CRM developers;",
          "SMS services;",
          "Accounting and auditing;",
          "HMRC – tax collection purposes;",
          "Document management;",
          "Legal advisers;",
          "JSA Perks corporate rewards;",
          "Pension providers;",
          "Recruitment Agencies;",
          "Data destruction;",
          "Direct Debit;",
          "Business Continuity Plan providers.",
        ],
      },
      { type: "strong", text: "How secure is my information with third-party service providers and other entities in our group?" },
      { type: "p", text: "All our third-party service providers and other entities are required to take appropriate security measures to protect your personal information in line with our policies. We do not allow our third-party service providers to use your personal data for their own purposes. We only permit them to process your personal data for specified purposes and in accordance with our instructions." },
      { type: "strong", text: "What about other third parties?" },
      { type: "p", text: "We may share your personal information with other third parties, for example in the context of the possible sale or restructuring of the business. We may also need to share your personal information with a regulator or to otherwise comply with the law." },
    ],
  },
  {
    title: "Data security",
    blocks: [
      { type: "p", text: "We have put in place measures to protect the security of your information. Details of these measures are available upon request." },
      { type: "p", text: "Third parties will only process your personal information on our instructions and where they have agreed to treat the information confidentially and to keep it secure." },
      { type: "p", text: "We have put in place appropriate security measures to prevent your personal information from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal information to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal information on our instructions and they are subject to a duty of confidentiality. Details of these measures may be obtained from James Harris (Data Protection Manager)." },
      { type: "p", text: "We have put in place procedures to deal with any suspected data security breach and will notify you and any applicable regulator of a suspected breach where we are legally required to do so." },
    ],
  },
  {
    title: "Data retention",
    blocks: [
      { type: "strong", text: "How long will you use my information for?" },
      { type: "p", text: "We will only retain your personal information for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Details of retention periods for different aspects of your personal information are available in our retention policy which is available from James Harris. To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorised use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements." },
      { type: "p", text: "In some circumstances, we may anonymise your personal information so that it can no longer be associated with you, in which case we may use such information without further notice to you. Once you are no longer an employee, worker or subcontractor of the company we will retain and securely destroy your personal information in accordance with applicable laws and regulations." },
    ],
  },
  {
    title: "Rights of access, correction, erasure, and restriction",
    blocks: [
      { type: "strong", text: "Your duty to inform us of changes" },
      { type: "p", text: "It is important that the personal information we hold about you is accurate and current. Please keep us informed if your personal information changes during the period you provide services to us." },
      { type: "strong", text: "Your rights in connection with personal information" },
      { type: "p", text: "Under certain circumstances, by law you have the right to:" },
      {
        type: "deflist",
        items: [
          { label: "Request access", text: " to your personal information (commonly known as a “data subject access request”). This enables you to receive a copy of the personal information we hold about you and to check that we are lawfully processing it." },
          { label: "Request correction", text: " of the personal information that we hold about you. This enables you to have any incomplete or inaccurate information we hold about you corrected." },
          { label: "Request erasure", text: " of your personal information. This enables you to ask us to delete or remove personal information where there is no good reason for us continuing to process it. You also have the right to ask us to delete or remove your personal information where you have exercised your right to object to processing (see below)." },
          { label: "Object to processing", text: " of your personal information where we are relying on a legitimate interest (or those of a third party) and there is something about your particular situation which makes you want to object to processing on this ground. You also have the right to object where we are processing your personal information for direct marketing purposes." },
          { label: "Request the restriction", text: " of processing of your personal information. This enables you to ask us to suspend the processing of personal information about you, for example if you want us to establish its accuracy or the reason for processing it." },
          { label: "Request the transfer", text: " of your personal information to another party." },
        ],
      },
      { type: "p", text: "If you want to review, verify, correct or request erasure of your personal information, object to the processing of your personal data, or request that we transfer a copy of your personal information to another party, please contact James Harris in writing." },
      { type: "strong", text: "No fee usually required" },
      { type: "p", text: "You will not have to pay a fee to access your personal information (or to exercise any of the other rights). However, we may charge a reasonable fee if your request for access is clearly unfounded or excessive. Alternatively, we may refuse to comply with the request in such circumstances." },
      { type: "strong", text: "What we may need from you" },
      { type: "p", text: "We may need to request specific information from you to help us confirm your identity and ensure your right to access the information (or to exercise any of your other rights). This is another appropriate security measure to ensure that personal information is not disclosed to any person who has no right to receive it." },
    ],
  },
  {
    title: "Right to withdraw consent",
    blocks: [
      { type: "p", text: "In the limited circumstances where you may have provided your consent to the collection, processing and transfer of your personal information for a specific purpose, you have the right to withdraw your consent for that specific processing at any time. To withdraw your consent, please contact James Harris. Once we have received notification that you have withdrawn your consent, we will no longer process your information for the purpose or purposes you originally agreed to, unless we have another legitimate basis for doing so in law." },
    ],
  },
  {
    title: "Data protection manager",
    blocks: [
      { type: "p", text: "We have appointed a data privacy manager to oversee compliance with this privacy notice. If you have any questions about this privacy notice or how we handle your personal information, please contact the data privacy manager. You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues." },
    ],
  },
  {
    title: "Changes to this privacy notice",
    blocks: [
      { type: "p", text: "If you have any questions about this privacy notice, please contact James Harris, Data Protection Manager." },
    ],
  },
];

const COOKIE_CATEGORIES: { label: string; text: string }[] = [
  { label: "Functional — Always active", text: "The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network." },
  { label: "Preferences", text: "The technical storage or access is necessary for the legitimate purpose of storing preferences that are not requested by the subscriber or user." },
  { label: "Statistics", text: "The technical storage or access that is used exclusively for statistical purposes. The technical storage or access that is used exclusively for anonymous statistical purposes. Without a subpoena, voluntary compliance on the part of your Internet Service Provider, or additional records from a third party, information stored or retrieved for this purpose alone cannot usually be used to identify you." },
  { label: "Marketing", text: "The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes." },
];

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i} className="text-text-light leading-relaxed text-sm mb-4">{block.text}</p>;
          case "note":
            return <p key={i} className="text-text-light/80 italic leading-relaxed text-xs mb-4">{block.text}</p>;
          case "strong":
            return <p key={i} className="font-bold text-dark text-sm mt-5 mb-2">{block.text}</p>;
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-1.5 mb-4 text-text-light text-sm leading-relaxed">
                {block.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal pl-6 space-y-1.5 mb-4 text-text-light text-sm leading-relaxed">
                {block.items.map((it, j) => <li key={j}>{it}</li>)}
              </ol>
            );
          case "deflist":
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 mb-4 text-text-light text-sm leading-relaxed">
                {block.items.map((it, j) => (
                  <li key={j}><span className="font-semibold text-dark">{it.label}</span>{it.text}</li>
                ))}
              </ul>
            );
        }
      })}
    </>
  );
}

export default function WorkwellPrivacy() {
  return (
    <>
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black text-white mb-3">Privacy, Data &amp; Cookie Policy</h1>
          <p className="text-white/60">How we collect, use and protect your personal information.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,0 C480,50 960,50 1440,0 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <div key={i}>
                {section.title && <h2 className="text-xl font-black text-dark mb-3">{section.title}</h2>}
                <Blocks blocks={section.blocks} />
              </div>
            ))}
          </div>

          {/* Contact / data controller details — verbatim from the published policy */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-black text-dark mb-3">Contact</h2>
            <p className="text-dark font-bold text-sm">Workwell People Solutions Limited</p>
            <p className="text-text-light text-sm">Registered in England and Wales, No. 2407547</p>
            <p className="text-text-light text-sm mt-3 whitespace-pre-line">{"Radius House\n51 Clarendon Road\nWatford\nHertfordshire, WD17 1HP"}</p>
            <p className="text-text-light text-sm mt-3">
              Phone: <a href="tel:01923257257" className="text-primary hover:underline">01923 257257</a>
            </p>
            <Link href="/contact" className="text-primary hover:underline text-sm mt-3 inline-block">
              Contact us &rarr;
            </Link>
          </div>

          {/* Cookie policy */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-black text-dark mb-4">Cookie Policy</h2>
            <h3 className="text-lg font-bold text-dark mb-2">Manage Consent</h3>
            <p className="text-text-light leading-relaxed text-sm mb-6">
              To provide the best experiences, we use technologies like cookies to store and/or access device information. Consenting to these technologies will allow us to process data such as browsing behaviour or unique IDs on this site. Not consenting or withdrawing consent, may adversely affect certain features and functions.
            </p>
            <div className="space-y-4">
              {COOKIE_CATEGORIES.map((c) => (
                <div key={c.label}>
                  <p className="font-bold text-dark text-sm mb-1">{c.label}</p>
                  <p className="text-text-light leading-relaxed text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
