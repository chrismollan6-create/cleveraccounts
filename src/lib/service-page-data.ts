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
  // Optional enhanced sections
  stats?: { value: string; label: string; colour: string }[];
  serviceCategories?: { title: string; items: string[] }[];
  lifestyleImage?: { src: string; alt: string; heading: string; body: string };
  lifestyleImage2?: { src: string; alt: string; heading: string; body: string };
}

export const servicePages: Record<string, ServicePageData> = {
  "sole-trader": {
    slug: "sole-trader",
    title: "Sole Trader Accountants",
    headline: "Expert Accounting for Sole Traders",
    description:
      "Straightforward, hassle-free online accounting designed exclusively for sole traders. MTD compliant software, dedicated accountant, unlimited advice — all for one fixed monthly fee.",
    metaDescription:
      "Online accounting services for sole traders. Dedicated accountant, unlimited advice, MTD compliant software. From £42.50/month. No setup fees.",
    price: "42.50",
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
      { q: "What's included in the £42.50/month fee?", a: "Everything: dedicated accountant, self assessment tax return, unlimited advice, free accounting software, expense tracking, and MTD compliance. No hidden extras." },
      { q: "Is FreeAgent easy to use?", a: "Absolutely. FreeAgent is designed for non-accountants and is incredibly intuitive. Plus, your accountant will set everything up and walk you through it." },
    ],
    testimonial: {
      name: "Angela Brooks",
      role: "Sole Trader",
      quote: "I was terrified of Making Tax Digital but Clever Accounts made the transition completely painless. They set everything up and walked me through it.",
    },
    stats: [
      { value: "£1,200", label: "Average annual tax saving per client", colour: "from-primary to-blue-400" },
      { value: "4,000+", label: "Sole traders & freelancers served", colour: "from-secondary to-emerald-400" },
      { value: "20+", label: "Years of sole trader expertise", colour: "from-amber-500 to-yellow-400" },
      { value: "100%", label: "Self assessment returns filed on time", colour: "from-purple-500 to-pink-400" },
    ],
    lifestyleImage: {
      src: "/images/sole-trader-lifestyle.jpg",
      alt: "Sole trader working from a café",
      heading: "Work from anywhere. We've got the accounting covered.",
      body: "Whether you're at your desk, on a job, or grabbing a coffee between clients — your dedicated accountant is handling the numbers in the background. Self assessment, tax planning, HMRC correspondence. All of it. So you can focus on what you actually do.",
    },
    lifestyleImage2: {
      src: "/images/sole-trader-tradesperson.jpg",
      alt: "Self-employed tradesperson",
      heading: "We work for all kinds of sole traders.",
      body: "Plumbers, electricians, builders, mechanics, consultants, designers — we've seen it all. Whatever your trade, your dedicated accountant understands how self-employed income works and makes sure you're claiming everything you're entitled to.",
    },
    serviceCategories: [
      {
        title: "Self Assessment",
        items: [
          "Annual tax return prepared & filed",
          "Income & expense reconciliation",
          "Tax calculation reviewed",
          "Filed before 31 January",
        ],
      },
      {
        title: "Tax Planning",
        items: [
          "Year-round tax forecasting",
          "Expense claim optimisation",
          "National Insurance planning",
          "MTD Income Tax preparation",
        ],
      },
      {
        title: "HMRC & Compliance",
        items: [
          "Registered agent with HMRC",
          "All HMRC correspondence handled",
          "CIS registration if applicable",
          "VAT registration advice",
        ],
      },
      {
        title: "Software & Support",
        items: [
          "Dedicated accountant by name",
          "Unlimited calls & emails",
          "FreeAgent included free",
          "Expense & mileage tracking",
        ],
      },
    ],
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
    stats: [
      { value: "3,000+", label: "Directors switched to us this year", colour: "from-primary to-blue-400" },
      { value: "6", label: "Tax obligations covered in one fee", colour: "from-secondary to-emerald-400" },
      { value: "£0", label: "Setup fees — ever", colour: "from-amber-500 to-yellow-400" },
      { value: "20+", label: "Years of limited company expertise", colour: "from-purple-500 to-pink-400" },
    ],
    lifestyleImage: {
      src: "/images/limited-company-director.jpg",
      alt: "Limited company director at work",
      heading: "Run your company. Leave the compliance to us.",
      body: "Accounts, VAT, payroll, Companies House — a limited company has a lot of moving parts. We handle every single one, so you can spend your time growing the business rather than wrestling with HMRC deadlines.",
    },
    serviceCategories: [
      {
        title: "Annual Accounts & Corporation Tax",
        items: [
          "Statutory year-end accounts",
          "CT600 corporation tax return",
          "Filed with HMRC & Companies House",
          "Deferred tax & accruals handled",
        ],
      },
      {
        title: "VAT",
        items: [
          "Quarterly VAT returns (MTD compliant)",
          "VAT scheme selection advice",
          "VAT registration managed",
          "Input tax reclaim optimised",
        ],
      },
      {
        title: "Payroll & Director Pay",
        items: [
          "Monthly payroll processing",
          "RTI submissions to HMRC",
          "Optimal salary/dividend structure",
          "Auto-enrolment pension managed",
        ],
      },
      {
        title: "Companies House",
        items: [
          "Confirmation statement filed",
          "Director self assessment",
          "Registered office service",
          "Company secretarial support",
        ],
      },
      {
        title: "Tax Planning",
        items: [
          "Corporation tax minimisation",
          "R&D tax relief assessment",
          "Investment & growth planning",
          "Year-round proactive advice",
        ],
      },
      {
        title: "Day-to-Day Support",
        items: [
          "Dedicated accountant by name",
          "Unlimited calls & emails",
          "Free FreeAgent software",
          "Real-time financial dashboards",
        ],
      },
    ],
  },
  "contractor-accountancy": {
    slug: "contractor-accountancy",
    title: "Contractor Accountants",
    headline: "Contractor Accounting With Full IR35 Support",
    description:
      "Specialist contractor accounting with end-to-end IR35 support, contract reviews, and our unique Clever FLEX solution. We help contractors maximise take-home pay and stay fully compliant — whatever their contract status.",
    metaDescription:
      "Specialist contractor accountant with IR35 support, contract reviews & Clever FLEX umbrella solution. Maximise your take-home pay. From £104.50/month. No setup fees.",
    price: "104.50",
    features: [
      "Dedicated contractor specialist accountant",
      "End-to-end IR35 support & guidance",
      "Contract reviews & written IR35 opinion",
      "Clever FLEX umbrella solution",
      "Seamless PSC/Umbrella switching",
      "Year-end accounts & CT600",
      "VAT returns (quarterly, MTD compliant)",
      "Director payroll & dividend planning",
      "Free FreeAgent accounting software",
      "Unlimited phone & email support",
      "Inside/outside IR35 working practice review",
      "HMRC correspondence handled",
    ],
    benefits: [
      {
        title: "Specialist IR35 Expertise",
        description: "IR35 is one of the most complex areas of contractor tax. Our team has guided thousands of contractors through assessments, contract reviews, and HMRC enquiries.",
      },
      {
        title: "Clever FLEX — Unique to Us",
        description: "Switch seamlessly between your PSC (outside IR35) and our umbrella (inside IR35) without changing accountant. No disruption, no hassle.",
      },
      {
        title: "Written Contract Reviews",
        description: "Before you sign, we review your contract for IR35 indicators and advise on working practices. You get a clear written opinion you can rely on.",
      },
      {
        title: "Maximise Take-Home Pay",
        description: "Operating outside IR35 through your own limited company can be worth thousands more per year. We help you protect that position.",
      },
    ],
    faqs: [
      { q: "What is IR35 and does it apply to me?", a: "IR35 (the off-payroll working rules) determines whether a contractor working through a personal service company should be taxed as an employee. An inside IR35 determination significantly reduces your take-home pay. We assess your specific contracts and working practices and advise on how to protect your outside-IR35 status." },
      { q: "What is Clever FLEX?", a: "Clever FLEX is our unique solution for contractors who have a mix of inside and outside IR35 engagements. It allows you to switch between your own limited company (PSC) and an umbrella arrangement seamlessly — so you're always in the right structure for each contract." },
      { q: "Do you review contracts before I sign?", a: "Yes — written contract review is included. We review your contract for IR35 indicators, advise on wording changes that strengthen your outside position, and assess working practices. You receive a written IR35 opinion." },
      { q: "How much more do I take home outside IR35?", a: "It varies by day rate, but operating outside IR35 through a PSC typically means 15–25% more take-home pay compared to inside IR35 through an umbrella. Use our IR35 calculator above to see the difference at your day rate." },
      { q: "What if I'm already inside IR35?", a: "We'll advise on the most tax-efficient way to operate through an umbrella via Clever FLEX, and keep your PSC in good standing for future outside contracts." },
      { q: "What's included in the monthly fee?", a: "Everything: specialist contractor accountant, year-end accounts, CT600, VAT returns, director payroll, Companies House filings, director self assessment, IR35 support, contract reviews, Clever FLEX, free FreeAgent software, and unlimited advice." },
    ],
    testimonial: {
      name: "James Cooper",
      role: "IT Contractor",
      quote: "The IR35 support alone is worth every penny. They reviewed my contract within 24 hours and I had a written opinion the same day. Completely invaluable.",
    },
    stats: [
      { value: "2,000+", label: "Contractors trust us with their IR35", colour: "from-primary to-blue-400" },
      { value: "24hr", label: "Typical contract review turnaround", colour: "from-secondary to-emerald-400" },
      { value: "£000s", label: "More take-home outside vs inside IR35", colour: "from-amber-500 to-yellow-400" },
      { value: "20+", label: "Years of contractor tax expertise", colour: "from-purple-500 to-pink-400" },
    ],
    lifestyleImage: {
      src: "/images/hero-accountant.jpg",
      alt: "Contractor working with their accountant",
      heading: "Your IR35 specialist is one call away.",
      body: "New contract? Renewal coming up? Not sure about your status? Your dedicated contractor accountant reviews your situation, advises on working practices, and gives you a clear written IR35 opinion — fast. No waiting, no vague answers.",
    },
    serviceCategories: [
      {
        title: "IR35 Support",
        items: [
          "Written IR35 contract opinion",
          "Working practice assessments",
          "Contract wording recommendations",
          "HMRC enquiry support",
        ],
      },
      {
        title: "Clever FLEX",
        items: [
          "Seamless PSC to umbrella switching",
          "Umbrella payroll processing",
          "Inside IR35 tax optimisation",
          "No disruption between contracts",
        ],
      },
      {
        title: "PSC Accounting",
        items: [
          "Year-end accounts & CT600",
          "Quarterly VAT returns (MTD)",
          "Director payroll & RTI",
          "Companies House filings",
        ],
      },
      {
        title: "Tax Planning",
        items: [
          "Optimal salary/dividend structure",
          "Corporation tax minimisation",
          "Expenses & allowances advice",
          "Year-round proactive guidance",
        ],
      },
      {
        title: "Compliance",
        items: [
          "Director self assessment",
          "HMRC correspondence handled",
          "Auto-enrolment managed",
          "Registered agent with HMRC",
        ],
      },
      {
        title: "Day-to-Day Support",
        items: [
          "Dedicated accountant by name",
          "Unlimited calls & emails",
          "Free FreeAgent software",
          "Real-time financial dashboard",
        ],
      },
    ],
  },
  "freelancer-accountancy": {
    slug: "freelancer-accountancy",
    title: "Freelancer Accountants",
    headline: "Accounting Made Simple for Freelancers",
    description:
      "Tailored accounting support for freelancers. Focus on your craft while we handle your finances — self assessment, expenses, invoicing and tax planning, all for one monthly fee.",
    metaDescription:
      "Online accounting for freelancers. Dedicated accountant, self assessment, invoicing, expense tracking. From £42.50/month. No setup fees.",
    price: "42.50",
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
    headline: "Property Accounting That Works as Hard as You Do",
    description:
      "Whether you have one buy-to-let or a growing portfolio, we handle your rental income, expenses, self assessment, and all the complex property tax rules — so you keep more of what your properties earn.",
    metaDescription:
      "Specialist landlord accounting for buy-to-let, HMO, and commercial property. Self assessment, Section 24, CGT, rental income. From £42.50/month. No setup fees.",
    price: "42.50",
    features: [
      "Dedicated property accountant",
      "Self assessment tax return (all rental income)",
      "Section 24 mortgage interest advice",
      "Capital gains tax on property sales",
      "Rental income & expense tracking",
      "HMO & multi-property support",
      "Ltd company incorporation advice",
      "Furnished holiday lettings (FHL) guidance",
      "Commercial property tax advice",
      "Stamp duty & ATED guidance",
      "Free FreeAgent accounting software",
      "Unlimited phone & email support",
    ],
    benefits: [
      {
        title: "Specialist Property Tax Knowledge",
        description: "Property taxation is increasingly complex — Section 24, CGT, ATED, FHL rules. We stay on top of every change so your portfolio stays tax-efficient.",
      },
      {
        title: "Section 24 Strategy",
        description: "The mortgage interest restriction has pushed many landlords into higher tax brackets. We model the impact and advise on structures — including incorporation — to mitigate it.",
      },
      {
        title: "Portfolio-Wide Support",
        description: "One property or twenty — residential, HMO, commercial, or holiday let — we handle all your properties under one fixed monthly fee.",
      },
      {
        title: "Proactive Tax Planning",
        description: "We don't just file your return — we advise year-round on acquisitions, disposals, and restructuring to minimise your overall tax burden.",
      },
    ],
    faqs: [
      { q: "Do I need to declare all my rental income?", a: "Yes — all rental income must be declared on a self assessment tax return, even from a single property. You pay income tax on your rental profit (income minus allowable expenses). We handle your full self assessment as part of your monthly fee." },
      { q: "What is Section 24 and how does it affect me?", a: "Section 24 restricts the amount of mortgage interest you can deduct from rental income. Instead of deducting the full cost, you now receive only a 20% tax credit. This has significantly increased the tax bills of higher-rate landlords. We model the full impact on your portfolio and explore all available mitigation strategies." },
      { q: "Should I put my properties in a limited company?", a: "It depends on your circumstances — how many properties you hold, your income tax rate, your long-term intentions, and your financing. There are real tax advantages but also stamp duty and CGT implications on transfer. Your dedicated accountant will run a full analysis for your specific situation." },
      { q: "Do you handle HMO and multi-unit properties?", a: "Yes. HMOs, blocks of flats, mixed portfolios — we're experienced with all property structures. We track income and expenses property by property and produce a consolidated view for your tax return." },
      { q: "What expenses can I offset against rental income?", a: "Allowable expenses include: letting agent fees, repairs and maintenance (not improvements), buildings and contents insurance, landlord licence fees, ground rent and service charges, council tax and utilities (if you pay them), accountancy fees, and travel to properties. Mortgage interest is now restricted under Section 24." },
      { q: "How does capital gains tax work when I sell a property?", a: "When you sell a rental property you may be liable for CGT and must report it to HMRC within 60 days of completion. We calculate your liability, advise on available reliefs (lettings relief, principal private residence relief where applicable), and file the 60-day report for you." },
      { q: "Do you advise on furnished holiday lettings?", a: "Yes. FHL properties are taxed differently from standard buy-to-lets and can qualify for beneficial reliefs including capital allowances and business asset disposal relief. We assess whether your property qualifies and ensure you're claiming correctly." },
    ],
    testimonial: {
      name: "Mark Henderson",
      role: "Residential Landlord — 6 properties",
      quote: "Section 24 was costing me thousands more each year than I realised. Clever Accounts restructured how I hold my properties and the savings were significant. Wish I'd done it sooner.",
    },
    stats: [
      { value: "£000s", label: "Saved annually through proactive tax planning", colour: "from-primary to-blue-400" },
      { value: "60 days", label: "CGT reporting deadline — we never miss it", colour: "from-secondary to-emerald-400" },
      { value: "20+", label: "Years of property tax expertise", colour: "from-amber-500 to-yellow-400" },
      { value: "All types", label: "BTL, HMO, commercial, holiday lets", colour: "from-purple-500 to-pink-400" },
    ],
    lifestyleImage: {
      src: "/images/hero-accountant.jpg",
      alt: "Property accountant discussing a landlord's portfolio",
      heading: "Property tax is complex. We make it simple.",
      body: "Section 24, CGT deadlines, ATED charges, FHL rules — the tax landscape for landlords keeps getting more complicated. Your dedicated property accountant stays on top of every change and makes sure your portfolio is always structured to minimise tax and maximise your returns.",
    },
    serviceCategories: [
      {
        title: "Self Assessment & Rental Income",
        items: [
          "Annual self assessment filed on time",
          "All rental income calculated & reported",
          "Income & expense reconciliation",
          "Multiple properties in one return",
        ],
      },
      {
        title: "Section 24 & Mortgage Interest",
        items: [
          "Full Section 24 impact analysis",
          "Tax credit calculation & optimisation",
          "Incorporation feasibility advice",
          "Year-round mortgage relief strategy",
        ],
      },
      {
        title: "Capital Gains Tax",
        items: [
          "CGT calculated on property sales",
          "60-day CGT report filed with HMRC",
          "Relief identification (PPR, lettings)",
          "Disposal timing advice",
        ],
      },
      {
        title: "Portfolio Structuring",
        items: [
          "Ltd company incorporation advice",
          "SPV structure guidance",
          "Stamp duty implications assessed",
          "Long-term portfolio tax planning",
        ],
      },
      {
        title: "Specialist Property Areas",
        items: [
          "HMO income & licensing costs",
          "Furnished holiday lettings (FHL)",
          "Commercial property taxation",
          "ATED returns for high-value properties",
        ],
      },
      {
        title: "Ongoing Support",
        items: [
          "Dedicated property accountant",
          "Unlimited calls & emails",
          "Free FreeAgent software",
          "MTD for Income Tax compliant",
        ],
      },
    ],
  },
  "accounting-for-startups": {
    slug: "accounting-for-startups",
    title: "Startup Accountants",
    headline: "Accounting for Startups & New Businesses",
    description:
      "Get your new business off to the best start. Expert accounting support from day one, with guidance on structure, tax planning, and compliance — all for one affordable monthly fee.",
    metaDescription:
      "Online accounting for startups & new businesses. Expert guidance, company formation advice, tax planning. From £42.50/month. No setup fees.",
    price: "42.50",
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
        description: "Start from just £42.50/month with no setup fees. Professional accounting shouldn't break the bank for new businesses.",
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
