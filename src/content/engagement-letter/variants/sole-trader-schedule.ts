/**
 * Schedule of Services — Sole Trader variant.
 *
 * Source: "Terms and conditions (1).pdf" pages 8-13.
 * Cleanups applied during transcription documented in
 * docs/engagement-letter-content-diff.md.
 */

import type { Section } from '../types';

export const SOLE_TRADER_SCHEDULE: Section[] = [
  {
    id: 'st-sched-00-preamble',
    number: 'S',
    title: 'Schedule of Services',
    body: 'This schedule should be read in conjunction with the engagement letter and the standard terms and conditions.',
  },
  {
    id: 'st-sched-01-recurring-compliance',
    number: 'S1',
    title: 'Recurring Compliance Work',
    body:
      'We will prepare your self-assessment tax returns together with any supplementary pages required, from the information and explanations that you provide to us. After obtaining your approval and signature, we will submit your returns to HM Revenue & Customs (HMRC).\n\n' +
      'We will prepare your business accounts in accordance with generally accepted accounting practice and the rules associated with the cash accounting regime, from the books, accounting records and other information and explanations provided to us on your behalf.\n\n' +
      'We will calculate your income tax, national insurance contributions (NIC) and any capital gains tax liabilities, and tell you how much you should pay and when. Where instructed by you we will advise on the interest and penalty implications if tax or NIC is paid late. We will also check HMRC\'s calculation of your tax and NIC liabilities, and initiate repayment claims if tax or NIC has been overpaid.\n\n' +
      'Other than as regards tax credits and universal credit (see below), we will advise you as to possible tax-return-related claims and elections arising from information supplied by you. Where instructed by you, we will make such claims and elections in the form and manner required by HMRC.\n\n' +
      'We will review PAYE notices of coding provided to us and advise accordingly.',
  },
  {
    id: 'st-sched-02-payroll',
    number: 'S2',
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
      'We will submit an FPS online to HMRC, based on the data provided by you. The FPS must reach HMRC normally on or before the payday. You must ensure that the data provided to us is complete and accurate, and your attention is drawn to your legal responsibilities as set out below.\n\n' +
      'For each tax month we will prepare, where appropriate, an employer payment summary (EPS) from the information and explanations that you provide to us. (Examples of EPS data include statutory payments, employment allowance, Construction Industry Scheme deductions, apprenticeship levy allowance allocated to the PAYE scheme, apprenticeship allowance payable to date, and confirmation that no payments were made to employees.)\n\n' +
      'We will submit EPSs to HMRC, based on the data provided by you. EPSs must reach HMRC by the 19th of the month following the tax month to which they relate. You must ensure that the data provided to us is complete and accurate, and your attention is drawn to your legal responsibilities as set out below.\n\n' +
      'At the end of the payroll year, we will:\n\n' +
      '- prepare the final FPS (or EPS) and submit this to HMRC, based on the data provided by you. The final FPS (or EPS) for the year must reach HMRC by 19 April following the end of the tax year. You must ensure that the data provided to us is complete and accurate;\n' +
      '- prepare and send to you form P60 for each employee on the payroll at the year-end, so that you can give them to employees by the statutory due date of 31 May following the end of the tax year;\n' +
      '- prepare and send to you (based on information supplied to us) a statement for every employee for whom benefits-in-kind (BiK) have been provided, identifying every benefit provided to each employee during the tax year and the cash equivalent of each benefit treated as PAYE income, so you can give them to employees by the statutory due date of 31 May following the end of the tax year;\n' +
      '- give you details of the Class 1A NIC on BiK, which will need to be accounted for on form P11D(b), and the due date for payment;\n' +
      '- prepare and submit P11D and P11D(b) for employee BiKs, and advise on the payment of Class 1A NIC.\n\n' +
      'Note that we will only deal with the nominated person within the organisation. Any enquiries from individual employees concerning their wages or other payroll details will be referred to that responsible person.',
  },
  {
    id: 'st-sched-03-vat',
    number: 'S3',
    title: 'VAT Returns',
    body:
      'You are responsible for monitoring the monthly turnover to establish whether the business is liable to register for VAT, if it is not already registered. If you do not understand what you need to do, please ask us.\n\n' +
      "If the business exceeds the VAT registration threshold, and you wish us to assist in notifying HMRC of the business's liability to be VAT registered, we will be pleased to assist in the VAT registration process. You should notify us of your instructions to act in relation to VAT registration in good time to enable a VAT registration form to be submitted within the time limit of one month following the month in which the current VAT registration turnover threshold was exceeded.\n\n" +
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
    id: 'st-sched-04-portal',
    number: 'S4',
    title: 'Use of the Portal (or Other Accounting Software Package)',
    body:
      'You agree to:\n\n' +
      '- always keep the portal up to date;\n' +
      '- make sure the bank balance matches the actual bank balance at any given date;\n' +
      '- record expense claims accurately based upon actual expenses claimed;\n' +
      '- record sales and purchase invoices, where relevant;\n' +
      '- if requested by your accountants, share any evidence for confirmation of sales, purchases, and expenses;\n' +
      '- let your designated Clever Accounts accountant know when the portal is up to date for accounts, VAT, etc.;\n' +
      '- use the wage and dividends calculation as a guide and accept that the calculation is based upon information entered into the portal, and accept that, unless reviewed by an accountant, these calculations may be inaccurate;\n' +
      '- if not using our online portal, prepare a list of debtors and creditors as at year end.',
  },
  {
    id: 'st-sched-05-bookkeeping',
    number: 'S5',
    title: 'Bookkeeping Services',
    body:
      'We offer bookkeeping services as an add-on service to all our clients, available on a monthly or one-off basis. Fees for bookkeeping are quoted on a case-by-case basis.\n\n' +
      'We will process your information on our online portal and request any explanations and further information if needed. We will rely on information, documents and explanations provided for bookkeeping to be true, correct, and complete and will not carry out an audit of this information.',
  },
  {
    id: 'st-sched-06-references',
    number: 'S6',
    title: 'References',
    body:
      'Where requested we will provide letting, mortgage, visa, and other references. Once a request to provide a reference has been received from a third party we will get in touch with you to confirm:\n\n' +
      '- your agreement via email to confirm if your information could be passed on to a third party;\n' +
      '- that you have requested a reference to be provided by us.\n\n' +
      'You agree and accept that we can only provide information held for you or your business on our system, and cannot exaggerate figures or provide statements which could give you an unfair advantage. We cannot provide a reference for accounts containing arbitrary figures which we suspect not to reflect a true and fair view of you and/or your business\'s financial position. All references provided are subject to fees, which are quoted on a case-by-case basis.',
  },
  {
    id: 'st-sched-07-hmrc-comms',
    number: 'S7',
    title: "Communication with HMRC and Other Third Parties on Your Behalf",
    body:
      'You accept and agree that we may need to approach third parties for information that we consider necessary to deal with your affairs. Upon your signing up to our service we will apply to be appointed as your agent for the following:\n\n' +
      '- Self Assessment\n' +
      '- PAYE\n' +
      '- VAT\n\n' +
      'This would enable us to speak to HMRC on your behalf and help to resolve any tax issues that may arise during our professional relationship. It is your responsibility to forward the appropriate verification code to us as soon as it is received from HMRC.\n\n' +
      'HMRC will treat this as authority to speak to us and there will not correspond with you except to the extent that they are formally required to do so. However, this authority does not apply to all HMRC correspondence, and even when it does, HMRC has been known to overlook or ignore it. Therefore, it is advised that you send all correspondence (copies or originals) to us.',
  },
  {
    id: 'st-sched-08-your-responsibilities',
    number: 'S8',
    title: 'Your Responsibilities',
    body:
      'You are legally responsible for:\n\n' +
      '- ensuring that your self-assessment tax returns are correct and complete;\n' +
      '- filing any returns by the due date;\n' +
      '- making payment of tax on time.\n\n' +
      'Failure to do this may lead to penalties and/or interest. Taxpayers who sign their returns cannot delegate this legal responsibility to others.\n\n' +
      'You agree to check that returns we have prepared for you are complete before you approve and sign them.\n\n' +
      'To enable us to carry out our work you agree:\n\n' +
      '- that all returns are to be made based on full disclosure of all sources of income, charges, allowances and capital transactions;\n' +
      '- to provide full information necessary for dealing with your affairs; we will rely on the information and documents being true, correct, and complete, and will not audit the information or those documents;\n' +
      '- to authorise us to approach such third parties as may be appropriate for information that we consider necessary to deal with your affairs;\n' +
      '- to provide us with information in sufficient time where asked.\n\n' +
      'You will keep us informed of material changes in your circumstances that could affect your tax liability. If you are unsure whether the change is material or not, please let us know so that we can assess its significance.\n\n' +
      'You will forward to us HMRC statements of account, copies of notices of assessment, letters and other communications received from HMRC in time to enable us to deal with them as may be necessary within the statutory time limits. Although HMRC has the authority to communicate with us once it has been notified that we are acting on your behalf as your agent, it is still essential that you let us have copies of any correspondence received because HMRC is not obliged to send us copies of all communications issued to you.',
  },
];
