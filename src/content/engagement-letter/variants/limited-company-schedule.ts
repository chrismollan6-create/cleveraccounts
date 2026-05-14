/**
 * Schedule of Services — Limited Company variant.
 *
 * Source: "Terms and conditions.pdf" pages 8-17.
 * Cleanups applied during transcription documented in
 * docs/engagement-letter-content-diff.md.
 *
 * The £££ placeholder in the CTSA late-info fee section has been replaced with
 * "an additional charge" per Chris's decision on 2026-05-08.
 */

import type { Section } from '../types';

export const LIMITED_COMPANY_SCHEDULE: Section[] = [
  {
    id: 'lc-sched-00-preamble',
    number: 'S',
    title: 'Schedule of Services',
    body: 'This schedule should be read in conjunction with the engagement letter and the standard terms and conditions.',
  },
  {
    id: 'lc-sched-01-accounts-prep',
    number: 'S1',
    title: 'Accounts Preparation and Related Work',
    body:
      "We will prepare company accounts from the information and explanations provided to us. This includes information kept on our online portal ('the portal') and other online bookkeeping software packages.\n\n" +
      'Upon review of your accounting records, we may advise you as to the adequacy of your records and suggest improvements which we consider necessary. We shall not be responsible if, because of you not taking our advice, you incur losses, penalties, or additional tax liabilities.\n\n' +
      'We will use reasonable skill and care in preparation of your accounts but will not be responsible for any errors arising from incorrect information supplied by you.\n\n' +
      'We will not be carrying out audit work as part of this assignment, and accordingly will not verify the assets and liabilities of the company, nor the items of expenditure and income. To carry out an audit would entail additional work to comply with International Standards on Auditing so that we could report on the truth and fairness of the financial statements. We would also like to emphasise that we cannot undertake to discover any shortcomings in your systems, or irregularities on the part of your employees or yourself.\n\n' +
      'We will attach to the accounts a report which explains what work has been done by us, the professional requirements we fulfil and the standard to which the work has been carried out. It will also include a statement that we have not carried out an audit.\n\n' +
      "**Directors' responsibilities:**\n\n" +
      '- As directors of the company, you are required by statute to prepare accounts for each financial year which give a true and fair view of the situation of the company and of its profit or loss for that period. You must not approve the accounts unless you are satisfied that they give a true and fair view of the assets, liabilities, financial position and profit or loss of the company.\n' +
      '- It is your responsibility to keep proper accounting records that disclose with reasonable accuracy at any time the financial position of the company.\n' +
      '- It is also your responsibility to safeguard the assets of the company and to take reasonable steps for the prevention and detection of fraud and other irregularities with an appropriate system of internal controls.\n' +
      '- You are responsible for determining whether, in respect of the year concerned, the company meets the conditions for exemption from an audit set out in section 477, 479A or 480 of the Companies Act 2006, and for determining whether, in respect of the year, the exemption is not available for any of the reasons set out in section 478 of the Companies Act 2006.\n' +
      "- You are also responsible for making available to us, as and when required, all the company's accounting records and all other relevant records and related information, including minutes of management and shareholders' meetings.\n" +
      '- As part of our normal procedures, we may request you to provide written confirmation of any oral information and explanations given to us during our work.\n' +
      '- We have a professional duty to compile accounts that conform with generally accepted accounting principles. The accounts of a limited company are required to comply with the disclosure requirements of the Companies Act 2006 and applicable accounting standards. Where we identify that the accounts do not conform to accepted accounting principles or standards, we will inform you and suggest amendments be put through the accounts before being published. We have a professional responsibility not to allow our name to be associated with accounts that may be misleading. In extreme cases, where this matter cannot be resolved, we will withdraw from the engagement and notify you in writing of the reasons.\n' +
      '- Should you instruct us to carry out any alternative report, it will be necessary for us to issue a separate letter of engagement.',
  },
  {
    id: 'lc-sched-02-accounts-compliance',
    number: 'S2',
    title: 'Accounts — Compliance',
    body:
      "A private limited company in the UK is required to file its accounts at Companies House within 9 months of company year-end, or in the case of a new incorporation, within 21 months of company incorporation. The company may be liable to penalties if it fails to do so. (See https://www.gov.uk/government/publications/late-filing-penalties/late-filing-penalties.)\n\n" +
      'To do this as your accountants, we will prepare your statutory accounts, suitable for filing, within the required period provided all your records are complete and presented to us no later than 2 months prior to the filing deadline.\n\n' +
      'We will not accept responsibility if you act on advice given by us on an earlier occasion without first confirming with us that the advice is still valid in the light of any change in the law or your circumstances. We will accept no liability for losses arising from changes in the law or the interpretation thereof that are first published after the date on which the advice is given.',
  },
  {
    id: 'lc-sched-03-company-tax-compliance',
    number: 'S3',
    title: 'Company Tax Compliance',
    body:
      "- We will prepare the company's corporate tax self-assessment (CTSA) return based on the accounts data together with any additional information. After obtaining the approval and signature of an authorised nominated director, we will submit it to HM Revenue & Customs (HMRC).\n" +
      '- We will tell you how much corporation tax the company should pay and when. If appropriate, we will initiate repayment claims when tax has been overpaid. We will advise on the interest and penalty implications if corporation tax is paid late.\n' +
      '- We will advise you as to possible tax-return-related claims and elections arising from information supplied by you. Where instructed by you, we will make such claims and elections in the form and manner required by HMRC.\n' +
      '- You should not make payments to HMRC without first referring to us to confirm if a payment is required.\n' +
      "- We will deal with all communications relating to the company's return addressed to us by HMRC or passed to us by the company.\n" +
      '- Where you have instructed us to do so, we will also provide other taxation advisory and ad hoc services as may be agreed from time to time. These may be the subject of a separate engagement letter, at our option. Where appropriate we will discuss and agree an additional fee for such work when it is commissioned by you. Examples of such work include:\n' +
      "    - dealing with any enquiry opened into the company's tax return by HMRC;\n" +
      '    - preparing any amended returns which may be required because of HMRC enquiry and corresponding with HMRC, as necessary.\n\n' +
      'Where specialist advice is required on occasions, we may need to seek this from, or refer you to, appropriate specialists.',
  },
  {
    id: 'lc-sched-04-directors-responsibilities',
    number: 'S4',
    title: "Company Tax — Company Directors' Responsibilities",
    body:
      'The directors, on behalf of the company, are legally responsible for:\n\n' +
      '- ensuring that the CTSA return is correct and complete;\n' +
      '- filing any returns by the due date;\n' +
      '- making payment of tax on time.\n\n' +
      'Failure to do this may lead to automatic penalties, surcharges and/or interest. The signatory to the return cannot delegate this legal responsibility to others.\n\n' +
      'The signatory agrees to check that returns we have prepared for the company are complete before he or she approves and signs them.\n\n' +
      'To enable us to carry out our work the directors agree:\n\n' +
      '- that all returns are to be made based on full disclosure of all sources of income, charges, allowances, and capital transactions;\n' +
      '- to ensure the expenses claimed via the company are wholly and exclusively for the purpose of the business. Where this is not the case, we will add these back to profit for corporation tax. You must ensure where expenses are paid to employees or directors that you consider the tax implication of each payment. Expenses can be reimbursed to employees or directors without the operation of PAYE where they have been incurred wholly and exclusively for business;\n' +
      "- to provide full information necessary for dealing with the company's affairs; we will rely on the information and documents being true, correct, and complete and will not audit the information or those documents;\n" +
      "- to authorise us to approach such third parties as may be appropriate for information that we consider necessary to deal with the company's affairs;\n" +
      "- to provide us with information in sufficient time for the company's CTSA return to be completed and submitted 9 months following the end of the tax year. In order that we can do this we need to receive all relevant information 3 months before the above date. Where feasible we may agree to complete your return within a shorter period but may apply an additional charge for so doing;\n" +
      '- to provide us with information on advances or loans made to directors, shareholders or their associates during an accounting period and any repayments made or write-offs authorised at least within three months of the end of the relevant accounting period.\n\n' +
      'The directors will keep us informed of material changes in circumstances that could affect the tax liabilities of the company. If the directors are unsure whether the change is material or not, please let us know so that we can assess the significance.\n\n' +
      'You will forward to us HMRC statements of account, copies of notices of assessment, letters and other communications received (including agent authorisation codes) from HMRC in time to enable us to deal with them as may be necessary within the statutory time limits. Although HMRC has the authority to communicate with us when form 64-8 has been signed and submitted, it is essential that you let us have copies of any correspondence received because HMRC is not obliged to send us copies of all communications issued to you.\n\n' +
      "The work carried out within this engagement will be in respect of the company's tax affairs. Any work to be carried out for the directors on a personal basis will be set out in a separate letter of engagement.\n\n" +
      'Our services as set out above are subject to the limitations on our liability set out in the engagement letter and in our standard terms and conditions.',
  },
  {
    id: 'lc-sched-05-payroll',
    number: 'S5',
    title: 'Payroll Services',
    body:
      'We will prepare your UK payroll for each payroll period to meet UK employment tax requirements, specifically:\n\n' +
      '- calculating the pay as you earn (PAYE) deductions, including at the Scottish rate of income tax if applicable;\n' +
      "- calculating the employees' national insurance contributions (NIC) deductions;\n" +
      "- calculating the employer's NIC liabilities;\n" +
      '- calculating statutory payments — for example, statutory sick pay and/or statutory maternity pay;\n' +
      '- calculating reclaims of statutory payment — for example, maternity payments;\n' +
      '- calculating employee and employer pension contributions for employees and workers who are members of workplace pension schemes (including those who are auto-enrolled) based on the information you provide;\n' +
      '- claiming employment allowance;\n' +
      '- calculating, if appropriate, apprenticeship levy;\n' +
      '- calculating other statutory and non-statutory deductions;\n' +
      '- submitting information online to HMRC under real-time information (RTI) for PAYE.\n\n' +
      'We will prepare and make available to you the following documents before the time of payment through the payroll, or due date for delivering information to HMRC:\n\n' +
      '- payroll summaries reporting each employee and all relevant payroll totals;\n' +
      '- the data included within each full payment submission (FPS) for taxable pay and payrolled benefits (if any) for each employee;\n' +
      '- a payslip for each employee unless not required;\n' +
      '- a P45 for each leaver;\n' +
      '- a report showing your PAYE and NIC liability, student loan (if applicable) and apprenticeship levy (if applicable) and due date for payment;\n' +
      '- if a workplace pension is registered, a report showing pension contributions payable in respect of each employee to the respective workplace pension scheme(s) of which they are members and the due date(s) for payment.\n\n' +
      'We will submit an FPS online to HMRC, based on the data provided by you. The FPS must reach HMRC normally on or before the payday. You must ensure that the data provided to us is complete and accurate.\n\n' +
      'For each tax month we will prepare, where appropriate, an employer payment summary (EPS) from the information and explanations that you provide to us. (Examples of EPS data include statutory payments, employment allowance, Construction Industry Scheme deductions, apprenticeship levy allowance allocated to the PAYE scheme, apprenticeship allowance payable to date, and confirmation that no payments were made to employees.)\n\n' +
      'We will submit EPSs to HMRC, based on the data provided by you. EPSs must reach HMRC by the 19th of the month following the tax month to which they relate. You must ensure that the data provided to us is complete and accurate.\n\n' +
      'At the end of the payroll year, we will:\n\n' +
      '- prepare the final FPS (or EPS) and submit this to HMRC, based on the data provided by you. The final FPS (or EPS) for the year must reach HMRC by 19 April following the end of the tax year. You must ensure that the data provided to us is complete and accurate;\n' +
      '- prepare and send to you form P60 for each employee on the payroll at the year-end, so that you can give them to employees by the statutory due date of 31 May following the end of the tax year;\n' +
      '- prepare and send to you (based on information supplied to us) a statement for every employee for whom benefits-in-kind (BiK) have been provided, identifying every benefit provided to each employee during the tax year and the cash equivalent of each benefit treated as PAYE income, so you can give them to employees by the statutory due date of 31 May following the end of the tax year;\n' +
      '- give you details of the Class 1A NIC on BiK, which will need to be accounted for on form P11D(b), and the due date for payment;\n' +
      '- prepare and submit P11D and P11D(b) for employee BiKs, and advise on the payment of Class 1A NIC.\n\n' +
      'Note that we will only deal with the nominated person within the organisation. Any enquiries from individual employees concerning their wages or other payroll details will be referred to that responsible person.',
  },
  {
    id: 'lc-sched-06-vat',
    number: 'S6',
    title: 'VAT Returns',
    body:
      'You are responsible for monitoring the monthly turnover to establish whether the company is liable to register for VAT, if it is not already registered. If you do not understand what you need to do, please ask us.\n\n' +
      "If the company exceeds the VAT registration threshold, and you wish us to assist in notifying HMRC of the company's liability to be VAT registered, we will be pleased to assist in the VAT registration process. You should notify us of your instructions to act in relation to the company's VAT registration in good time to enable a VAT registration form to be submitted within the time limit of one month following the month in which the current VAT registration turnover threshold was exceeded.\n\n" +
      'We will not be responsible if we are not notified in time and a late registration penalty is incurred.\n\n' +
      'You are legally responsible for making an accurate VAT return and for payment of VAT on time, and have agreed to the following:\n\n' +
      '- You agree to provide us with all the records relevant to the preparation of your VAT return as soon as possible after the return period ends. We ordinarily require 10 working days before the submission date to carry out our work.\n' +
      '- If the preparation or filing of your VAT return is delayed because the records are provided later than we require, or are otherwise incomplete or unclear, we accept no responsibility for any penalties that may be charged. If for some reason you are not able to provide records within the timeframe above, please contact us as soon as possible. If feasible, and depending upon resources available, we may agree to still carry out the work to allow the submission deadline to be met.\n' +
      '- You also agree that all VAT returns are to be made on the basis of full disclosure. You are responsible for ensuring that information you provide is, to the best of your knowledge, complete and accurate. The VAT returns will be prepared on the basis of information provided to us, so we accept no responsibility for any VAT liabilities, penalties or interest that arises due to inaccuracies or omissions in information we have been provided.\n' +
      '- You are legally responsible for filing any VAT return by the due date. Although we will submit the return online as your agent, only you are legally responsible for filing it.\n' +
      '- We will only submit your VAT return to HMRC once we have received your agreement via email or the appropriate electronic workflow.\n' +
      '- You are also legally responsible for making a VAT payment on time. Although we will advise you of your VAT liability due, it is your responsibility to make the appropriate payment. Failure to do this may lead to automatic penalties and interest.\n' +
      '- You agree to keep us fully informed of any changes in circumstances or communications received from HM Revenue and Customs relating to your VAT affairs.\n' +
      '- You are responsible for bringing to our attention any errors, omissions or inaccuracies in your VAT returns that you become aware of after they have been filed. We will then assist you to make a voluntary disclosure.\n\n' +
      '**Our responsibilities:**\n\n' +
      '- We will prepare your VAT return from the information provided.\n' +
      '- We will send you a VAT return summary for you to check and approve prior to us filing it with HMRC via our online portal.\n' +
      '- You authorise us to file the return online as your agent, but only once we have received approval from you.\n' +
      '- We will let you know how much VAT is due for a quarter and how to pay and when.',
  },
  {
    id: 'lc-sched-07-portal',
    number: 'S7',
    title: 'Use of the Portal (or Other Accounting Software Package)',
    body:
      'You agree to:\n\n' +
      '- always keep the portal up to date;\n' +
      '- make sure the bank balance matches the actual bank balance at any given date;\n' +
      '- record expense claims accurately based upon actual expenses claimed;\n' +
      '- record sales and purchase invoices, where relevant;\n' +
      '- if requested by your accountants, share any evidence for confirmation of sales, purchases, and expenses;\n' +
      '- let your designated {{brandName}} accountant know when the portal is up to date for accounts, VAT, etc.;\n' +
      '- use the wage and dividends calculation as a guide and accept that the calculation is based upon information entered into the portal, and accept that, unless reviewed by an accountant, these calculations may be inaccurate;\n' +
      '- if not using our online portal, prepare a list of debtors and creditors as at year end.',
  },
  {
    id: 'lc-sched-08-self-assessment',
    number: 'S8',
    title: 'Self-Assessment Returns',
    body:
      'After a tax year has ended, we will send out a self-assessment questionnaire for you to fill out. Deadlines for submission of your data to us will be confirmed each year. Submissions after this deadline may incur an additional penalty by us for late submission.\n\n' +
      'If self-assessment information is received late, we shall endeavour to process the self-assessment return to meet the deadlines but will not be liable for any costs or other losses arising from late filing of the return.\n\n' +
      "We will process your (directors') self-assessment return based on information provided to us. We will rely on information and documents to be true, correct, and complete and will not carry out an audit of this information.\n\n" +
      'Once the self-assessment return has been approved and signed by you, we will file it via our tax software to HMRC.\n\n' +
      'All our fee packages include 1 self-assessment return. For any additional returns to be processed, please get in touch for a fee quotation.\n\n' +
      'If you have property income, foreign income, or other complex tax affairs, we may still be able to help process and file your tax return. These would be subject to additional fees depending on the complexity of the issue.',
  },
  {
    id: 'lc-sched-09-ir35',
    number: 'S9',
    title: 'IR35 Review and Advice',
    body:
      'We will provide a professional opinion on whether the company is subject to the IR35 regulations on a contract-by-contract basis. If you are a contractor working via your own limited company, you are advised to submit each contract to us for review to ensure compliance with IR35 regulations.\n\n' +
      'We will review the contract information and advise if your contract falls inside or outside IR35 regulations, but accept no responsibility if actual working practices differ and this would change our opinion.\n\n' +
      'Contract reviews are included in all our packages, and we do not charge any fees for reasonable reviews in a calendar year. Where there is no request for an IR35 review, we will assume that your contract is outside IR35 regulations or that you have sourced an opinion elsewhere.',
  },
  {
    id: 'lc-sched-10-bookkeeping',
    number: 'S10',
    title: 'Bookkeeping Services',
    body:
      'We offer bookkeeping services as an add-on service to all our clients, available on a monthly or one-off basis. Fees for bookkeeping are quoted on a case-by-case basis.\n\n' +
      'We will process your information on our online portal and request any explanations and further information if needed. We will rely on information, documents and explanations provided for bookkeeping to be true, correct, and complete and will not carry out an audit of this information.',
  },
  {
    id: 'lc-sched-11-references',
    number: 'S11',
    title: 'References',
    body:
      'Where requested we will provide letting, mortgage, visa, and other references. Once a request to provide a reference has been received from a third party we will get in touch with you to confirm:\n\n' +
      '- your agreement via email to confirm if your information could be passed on to a third party;\n' +
      '- that you have requested a reference to be provided by us.\n\n' +
      "You agree and accept that we can only provide information held for you or your company on our system, and cannot exaggerate figures or provide statements which could give you an unfair advantage. We cannot provide a reference for accounts containing arbitrary figures which we suspect not to reflect a true and fair view of you and/or your company's financial position. All references provided are subject to fees, which are quoted on a case-by-case basis.",
  },
  {
    id: 'lc-sched-12-hmrc-comms',
    number: 'S12',
    title: "Communication with HMRC and Other Third Parties on Company's Behalf",
    body:
      "You accept and agree that we may need to approach third parties for information that we consider necessary to deal with the company's affairs. Upon your signing up to our service we will apply to be appointed as your company's agent for the following:\n\n" +
      '- Corporation tax\n' +
      '- PAYE\n' +
      '- VAT\n\n' +
      'This would enable us to speak to HMRC on your behalf and help to resolve any tax issues that may arise during our professional relationship. It is your responsibility to forward the appropriate verification code to us as soon as it is received from HMRC.\n\n' +
      'HMRC will treat this as authority to speak to us and there will not correspond with the company except to the extent that they are formally required to do so. However, this authority does not apply to all HMRC correspondence, and even when it does, HMRC has been known to overlook or ignore it. Therefore, it is advised that you send all correspondence (copies or originals) to us.',
  },
];
