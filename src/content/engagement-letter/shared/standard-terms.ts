/**
 * Standard Terms — sections 1 through 15.
 * Identical between Sole Trader and Limited Company variants (verified against
 * the source PDFs — see docs/engagement-letter-content-diff.md for the full
 * placeholder + typo cleanup applied during transcription).
 *
 * Mail-merge tokens used here:
 *   {{joiningDate}}      — replaces the literal "(Joined date)" placeholder
 *   {{jurisdiction}}     — replaces the "England and Wales/ Scotland/ Northern Ireland" slash mess
 *   {{phoneNumber}}      — replaces the contact-line placeholder in §13
 *   {{supportEmail}}     — replaces same
 *   {{brandName}}        — short brand name, e.g. "Clever Accounts" / "Workwell Accountancy"
 *   {{brandLegalName}}   — registered name, e.g. "Clever Accounts Ltd"
 *   {{brandPrivacyUrl}}  — privacy notice URL referenced in §9
 *   {{brandPostalAddress}} — registered postal address (used in complaints procedure)
 */

import type { Section } from '../types';

export const STANDARD_TERMS: Section[] = [
  {
    id: 'std-01-introduction',
    number: '1',
    title: 'Introduction',
    body:
      'Thanks for engaging us as your accountants.\n\n' +
      'This letter and attached schedule(s) of service together with our standard terms of business dated {{joiningDate}} set out the basis upon which we will provide our services as accountants. It includes our and your respective responsibilities upon {{brandName}} taking this engagement.',
  },
  {
    id: 'std-02-applicable-law',
    number: '2',
    title: 'Applicable Law',
    body:
      'This engagement letter, the schedule of services and our standard terms and conditions of business are governed by, and should be construed in accordance with, the law and practice of {{jurisdiction}}. Each party agrees that the courts of {{jurisdiction}} will have exclusive jurisdiction in relation to any claim, dispute or difference concerning this engagement letter and any matter arising from it. Each party irrevocably waives any right to object to any action being brought in those Courts, to claim that the action has been brought in an inappropriate forum, or to claim that those Courts do not have jurisdiction.',
  },
  {
    id: 'std-03-acting-for-st',
    number: '3',
    title: 'Who are we acting for?',
    variantOnly: 'sole-trader',
    body:
      'We are acting for you and your business only. Where you would like us to act for anyone else (such as your spouse, a partnership, or a limited company) we will issue a separate engagement letter.',
  },
  {
    id: 'std-03-acting-for-lc',
    number: '3',
    title: 'Who are we acting for?',
    variantOnly: 'limited-company',
    body:
      'We are acting for you and your company only. Where you would like us to act for anyone else (such as your spouse, a partnership, or another limited company) we will issue a separate engagement letter.',
  },
  {
    id: 'std-04-mlr',
    number: '4',
    title: 'Money Laundering Regulations 2017, Client Identification and Verification',
    body:
      'As with other professional services firms, we are required to have appropriate risk-based policies and procedures for assessing and managing money laundering risks. It applies at the start of any business relationship and through the lifetime of the relationship. It includes undertaking appropriate client due diligence. We may request from you, and retain, such information and documentation as we require for these purposes and/or make searches of appropriate databases. If we are not able to obtain satisfactory evidence of your identity, we will not be able to proceed with the engagement.\n\n' +
      'Where you are a body corporate, we are also required to identify and verify your beneficial owners — generally, any individual who ultimately owns or controls more than 25% of the shares or voting rights, or otherwise exercises significant control over the entity. We are required to apply enhanced due diligence in higher-risk circumstances, including where you, or any of your beneficial owners, are a Politically Exposed Person (PEP), a family member of a PEP, or a known close associate of a PEP.\n\n' +
      'Our client due diligence is not a one-off process. We are required to apply ongoing monitoring throughout our relationship with you, which may include periodic re-verification of identity, source of funds enquiries, and review of the consistency of your business activity with the information we hold.\n\n' +
      'Copies of such records created as part of the client due diligence process, including any non-engagement documents relating to the client relationship and ongoing monitoring of it, will be retained by us for a period of six years after we cease to act for the business unless we are required to retain them under statutory obligation, or to retain them for legal proceedings. **By signing this engagement you consent to the retention of your due diligence records by us for up to ten years following the end of our engagement, in accordance with the Money Laundering Regulations 2017.**\n\n' +
      'In accordance with the Proceeds of Crime Act, the Terrorism Act, the Money Laundering Regulations 2017 and the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 you agree to waive your right to confidentiality to the extent of any report made, document provided, or information disclosed to the National Crime Agency (NCA).\n\n' +
      'You also acknowledge that we are required to report directly to the NCA without prior reference to you or your representatives if during undertaking any assignment the person undertaking the role of Money Laundering Reporting Officer becomes suspicious of money laundering.',
  },
  {
    id: 'std-05-scope',
    number: '5',
    title: 'Scope of Services / Areas of Engagement',
    body:
      'We have listed below the work which you have instructed us to carry out, the details of which are contained in the attached schedules. These schedules set out our respective responsibilities in relation to the work to be carried out. If we agree to carry out additional services for you, we will provide you with a new amended engagement letter.\n\n' +
      'Only the services which are listed in the attached schedules are included within the scope of our instructions. If there is any additional work you would like us to undertake that is not listed in the attached schedules, please let us know so that we may discuss your requirements.',
  },
  {
    id: 'std-06-commission',
    number: '6',
    title: 'Commission and Other Benefits',
    body:
      'In some circumstances, we may receive commissions or other benefits for introductions to other professionals or in respect of transactions which we arrange for you. The fees you would otherwise pay will not be reduced by the amount of the commissions or benefits.',
  },
  {
    id: 'std-07-confidentiality',
    number: '7',
    title: 'Confidentiality',
    body:
      'Communication between us is confidential and we shall take all reasonable steps to keep your information confidential except where we are required to disclose it by law, by regulatory bodies, by our insurers, or as part of an external peer review, or as set out in our privacy notice. Unless we are authorised by you to disclose information on your behalf, this undertaking will apply during and after this engagement. We may, on occasions, subcontract work on your affairs to other tax or accounting professionals. The subcontractors will be bound by our client confidentiality and security terms. By signing and returning this document, you are deemed to have given your consent to our use of subcontractors.\n\n' +
      'We reserve the right, for the purpose of promotional activity, training or for other business purposes, to mention that you are a client. As stated above, we will not disclose any confidential information.',
  },
  {
    id: 'std-08-conflict',
    number: '8',
    title: 'Conflict of Interest',
    body:
      'We will inform you if we become aware of any conflict of interest in our relationship with you, or in our relationship with you and another client. Where conflicts are identified which cannot be managed in a way that protects your interests, we regret that we will be unable to provide further services. If this arises, we will inform you promptly. We reserve the right to act for other clients whose interests are not the same as, or are adverse to, yours, subject to the obligations of confidentiality referred to above.\n\n' +
      'If there is a conflict of interest that is capable of being addressed successfully by the adoption of suitable safeguards to protect your interests, we will adopt those safeguards. We reserve the right to act for other clients whose interests are not the same as, or are adverse to, yours, subject to the obligations of confidentiality referred to above.',
  },
  {
    id: 'std-09-data-protection',
    number: '9',
    title: 'Data Protection',
    body:
      'We confirm that we will comply with the provisions of the UK General Data Protection Regulation (UK GDPR) when processing personal data about you and connected entities. These may include your business, your family, and your business partners.\n\n' +
      'Processing means:\n\n' +
      '- obtaining, recording, or holding personal data; or\n' +
      '- carrying out any operation or set of operations on personal data, including collecting and storing, organising, adapting, altering, using, disclosure (by any means) or removing (by any means) from the records, manual and digital.\n\n' +
      'The information we obtain, process, use and disclose will be necessary for:\n\n' +
      '- the performance of the contract;\n' +
      '- to comply with our legal and regulatory compliance and crime prevention;\n' +
      '- contacting you with details of other services where you have consented to us doing so;\n' +
      '- other legitimate interests relating to protection against potential claims and disciplinary action against us.\n\n' +
      'This includes, but is not limited to, purposes such as updating and enhancing our client records, analysis for management purposes and statutory returns. Further details on the processing of data are contained in our privacy notice ({{brandPrivacyUrl}}), which should be read alongside these terms and conditions.',
  },
  {
    id: 'std-10-period-of-engagement',
    number: '10',
    title: 'Period of Engagement & Disengagement',
    body:
      "This engagement will commence on {{joiningDate}} and will continue until terminated by either party. Either party may terminate this engagement on **one month's written notice**, which may be given by email, letter, or other written communication. We may terminate this engagement immediately, without notice, where you fail to cooperate with us, or where we have reason to believe that you have provided us or HMRC with misleading information.\n\n" +
      '- We will not be held responsible for any prior work or deadlines unless agreed by us in advance.\n' +
      '- Should we resign or be requested to resign, we will normally issue a disengagement letter to ensure that our respective responsibilities are clear.\n' +
      '- Termination will be without prejudice to any rights that may have accrued to either of us prior to termination.\n' +
      '- In the event of termination of this contract, we will endeavour to agree with you the arrangements for the completion of work in progress at that time, unless we are required for legal or regulatory reasons to cease work immediately. In this case, we will not be required to carry out further work and will not be responsible or liable for any consequences arising from termination.\n' +
      '- If you engage us for a one-off piece of work (for example, advice on a one-off transaction, or accounts and tax return for one year only) the engagement ceases as soon as that work is completed, unless otherwise agreed.\n' +
      '- The date of completion of the work is taken to be the termination date and we owe you no duties beyond that date, unless otherwise agreed.\n' +
      '- Where recurring work is provided (for example ongoing compliance work such as the completion of annual tax returns) the engagement ceases on the relevant date in relation to the termination as set out above. Unless immediate termination applies, in practice this means that the relevant termination date is (a) when you cease to pay us, or (b) a later mutually agreed date. We owe you no duties beyond the date of termination and will not undertake any further work. Should we have no contact with you for a period of 6 months or more, we may issue to your last known address a disengagement letter and thereafter cease to act.\n' +
      '- We reserve the right following termination, for any reason, to destroy any of your documents that we have not been able to return to you after a period of six months unless other laws or regulations require otherwise.',
  },
  {
    id: 'std-11-electronic-comms',
    number: '11',
    title: 'Electronic and Other Communication',
    body:
      'Unless you instruct us otherwise we may, where appropriate, communicate with you and with third parties via email or by other electronic means. The recipient is responsible for virus checking emails and any attachments. With electronic communication, there is a risk of non-receipt, delayed receipt, inadvertent misdirection or interception by third parties.\n\n' +
      'We use virus-scanning software to reduce the risk of viruses and similar damaging items being transmitted through emails or electronic storage devices. However electronic communication is not totally secure and we cannot be held responsible for damage or loss caused by viruses, nor for communications which are corrupted or altered after despatch. We do not accept any liability for problems or accidental errors relating to this means of communication, especially in relation to commercially sensitive material. These risks are an unfortunate but inevitable result of greater efficiency and lower costs.\n\n' +
      'Any communication by us with you sent through the postal system is deemed to arrive at your postal address 2-3 working days after the day that the document was sent. When accessing information held electronically by HMRC, we may have access to more information than we need and will only access records reasonably required to carry out the contract.\n\n' +
      'You are required to keep us up to date with accurate contact details at all times. This is important to ensure that communications and papers are not sent to the incorrect address.',
  },
  {
    id: 'std-12-retention',
    number: '12',
    title: 'Retention of Records and File Destruction',
    body:
      'During our work, we will collect information from you and others acting on your behalf and will return any original documents to you. You should retain them for six years following the end of the accounting year. Whilst certain documents may legally belong to you, unless you tell us not to, we intend to destroy correspondence and other papers that we store which are more than six years old, other than documents which we think may be of continuing significance to our work.',
  },
  {
    id: 'std-13-quality-of-service',
    number: '13',
    title: 'Quality of Service',
    body:
      'We aim to always provide a high quality of service. If at any time you would like to discuss with us how our service could be improved, or if you are dissatisfied with the service you are receiving, please let us know by initially contacting us on {{phoneNumber}} or {{supportEmail}}. We undertake to investigate any complaint carefully and promptly and to do all we can to explain the position to you. If we have given you a less than satisfactory service, we undertake to do everything reasonable to put it right. If you are still not satisfied you may of course refer the matter to one of our managers or directors. Where requested, a copy of the Complaints Procedure will be sent to you.',
  },
  {
    id: 'std-14-fees',
    number: '14',
    title: 'Fees',
    body:
      'Our fees have been agreed with you at the commencement of this engagement and will be taken over 12 equal instalments for your added convenience. {{brandName}} reserves the right to review your fee on a periodic basis and will try, wherever possible, to notify you within 30 days of any intended changes.\n\n' +
      "If it is necessary to carry out work outside the responsibilities outlined in this letter this will involve additional fees, particularly where your records are not completed to the agreed stage prior to preparing each year's accounts.\n\n" +
      'Additional time costs, where appropriate, will be computed based on the time spent on your affairs by staff, or we may agree a fixed fee for a single assignment.\n\n' +
      'Payment by direct debit for all fees is mandatory except where a different payment method has been agreed upfront, or payment has been taken via a third-party service in advance.\n\n' +
      'In the event of non-payment within our normal payment terms, we reserve the right to charge interest at 2% above base rate, calculated on the previous month-end balance.\n\n' +
      'We also reserve the right not to undertake any further work on your behalf and to exercise a general lien over the property (electronic or physical) in our possession until the outstanding fees and interest are settled in full. In this event, you will be advised accordingly. Where the engagement is suspended or terminated for whatever cause, all unbilled work in progress will become billable and all outstanding fees payable at that time without abatement or offset for whatever reason.',
  },
  {
    id: 'std-15-liability',
    number: '15',
    title: 'Limitation of Liability',
    body:
      'We will provide our services with reasonable care and skill. Our liability to you is limited to losses, damages, costs, and expenses caused by our negligence or wilful default.\n\n' +
      '**Exclusion of liability for loss caused by others.** We will not be liable if such losses, penalties, surcharges, interest, or additional tax liabilities are due to the acts or omissions of any other person, or due to the provision to us of incomplete, misleading, or false information, or if they are due to a failure to act on our advice or a failure to provide us with relevant information.\n\n' +
      '**Exclusion of liability in relation to circumstances beyond our control.** We will not be liable to you for any delay or failure to perform our obligations under this engagement letter if the delay or failure is caused by circumstances outside our reasonable control.\n\n' +
      '**Exclusion of liability relating to the discovery of fraud etc.** We will not be responsible or liable for any loss, damage or expense incurred or sustained if information material to the service we are providing is withheld or concealed from us, or misrepresented to us. This applies equally to fraudulent acts, misrepresentation, or wilful default on the part of any party to the transaction and their directors, officers, employees, agents, or advisers.\n\n' +
      'This exclusion shall not apply where such misrepresentation, withholding or concealment is, or should (in carrying out the procedures which we have agreed to perform with reasonable care and skill) have been, evident to us without further enquiry.\n\n' +
      '**Indemnity for unauthorised disclosure.** You agree to indemnify us and our agents in respect of any claim (including any claim for negligence) arising out of any unauthorised disclosure by you, or by any person for whom you are responsible, of our advice and opinions, whether in writing or otherwise. This indemnity will extend to the cost of defending any such claim, including payment at our usual rates for the time that we spend in defending it.\n\n' +
      '**Reliance on advice.** We will endeavour to record all advice on important matters in writing. Advice given orally is not intended to be relied upon unless confirmed in writing. Therefore, if we provide oral advice (for example during a meeting or a telephone conversation) and you wish to be able to rely on that advice, you must ask for the advice to be confirmed by us in writing.',
  },
  {
    id: 'std-16-investment-business',
    number: '16',
    title: 'Regulated Investment Activities',
    body:
      'We are not authorised by the Financial Conduct Authority under the Financial Services and Markets Act 2000. We do not provide investment advice. If during this engagement you require advice on investments (including any insurance products that are investments, pension transfers, or other regulated financial products), we will refer you to a firm authorised by the Financial Conduct Authority.',
  },
  {
    id: 'std-17-bribery-cfa',
    number: '17',
    title: 'Bribery and the Prevention of the Facilitation of Tax Evasion',
    body:
      'Each of us undertakes that, in connection with this engagement, we will:\n\n' +
      '- comply with all applicable laws relating to anti-bribery and anti-corruption, including the Bribery Act 2010;\n' +
      '- not engage in any activity, practice or conduct which would constitute the facilitation of tax evasion within the meaning of Part 3 of the Criminal Finances Act 2017; and\n' +
      '- have in place reasonable procedures designed to prevent the facilitation of tax evasion by persons acting on our behalf.\n\n' +
      'Breach of this clause by you will entitle us to terminate this engagement immediately.',
  },
  {
    id: 'std-18-right-to-cancel',
    number: '18',
    title: 'Right to Cancel (Consumer Clients)',
    body:
      'Where you are a consumer entering into this engagement at a distance (for example, online or by telephone), you have the right under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 to cancel this engagement within 14 days of the date you sign this letter, without giving a reason.\n\n' +
      '**By signing this engagement you expressly request that we begin work immediately**, and you acknowledge that if you cancel within the 14-day period after we have begun work, you will pay us a reasonable amount in respect of the work performed up to the point you communicate cancellation to us.\n\n' +
      'To cancel, please email us at {{supportEmail}} or write to us at {{brandPostalAddress}}.\n\n' +
      'This right does not apply where you are entering into this engagement in the course of a trade, business, craft or profession (which will generally be the case for limited companies and most sole traders).',
  },
  {
    id: 'std-19-tax-advice',
    number: '19',
    title: 'Scope and Timing of Tax Advice',
    body:
      'Our advice is based on tax legislation, case law and published HMRC practice as at the date our advice is given. We do not undertake to monitor changes in law, regulation or HMRC practice after the date of our advice unless you engage us specifically to do so, and we will not be liable for any consequences arising from changes that take effect after the date of our advice.\n\n' +
      'Where any advice falls within the scope of the Disclosure of Tax Avoidance Schemes (DOTAS), General Anti-Abuse Rule (GAAR), or Promoters of Tax Avoidance Schemes (POTAS) regimes, we will inform you of any disclosure or reporting requirements that apply.\n\n' +
      'We do not provide legal advice. If a matter requires legal input (for example employment law, contract drafting, or property law) we will refer you to a solicitor.',
  },
];
