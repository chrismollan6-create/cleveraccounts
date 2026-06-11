import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = join(ROOT, ".env.local");
if (existsSync(env))
  for (const l of readFileSync(env, "utf8").split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
const c = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// stable _key from an href so re-running keeps keys consistent
const key = (s) => "k" + s.replace(/[^a-z0-9]/gi, "").slice(0, 24);
const link = (label, href) => ({ _key: key(href + label), _type: "navChild", label, href });
const fLink = (label, href) => ({ _key: key(href + label), _type: "footerLink", label, href });

const headerLinks = [
  {
    _key: "services",
    _type: "navItem",
    label: "Services",
    href: "/our-services",
    sections: [
      {
        _key: "whoWeHelp",
        _type: "navSection",
        heading: "Who We Help",
        items: [
          link("Sole Trader", "/sole-trader"),
          link("Limited Company", "/limited-company"),
          link("Contractor", "/contractor-accountancy"),
          link("Freelancer", "/freelancer-accountancy"),
          link("Landlord", "/landlord-accounting"),
          link("Startups", "/accounting-for-startups"),
          link("CIS / Construction", "/cis-accounting"),
          link("Ecommerce", "/ecommerce-accounting"),
        ],
      },
      {
        _key: "specialist",
        _type: "navSection",
        heading: "Specialist Services",
        items: [
          link("IR35 Specialist", "/contractor-accountants/ir35"),
          link("Self Assessment", "/self-assessment"),
          link("VAT Returns", "/vat-returns"),
          link("Making Tax Digital", "/making-tax-digital"),
          link("Take Home Calculator", "/take-home-calculator"),
          link("Integrations", "/integrations"),
          link("Switch Accountant", "/our-services/accountant-switch"),
          link("Partner Services", "/partners"),
        ],
      },
    ],
  },
  { _key: "pricing", _type: "navItem", label: "Pricing", href: "/pricing" },
  { _key: "howitworks", _type: "navItem", label: "How It Works", href: "/how-it-works" },
  { _key: "about", _type: "navItem", label: "About", href: "/about-us" },
  { _key: "blog", _type: "navItem", label: "Blog", href: "/blog" },
  { _key: "contact", _type: "navItem", label: "Contact", href: "/contact" },
];

const footerColumns = [
  {
    _key: "fc-help",
    _type: "footerColumn",
    heading: "Who We Help",
    links: [
      fLink("Sole Trader", "/sole-trader"),
      fLink("Limited Company", "/limited-company"),
      fLink("Contractor", "/contractor-accountancy"),
      fLink("Freelancer", "/freelancer-accountancy"),
      fLink("Landlord", "/landlord-accounting"),
      fLink("Startups", "/accounting-for-startups"),
      fLink("CIS / Construction", "/cis-accounting"),
      fLink("Ecommerce", "/ecommerce-accounting"),
    ],
  },
  {
    _key: "fc-specialist",
    _type: "footerColumn",
    heading: "Specialist Services",
    links: [
      fLink("IR35 Specialist", "/contractor-accountants/ir35"),
      fLink("Self Assessment", "/self-assessment"),
      fLink("VAT Returns", "/vat-returns"),
      fLink("Payroll Services", "/payroll-services"),
      fLink("Tax Returns", "/tax-returns"),
      fLink("Making Tax Digital", "/making-tax-digital"),
      fLink("Accounting Software", "/our-services/accounting-software"),
      fLink("Switch Accountant", "/our-services/accountant-switch"),
      fLink("Take Home Calculator", "/take-home-calculator"),
      fLink("Integrations", "/integrations"),
      fLink("Partner Services", "/partners"),
    ],
  },
  {
    _key: "fc-guides",
    _type: "footerColumn",
    heading: "Guides",
    links: [
      fLink("IT Contractor Guide", "/it-contractor-accountant"),
      fLink("Small Limited Company Guide", "/small-business-accountant"),
      fLink("Switching Accountants Guide", "/switching-accountants"),
    ],
  },
  {
    _key: "fc-company",
    _type: "footerColumn",
    heading: "Company",
    links: [
      fLink("About Us", "/about-us"),
      fLink("How It Works", "/how-it-works"),
      fLink("Pricing", "/pricing"),
      fLink("Compare", "/compare"),
      fLink("Reviews", "/reviews"),
      fLink("Blog", "/blog"),
      fLink("FAQ", "/faq"),
      fLink("Contact", "/contact"),
    ],
  },
];

for (const id of ["navigation", "navigation-workwell"]) {
  await c.createOrReplace({ _id: id, _type: "navigation", headerLinks, footerColumns });
  console.log(`✓ seeded ${id} — ${headerLinks.length} menu items, ${footerColumns.length} footer columns`);
}
