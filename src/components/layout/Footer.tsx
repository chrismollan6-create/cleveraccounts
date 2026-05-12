import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/constants";

// Footer columns mirror the top nav structure so the two stay in sync.
// "Who We Help" + "Specialist Services" exactly match the Services dropdown
// in the header. "Guides" is footer-only (educational/SEO content). "Company"
// contains site-wide utility pages (About, Pricing, Compare, FAQ etc.) plus
// the standalone top-level nav items (How It Works, Blog, Contact).
const footerLinks = {
  whoWeHelp: [
    { label: "Sole Trader", href: "/sole-trader" },
    { label: "Limited Company", href: "/limited-company" },
    { label: "Contractor", href: "/contractor-accountancy" },
    { label: "Freelancer", href: "/freelancer-accountancy" },
    { label: "Landlord", href: "/landlord-accounting" },
    { label: "Startups", href: "/accounting-for-startups" },
    { label: "CIS / Construction", href: "/cis-accounting" },
    { label: "Ecommerce", href: "/ecommerce-accounting" },
  ],
  specialistServices: [
    { label: "IR35 Specialist", href: "/contractor-accountants/ir35" },
    { label: "Self Assessment", href: "/self-assessment" },
    { label: "VAT Returns", href: "/vat-returns" },
    { label: "Payroll Services", href: "/payroll-services" },
    { label: "Tax Returns", href: "/tax-returns" },
    { label: "Making Tax Digital", href: "/making-tax-digital" },
    { label: "Accounting Software", href: "/our-services/accounting-software" },
    { label: "Switch Accountant", href: "/our-services/accountant-switch" },
    { label: "Take Home Calculator", href: "/take-home-calculator" },
    { label: "Integrations", href: "/integrations" },
    { label: "Partner Services", href: "/partners" },
  ],
  guides: [
    { label: "IT Contractor Guide", href: "/it-contractor-accountant" },
    { label: "Small Limited Company Guide", href: "/small-business-accountant" },
    { label: "Switching Accountants Guide", href: "/switching-accountants" },
  ],
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare", href: "/compare" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="inline-flex items-center bg-white rounded-xl px-2 py-1 shadow-sm">
                <Image src="/images/logo.png" alt="Clever Accounts" width={160} height={48} className="h-9 w-auto" />
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              For nearly 20 years, Clever Accounts has been providing expert online accountancy services to over 10,000 UK businesses. One monthly fee, unlimited support.
            </p>
            <div className="space-y-3">
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-light transition-colors">
                <Phone size={16} className="text-primary" />
                {COMPANY.phone}
              </a>

              <div className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span>Leeds, UK</span>
              </div>
            </div>
          </div>

          {/* Who We Help — mirrors top nav */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Who We Help</h3>
            <ul className="space-y-2.5">
              {footerLinks.whoWeHelp.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialist Services — mirrors top nav + footer-only service pages */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Specialist Services</h3>
            <ul className="space-y-2.5">
              {footerLinks.specialistServices.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides — educational / SEO content (footer only) */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Guides</h3>
            <ul className="space-y-2.5">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — site-wide utility pages */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Clever Accounts Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
