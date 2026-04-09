export const COMPANY = {
  name: "Clever Accounts",
  tagline: "Online Accounting Made Clever",
  phone: "0113 518 8800",
  freephone: "0800 756 9786",
  email: "info@cleveraccounts.com",
  website: "https://cleveraccounts.com",
  portalUrl: "https://portal.cleveraccounts.com",
  offices: [
    {
      city: "Leeds",
      address: "Leeds, West Yorkshire, UK",
    },
    {
      city: "Watford",
      address: "Watford, Hertfordshire, UK",
    },
  ],
  stats: {
    years: 20,
    businesses: 10000,
    setupFee: 0,
    rating: 5,
  },
  social: {
    facebook: "https://www.facebook.com/cleveraccounts",
    twitter: "https://twitter.com/cleveraccounts",
    linkedin: "https://www.linkedin.com/company/clever-accounts",
  },
};

export const NAV_LINKS = [
  {
    label: "Services",
    href: "/our-services",
    children: [
      { label: "Sole Trader", href: "/sole-trader" },
      { label: "Limited Company", href: "/limited-company" },
      { label: "Contractor", href: "/contractor-accountancy" },
      { label: "Freelancer", href: "/freelancer-accountancy" },
      { label: "Landlord", href: "/landlord-accounting" },
      { label: "Startups", href: "/accounting-for-startups" },
      { label: "IR35 Specialist", href: "/contractor-accountants/ir35" },
      { label: "Accounting Software", href: "/our-services/accounting-software" },
      { label: "Switch Accountant", href: "/our-services/accountant-switch" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about-us" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const SERVICE_CATEGORIES = [
  {
    title: "Sole Trader",
    description: "Straightforward, hassle-free online accounting designed exclusively for sole traders.",
    href: "/sole-trader",
    icon: "User",
    price: "32.50",
  },
  {
    title: "Limited Company",
    description: "Complete accounting service and software for your limited company, all in one monthly fee.",
    href: "/limited-company",
    icon: "Building2",
    price: "104.50",
  },
  {
    title: "Contractor",
    description: "Specialist contractor accounting with end-to-end IR35 support and Clever FLEX.",
    href: "/contractor-accountancy",
    icon: "Briefcase",
    price: "104.50",
  },
  {
    title: "Freelancer",
    description: "Tailored accounting support so you can focus on doing what you do best.",
    href: "/freelancer-accountancy",
    icon: "Laptop",
    price: "32.50",
  },
  {
    title: "Landlord",
    description: "Comprehensive accounting for property investors and landlords. Peace of mind included.",
    href: "/landlord-accounting",
    icon: "Home",
    price: "32.50",
  },
  {
    title: "Startup",
    description: "Get your new business off to the best start with expert accounting from day one.",
    href: "/accounting-for-startups",
    icon: "Rocket",
    price: "32.50",
  },
];

export const FEATURES = [
  {
    title: "Dedicated Accountant",
    description: "Your own dedicated accountant who knows your business inside out.",
    icon: "UserCheck",
  },
  {
    title: "Unlimited Advice",
    description: "Call or email as often as you need — no extra charges, ever.",
    icon: "MessageCircle",
  },
  {
    title: "Free Accounting Software",
    description: "FreeAgent accounting software included free with every package.",
    icon: "Monitor",
  },
  {
    title: "No Setup Fees",
    description: "Get started immediately with zero upfront costs.",
    icon: "BadgePoundSterling",
  },
  {
    title: "No Minimum Contract",
    description: "Stay because you want to, not because you have to. Cancel anytime.",
    icon: "ShieldCheck",
  },
  {
    title: "Tax Efficiency Advice",
    description: "Proactive advice to ensure you're as tax-efficient as possible.",
    icon: "TrendingDown",
  },
  {
    title: "Year-End Accounts",
    description: "All accounts prepared and submitted to Companies House and HMRC.",
    icon: "FileCheck",
  },
  {
    title: "Real-Time Dashboard",
    description: "Track your finances anytime on computer, tablet or phone.",
    icon: "BarChart3",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Sole Trader",
    quote: "Clever Accounts has been fantastic for my business. My dedicated accountant is always available and has saved me thousands in tax. Switching was the best decision I ever made.",
    rating: 5,
  },
  {
    name: "James Cooper",
    role: "IT Contractor",
    quote: "The IR35 support alone is worth every penny. They handle everything — contracts, assessments, and switching between umbrella and PSC seamlessly with Clever FLEX.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Limited Company Director",
    quote: "I used to dread tax season. Now everything is handled for me. The software is easy to use and my accountant is just a phone call away. Highly recommend!",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Startup Founder",
    quote: "As a new business owner, having Clever Accounts on my side gave me confidence from day one. Their advice has been invaluable and the price is unbeatable.",
    rating: 5,
  },
];
