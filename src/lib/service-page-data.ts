export interface ServicePageData {
  slug: string;
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  price: string;
  features: string[];
  benefits: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
  testimonial: {
    name: string;
    role: string;
    quote: string;
  };
}

export const servicePages: Record<string, ServicePageData> = {
  "sole-trader": {
    slug: "sole-trader",
    title: "Sole Trader Accountants",
    headline: "Expert Accounting for Sole Traders",
    description:
      "Straightforward, hassle-free online accounting designed exclusively for sole traders. MTD compliant software, dedicated accountant, unlimited advice — all for one fixed monthly fee.",
    metaDescription:
      "Online accounting services for sole traders. Dedicated accountant, unlimited advice, MTD compliant software. From £32.50/month. No setup fees.",
    price: "32.50",
    features: [
      "Dedicated sole trader accountant",
      "Self assessment tax return preparation & filing",
      "Unlimited phone & email support",
      "Free FreeAgent accounting software",
      "MTD for Income Tax compliant",
      "Expense tracking & mileage claims",
      "Tax efficiency advice",
      "Real-time financial dashboard",
      "Open banking with 25+ banks",
      "Invoice creation & management",
    ],
    benefits: [
      {
        title: "Dedicated Accountant",
        description: "A named accountant who understands sole trader businesses and is always just a call away.",
      },
      {
        title: "MTD Ready",
        description: "Our software is fully compliant with Making Tax Digital for Income Tax Self Assessment.",
      },
      {
        title: "Save on Tax",
        description: "Proactive tax advice to ensure you claim all allowable expenses and reduce your tax bill.",
      },
      {
        title: "Easy Software",
        description: "Track income, expenses and mileage on the go with our free, easy-to-use accounting software.",
      },
    ],
    faqs: [
      { q: "What does a sole trader accountant do?", a: "Your dedicated accountant handles your self assessment tax return, provides unlimited advice, helps you claim expenses, and ensures you're tax-efficient. They also keep you compliant with HMRC requirements." },
      { q: "Do I need an accountant as a sole trader?", a: "While not legally required, an accountant saves you time, ensures accuracy, and typically saves you more in tax than their fees cost. Our clients save an average of £1,000+ per year through tax planning." },
      { q: "What's included in the £32.50/month fee?", a: "Everything: dedicated accountant, self assessment tax return, unlimited advice, free accounting software, expense tracking, and MTD compliance. No hidden extras." },
      { q: "Is FreeAgent easy to use?", a: "Absolutely. FreeAgent is designed for non-accountants and is incredibly intuitive. Plus, your accountant will set everything up and walk you through it." },
    ],
    testimonial: {
      name: "Angela Brooks",
      role: "Sole Trader",
      quote: "I was terrified of Making Tax Digital but Clever Accounts made the transition completely painless. They set everything up and walked me through it.",
    },
  },
  "limited-company": {
    slug: "limited-company",
    title: "Limited Company Accountants",
    headline: "Complete Accounting for Limited Companies",
    description:
      "Full-service accounting for your limited company. Year-end accounts, corporation tax, VAT returns, payroll, and free accounting software — all included in one fixed monthly fee.",
    metaDescription:
      "Online limited company accountant. Year-end accounts, CT600, VAT, payroll, Companies House filings. From £104.50/month. No setup fees.",
    price: "104.50",
    features: [
      "Dedicated limited company accountant",
      "Year-end accounts preparation & filing",
      "Corporation tax return (CT600)",
      "VAT returns (quarterly)",
      "Payroll for directors & staff",
      "Companies House annual filings",
      "Confirmation statement",
      "Corporation tax planning",
      "Dividend advice & planning",
      "Free FreeAgent accounting software",
      "Unlimited phone & email support",
      "Real-time financial dashboard",
    ],
    benefits: [
      {
        title: "All-Inclusive Service",
        description: "Accounts, tax, VAT, payroll and software — everything your limited company needs in one package.",
      },
      {
        title: "Tax Planning",
        description: "Expert advice on the most tax-efficient way to pay yourself through salary, dividends and expenses.",
      },
      {
        title: "Companies House",
        description: "We handle all your Companies House filings including confirmation statements and annual accounts.",
      },
      {
        title: "Payroll Included",
        description: "Monthly payroll processing for directors and staff, including RTI submissions to HMRC.",
      },
    ],
    faqs: [
      { q: "What's included in the limited company package?", a: "Everything: year-end accounts, corporation tax return, VAT returns, payroll, Companies House filings, confirmation statement, dividend planning, unlimited advice, and free FreeAgent software." },
      { q: "Do you handle VAT returns?", a: "Yes. Quarterly VAT returns are included in your monthly fee. We'll prepare and submit them on time, every time." },
      { q: "Can you help with tax planning?", a: "Absolutely. Your dedicated accountant will advise on the most tax-efficient way to structure your salary, dividends and expenses to minimise your tax bill." },
      { q: "What about payroll?", a: "Payroll for directors and staff is included. We handle monthly RTI submissions to HMRC and provide payslips." },
    ],
    testimonial: {
      name: "Emily Watson",
      role: "Limited Company Director",
      quote: "I used to dread tax season. Now everything is handled for me. The software is easy to use and my accountant is just a phone call away.",
    },
  },
  "contractor-accountancy": {
    slug: "contractor-accountancy",
    title: "Contractor Accountants",
    headline: "Specialist Accounting for Contractors",
    description:
      "Bespoke contractor accounting with end-to-end IR35 support, contract reviews, and our unique Clever FLEX solution for seamless PSC/umbrella switching. Built by contractors, for contractors.",
    metaDescription:
      "Specialist contractor accountant with IR35 support, contract reviews & Clever FLEX umbrella solution. From £104.50/month. No setup fees.",
    price: "104.50",
    features: [
      "Dedicated contractor specialist accountant",
      "End-to-end IR35 support",
      "Contract reviews & assessments",
      "Clever FLEX umbrella solution",
      "Seamless PSC/Umbrella switching",
      "Year-end accounts & corporation tax",
      "VAT returns",
      "Payroll processing",
      "Free FreeAgent accounting software",
      "Unlimited phone & email support",
      "Inside/outside IR35 guidance",
      "Bespoke contracting advice",
    ],
    benefits: [
      {
        title: "IR35 Expertise",
        description: "End-to-end IR35 support including contract reviews, status determinations, and compliance advice.",
      },
      {
        title: "Clever FLEX",
        description: "Our unique umbrella solution lets you switch seamlessly between PSC and umbrella as contracts change.",
      },
      {
        title: "Contract Reviews",
        description: "We review every contract to assess IR35 status and advise on the most tax-efficient working arrangement.",
      },
      {
        title: "All-In-One",
        description: "Full limited company accounting plus specialist contractor services, all for one monthly fee.",
      },
    ],
    faqs: [
      { q: "What is Clever FLEX?", a: "Clever FLEX is our unique umbrella solution for contractors. It allows you to switch seamlessly between working through your PSC (outside IR35) and our umbrella company (inside IR35) without changing accountant." },
      { q: "Do you review my contracts for IR35?", a: "Yes. Contract reviews and IR35 assessments are included in your package. We'll review every contract and advise on your IR35 status." },
      { q: "Can I switch between PSC and umbrella?", a: "Absolutely. With Clever FLEX, you can switch between PSC and umbrella working arrangements seamlessly as your contracts change. No additional fees." },
      { q: "What's included in the fee?", a: "Everything: full limited company accounting, IR35 support, contract reviews, Clever FLEX, unlimited advice, and free accounting software." },
    ],
    testimonial: {
      name: "James Cooper",
      role: "IT Contractor",
      quote: "The IR35 support alone is worth every penny. They handle everything — contracts, assessments, and switching between umbrella and PSC seamlessly.",
    },
  },
  "freelancer-accountancy": {
    slug: "freelancer-accountancy",
    title: "Freelancer Accountants",
    headline: "Accounting Made Simple for Freelancers",
    description:
      "Tailored accounting support for freelancers. Focus on your craft while we handle your finances — self assessment, expenses, invoicing and tax planning, all for one monthly fee.",
    metaDescription:
      "Online accounting for freelancers. Dedicated accountant, self assessment, invoicing, expense tracking. From £32.50/month. No setup fees.",
    price: "32.50",
    features: [
      "Dedicated freelancer accountant",
      "Self assessment tax return",
      "Unlimited phone & email support",
      "Free FreeAgent accounting software",
      "Invoice creation & tracking",
      "Expense tracking & mileage",
      "Tax efficiency advice",
      "MTD compliant",
      "Real-time financial dashboard",
      "Open banking with 25+ banks",
    ],
    benefits: [
      {
        title: "Focus on Your Work",
        description: "Stop worrying about tax deadlines and compliance. We handle everything so you can focus on your clients.",
      },
      {
        title: "Get Paid Faster",
        description: "Create professional invoices on the go and track payments in real-time with our free software.",
      },
      {
        title: "Maximise Deductions",
        description: "Your accountant ensures you claim every allowable expense — from home office to travel and equipment.",
      },
      {
        title: "Always Available",
        description: "Unlimited advice whenever you need it. No watching the clock, no extra charges for a quick question.",
      },
    ],
    faqs: [
      { q: "Do I need an accountant as a freelancer?", a: "A good accountant typically saves freelancers more in tax savings than their fees cost. Plus you save hours of time and get peace of mind that everything is filed correctly and on time." },
      { q: "Can I invoice clients through the software?", a: "Yes! FreeAgent lets you create professional invoices, track payments, and send automatic reminders — all from your phone or computer." },
      { q: "What expenses can I claim as a freelancer?", a: "Your accountant will help you claim all allowable expenses including home office costs, travel, equipment, software, phone bills, and more." },
      { q: "Is this suitable for freelancers with a limited company?", a: "This package is for sole trader freelancers. If you trade through a limited company, our Limited Company package at £104.50/month would be more suitable." },
    ],
    testimonial: {
      name: "Lisa Crawford",
      role: "Freelance Designer",
      quote: "As a freelancer, I needed someone who understood my unique situation. Clever Accounts has been brilliant — they handle everything and the software is so easy to use.",
    },
  },
  "landlord-accounting": {
    slug: "landlord-accounting",
    title: "Landlord & Property Accountants",
    headline: "Specialist Accounting for Landlords",
    description:
      "Comprehensive accounting for property investors and landlords. We handle your rental income, expenses, tax returns and compliance — giving you peace of mind and maximising your returns.",
    metaDescription:
      "Online accounting for landlords & property investors. Self assessment, rental income, expenses, tax planning. From £32.50/month. No setup fees.",
    price: "32.50",
    features: [
      "Dedicated property accountant",
      "Self assessment tax return",
      "Rental income tracking",
      "Mortgage interest relief guidance",
      "Capital gains tax advice",
      "Expense tracking & management",
      "Tax efficiency planning",
      "Unlimited phone & email support",
      "Free FreeAgent accounting software",
      "MTD compliant",
    ],
    benefits: [
      {
        title: "Property Expertise",
        description: "Accountants who understand property taxation, from mortgage interest relief to capital gains.",
      },
      {
        title: "Tax Planning",
        description: "Proactive advice to minimise your tax liability and maximise returns on your property investments.",
      },
      {
        title: "Multi-Property Support",
        description: "Whether you have one property or a portfolio, we track all income and expenses across your rentals.",
      },
      {
        title: "Compliance Sorted",
        description: "We handle all your tax filings and keep you compliant with the latest property tax regulations.",
      },
    ],
    faqs: [
      { q: "Do you handle multiple properties?", a: "Yes. Whether you have one buy-to-let or a large portfolio, we manage all your rental income, expenses and tax returns in one place." },
      { q: "Can you advise on mortgage interest relief?", a: "Absolutely. We'll guide you through the mortgage interest tax relief rules and ensure you claim the correct amount on your returns." },
      { q: "What about capital gains tax?", a: "We provide capital gains tax advice for property sales, including guidance on reliefs and how to minimise your CGT liability." },
      { q: "Should I set up a limited company for my properties?", a: "This depends on your circumstances. Your dedicated accountant will advise on the most tax-efficient structure for your property portfolio." },
    ],
    testimonial: {
      name: "Mark Henderson",
      role: "Property Landlord",
      quote: "Managing multiple rental properties used to be a headache at tax time. Clever Accounts took all that stress away.",
    },
  },
  "accounting-for-startups": {
    slug: "accounting-for-startups",
    title: "Startup Accountants",
    headline: "Accounting for Startups & New Businesses",
    description:
      "Get your new business off to the best start. Expert accounting support from day one, with guidance on structure, tax planning, and compliance — all for one affordable monthly fee.",
    metaDescription:
      "Online accounting for startups & new businesses. Expert guidance, company formation advice, tax planning. From £32.50/month. No setup fees.",
    price: "32.50",
    features: [
      "Dedicated startup accountant",
      "Business structure advice",
      "Company formation guidance",
      "Tax registration (HMRC, VAT, PAYE)",
      "Year-end accounts & tax returns",
      "Tax efficiency planning from day one",
      "Free FreeAgent accounting software",
      "Unlimited phone & email support",
      "Pre-trading expense claims",
      "Growth & scaling advice",
    ],
    benefits: [
      {
        title: "Expert from Day One",
        description: "Get professional accounting advice from the very start, so you build your business on solid financial foundations.",
      },
      {
        title: "Structure Advice",
        description: "We'll advise whether sole trader or limited company is the best structure for your new business.",
      },
      {
        title: "Claim Pre-Trading Costs",
        description: "Don't miss out — we help you claim expenses incurred before you officially started trading.",
      },
      {
        title: "Affordable Pricing",
        description: "Start from just £32.50/month with no setup fees. Professional accounting shouldn't break the bank for new businesses.",
      },
    ],
    faqs: [
      { q: "Should I be a sole trader or limited company?", a: "This depends on your expected income, industry, and personal circumstances. Your dedicated accountant will advise on the most tax-efficient structure for your business." },
      { q: "Can I claim expenses from before I started?", a: "Yes! Pre-trading expenses can often be claimed. Your accountant will help you identify and claim all eligible costs from before you officially started trading." },
      { q: "Do you help with company formation?", a: "We provide guidance on company formation and can help ensure everything is set up correctly with HMRC, Companies House, and any necessary registrations." },
      { q: "When should I register for VAT?", a: "You must register when turnover exceeds £90,000 in a 12-month period. However, voluntary registration can sometimes be beneficial — your accountant will advise." },
    ],
    testimonial: {
      name: "David Thompson",
      role: "Startup Founder",
      quote: "As a new business owner, having Clever Accounts on my side gave me confidence from day one. Their advice has been invaluable.",
    },
  },
};
