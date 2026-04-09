import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/constants";

const footerLinks = {
  services: [
    { label: "Sole Trader", href: "/sole-trader" },
    { label: "Limited Company", href: "/limited-company" },
    { label: "Contractor", href: "/contractor-accountancy" },
    { label: "Freelancer", href: "/freelancer-accountancy" },
    { label: "Landlord", href: "/landlord-accounting" },
    { label: "Startups", href: "/accounting-for-startups" },
    { label: "IR35 Specialist", href: "/contractor-accountants/ir35" },
  ],
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  useful: [
    { label: "Pricing", href: "/pricing" },
    { label: "Accounting Software", href: "/our-services/accounting-software" },
    { label: "Switch Accountant", href: "/our-services/accountant-switch" },
    { label: "Compare", href: "/compare" },
    { label: "VAT Returns", href: "/vat-returns" },
    { label: "Payroll Services", href: "/payroll-services" },
    { label: "Tax Returns", href: "/tax-returns" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center text-white font-bold text-lg">
                CA
              </div>
              <div>
                <span className="text-xl font-bold text-white">Clever</span>
                <span className="text-xl font-bold text-primary-light"> Accounts</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              For nearly 20 years, Clever Accounts has been providing expert online accountancy services to over 10,000 UK businesses. One monthly fee, unlimited support.
            </p>
            <div className="space-y-3">
              <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-light transition-colors">
                <Phone size={16} className="text-primary" />
                {COMPANY.freephone} (Freephone)
              </a>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-light transition-colors">
                <Phone size={16} className="text-primary" />
                {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-light transition-colors">
                <Mail size={16} className="text-primary" />
                {COMPANY.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span>Leeds & Watford, UK</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
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

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Useful Links</h3>
            <ul className="space-y-2.5">
              {footerLinks.useful.map((link) => (
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
