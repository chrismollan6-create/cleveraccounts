"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  CreditCard, ClipboardList, User, Building2, MapPin, Info,
  ShieldCheck, Search, ChevronDown, HelpCircle, ArrowRight,
  Check, Plus, Star, Phone, Mail, Calendar, Gift, Mailbox,
  Sparkles, Award,
} from "lucide-react";
import { trackEvent, captureUTMParams, getStoredUTMParams } from "@/components/seo/GoogleTagManager";
import { useBrand } from "@/lib/useBrand";
import { brandPossessive } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversionStatusAccountant {
  name?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  title?: string;
}

interface ConversionStatus {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  branding?: string;
  isConverted?: boolean;
  signUpIncentive?: string;
  monthlyFee?: number;
  subtotalNet?: number;
  vatRate?: number;
  vatAmount?: number;
  totalGross?: number;
  nextChargeDate?: string;
  fullMonthlyFee?: number;
  accountId?: string;
  accountName?: string;
  accountant?: ConversionStatusAccountant;
}

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  company: string; businessStructure: string; expectedFee: string; signUpIncentive: string;
  sector: string; describeTheBusiness: string; newCompany: boolean; companyNumber: string;
  dateOfBirth: string; personalUtr: string; nationalInsuranceNumber: string;
  nationality: string; directorFirstName: string; directorLastName: string;
  transferringFromAccountant: boolean; priorAccountantDetails: string; whyLookingToChange: string;
  ownerStreet: string; ownerCity: string; ownerCounty: string; ownerPostalCode: string;
  vatNeeded: string; vatNumber: string; payeNeeded: string; payeReference: string;
  payeAccountsOffice: string; tradingStartDate: string;
  registeredOfficeAddress: boolean | null;
  mailingStreet: string; mailingCity: string; mailingState: string;
  mailingPostalCode: string; mailingCountry: string;
  stripePaymentIntentId: string; termsAccepted: boolean;
}

interface PostcoderAddress {
  addressline1: string; addressline2?: string; addressline3?: string;
  posttown: string; county?: string; postcode: string;
}

// Feature flag — skip the upfront Stripe payment step in the sign-up flow.
// Reason: 5 of 11 signups in May/June 2026 dropped out at the payment screen.
// Set back to `false` to restore the original 5-step flow (all Stripe code below is left intact).
// Paired with a `paymentBypassed: true` flag in the submit body that LeadSignupService
// reads to skip its stripePaymentIntentId requirement. Sign_up_incentive__c is left
// untouched so downstream billing semantics are unaffected.
const BYPASS_SIGNUP_PAYMENT = true;

const EMPTY_FORM: FormData = {
  firstName: "", lastName: "", email: "", phone: "", company: "",
  businessStructure: "", expectedFee: "", signUpIncentive: "",
  sector: "", describeTheBusiness: "", newCompany: false, companyNumber: "",
  dateOfBirth: "", personalUtr: "", nationalInsuranceNumber: "",
  nationality: "", directorFirstName: "", directorLastName: "",
  transferringFromAccountant: false, priorAccountantDetails: "", whyLookingToChange: "",
  ownerStreet: "", ownerCity: "", ownerCounty: "", ownerPostalCode: "",
  vatNeeded: "", vatNumber: "", payeNeeded: "", payeReference: "",
  payeAccountsOffice: "", tradingStartDate: "", registeredOfficeAddress: null,
  mailingStreet: "", mailingCity: "", mailingState: "",
  mailingPostalCode: "", mailingCountry: "United Kingdom",
  stripePaymentIntentId: "", termsAccepted: false,
};

// ISO yyyy-mm-dd → DD/MM/YYYY for UK-facing summary display.
// Returns the original string unchanged if it isn't a valid ISO date.
function formatDobUK(iso: string): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

const SECTORS = [
  // Animals & Pets
  "Animal Behaviourist",
  "Animal Grooming",
  "Cat Sitting & Cat Care",
  "Dog Boarding & Kennels",
  "Dog Training",
  "Dog Walking",
  "Equestrian & Horse Care",
  "Pet Photography",
  "Pet Sitting",
  "Veterinary",
  // Arts, Crafts & Creative
  "Art & Illustration",
  "Calligraphy",
  "Candle Making",
  "Ceramics & Pottery",
  "Craft Maker & Seller",
  "Embroidery & Needlework",
  "Fine Art & Painting",
  "Jewellery Making",
  "Knitting & Crochet",
  "Leather Goods & Accessories",
  "Printmaking",
  "Sculpture",
  "Stained Glass",
  "Textile & Fabric Art",
  "Woodworking & Crafts",
  // Beauty, Hair & Wellness
  "Aesthetics & Cosmetic Treatments",
  "Barbering",
  "Eyelash & Brow Technician",
  "Hair & Beauty",
  "Hairdressing",
  "Makeup Artist",
  "Massage Therapist",
  "Nail Technician",
  "Permanent Makeup & Microblading",
  "Spray Tanning",
  "Tattoo Artist",
  // Children & Education
  "Au Pair & Nanny",
  "After-School Club",
  "Childcare & Nursery",
  "Children's Activities & Classes",
  "Children's Entertainment",
  "Early Years & EYFS",
  "Education & Teaching",
  "Music Teacher (Children)",
  "Private Tutoring",
  "SEN Support & Tutoring",
  "Training Provider",
  // Construction & Trades
  "Air Conditioning & Refrigeration",
  "Bricklaying",
  "Building & General Contractor",
  "Carpentry & Joinery",
  "CIS Contractor / Subcontractor",
  "Decorating & Painting",
  "Drainage & Sewage",
  "Electrical",
  "Fencing & Gates",
  "Flooring",
  "Gas Engineer",
  "Glazing & Windows",
  "Groundworks",
  "Handyman Services",
  "Heating & Plumbing",
  "Insulation",
  "Kitchen & Bathroom Fitting",
  "Plastering",
  "Property Development",
  "Roofing",
  "Scaffolding",
  "Solar & Renewables Installation",
  "Stonemasonry",
  "Tiling",
  // Consulting & Professional Services
  "Accountancy & Bookkeeping",
  "Architecture",
  "Business Coaching",
  "Consulting & Management Consulting",
  "Engineering Consulting",
  "Financial Advice & Planning",
  "HR & Recruitment",
  "Immigration Advice",
  "Insurance",
  "Legal Services / Solicitor",
  "Life Coaching",
  "Marketing & PR",
  "Project Management",
  "Research & Analysis",
  "Training & Coaching",
  // Creative, Media & Entertainment
  "Acting & Entertainment",
  "Advertising & Creative Agency",
  "Animation",
  "Audio Engineering",
  "Comedian & Stand-Up",
  "Content Creation & Influencer",
  "Copywriting",
  "DJ & Live Entertainment",
  "Film & TV Production",
  "Graphic & Web Design",
  "Interior Design",
  "Journalism & Writing",
  "Magician & Entertainer",
  "Music & Audio Production",
  "Musician & Performer",
  "Photography",
  "Podcasting",
  "Publishing",
  "Scriptwriting",
  "Social Media Management",
  "Video Production & Editing",
  "Voice Over Artist",
  // Events & Hospitality
  "Bar & Pub",
  "Catering & Private Chef",
  "Coffee Shop & Café",
  "Event Management",
  "Events & Wedding Planning",
  "Florist",
  "Food & Beverage Production",
  "Mobile Catering & Food Van",
  "Party Planning",
  "Restaurant",
  "Takeaway & Delivery",
  "Wedding Photography & Videography",
  // Fashion, Retail & Products
  "Alterations & Tailoring",
  "Clothing & Fashion Design",
  "E-commerce & Online Retail",
  "Food Producer & Artisan",
  "Handmade & Etsy Seller",
  "Homeware & Gifts",
  "Market Trader",
  "Online Retail",
  "Reselling & Vintage",
  "Skincare & Cosmetics Brand",
  // Finance & Investment
  "Cryptocurrency & NFTs",
  "Forex & Trading",
  "Investment",
  "Mortgage Broker",
  "Pension & Wealth Management",
  // Fitness, Sport & Outdoor
  "Boxing & Martial Arts Coach",
  "Cycling Coach",
  "Fitness & Personal Training",
  "Football Coach",
  "Golf Coach",
  "Gym & Fitness Classes",
  "Outdoor Activities & Adventure",
  "Personal Trainer",
  "Pilates Instructor",
  "Running Coach",
  "Sports Coaching",
  "Swimming Teacher",
  "Tennis Coach",
  "Yoga Instructor",
  // Food & Drink
  "Bakery",
  "Brewery & Distillery",
  "Catering & Food",
  "Food Delivery",
  "Food Producer",
  "Meal Prep & Healthy Eating",
  "Street Food",
  // Health & Medical
  "Acupuncture",
  "Chiropractic & Osteopathy",
  "Counselling & Psychotherapy",
  "Dentistry",
  "Dietitian & Nutritionist",
  "Healthcare & NHS",
  "Homeopathy & Natural Remedies",
  "Hypnotherapy",
  "Midwifery",
  "Nursing & Care",
  "Occupational Therapy",
  "Optometry",
  "Pharmacy",
  "Physiotherapy",
  "Psychology",
  "Reflexology",
  "Reiki & Energy Healing",
  "Speech & Language Therapy",
  // Home & Garden
  "Cleaning Services",
  "Domestic Cleaning",
  "End of Tenancy Cleaning",
  "Garden Design",
  "Home Organisation",
  "House Sitting",
  "Ironing & Laundry",
  "Landscaping & Gardening",
  "Lawn Care",
  "Oven Cleaning",
  "Pest Control",
  "Pool & Hot Tub Maintenance",
  "Tree Surgery & Arborist",
  "Window Cleaning",
  // Property & Landlord
  "Buy-to-Let Landlord",
  "Commercial Property",
  "Estate Agent",
  "HMO Landlord",
  "Letting Agent",
  "Property Management",
  "Property Sourcing",
  "Short-Term / Airbnb Lettings",
  // Technology & Digital
  "App Development",
  "Cybersecurity",
  "Data Science & Analytics",
  "Digital Marketing & SEO",
  "IT Contracting",
  "IT Support",
  "Software Development",
  "UX & UI Design",
  "Web Development",
  // Transport & Logistics
  "Courier & Delivery",
  "Driving Instructor",
  "Freight & Haulage",
  "Removal Services",
  "Taxi & Private Hire",
  "Van & Vehicle Hire",
  // Other
  "Agriculture & Farming",
  "Automotive & Mechanics",
  "Charity & Non-Profit",
  "Environmental & Sustainability",
  "Export & Import",
  "Funeral Services",
  "Manufacturing",
  "Security Services",
  "Other — not listed",
].sort((a, b) => a.localeCompare(b));

const NATIONALITIES = [
  "British", "Irish", "American", "Australian", "Canadian", "French",
  "German", "Indian", "Italian", "Pakistani", "Polish", "Romanian",
  "South African", "Spanish", "Other",
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls = "w-full px-4 py-3.5 border border-gray-200 rounded-xl text-text placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all bg-white text-[15px] hover:border-gray-300";
const inputErrCls = inputCls + " !border-red-400 focus:!ring-red-100";
const selectCls = inputCls;

// ─── Inline validation helpers ─────────────────────────────────────────────────
// These run on every keystroke / blur to give users instant positive feedback
// when a field is valid (green tick), without flagging errors prematurely.

const VALIDATORS: Record<string, (v: string) => boolean> = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  ukPostcode: (v) => /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(v.trim()),
  niNumber: (v) => /^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\d{6}[A-D]$/i.test(v.trim()),
  utr: (v) => /^\d{10}$/.test(v.trim()),
  companyNumber: (v) => /^\d{8}$/.test(v.trim()) || /^[A-Z]{2}\d{6}$/i.test(v.trim()),
  required: (v) => v.trim().length > 0,
  longText: (v) => v.trim().length >= 10,
  ukPhone: (v) => /^(\+?44|0)\s?\d(\s?\d){8,9}$/.test(v.replace(/\s/g, "")),
  // YYYY-MM-DD (HTML date input format). Must be a real date, 4-digit year
  // between 1900 and today, and at least 18 years ago (HMRC + director rules).
  dob: (v) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(v);
    if (isNaN(d.getTime())) return false;
    const [y, m, day] = v.split("-").map(Number);
    if (d.getFullYear() !== y || d.getMonth() + 1 !== m || d.getDate() !== day) return false;
    if (y < 1900) return false;
    const today = new Date();
    const eighteen = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return d <= eighteen;
  },
};

// Returns "valid" | "invalid" | "empty"
function validateField(value: string, ...rules: (keyof typeof VALIDATORS)[]): "valid" | "invalid" | "empty" {
  if (!value || !value.trim()) return "empty";
  return rules.every((r) => VALIDATORS[r](value)) ? "valid" : "invalid";
}

// ─── Reusable field helpers ───────────────────────────────────────────────────

function FieldWrapper({
  label, required, hint, error, children, tip, validState,
}: {
  label: string; required?: boolean; hint?: string; error?: string;
  children: React.ReactNode; tip?: string;
  validState?: "valid" | "invalid" | "empty";
}) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <label className="block text-[13px] font-semibold text-dark tracking-tight">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {tip && (
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                onClick={() => setShowTip((v) => !v)}
                className="text-text-light hover:text-primary transition-colors"
              >
                <HelpCircle size={14} />
              </button>
              {showTip && (
                <div className="absolute z-10 left-6 top-0 w-64 bg-dark text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
                  {tip}
                </div>
              )}
            </div>
          )}
        </div>
        {validState === "valid" && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
            <Check size={12} strokeWidth={3} /> Looks good
          </span>
        )}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-text-light mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

// Collapsible optional section — keeps the form light by hiding non-required content
// behind a ghost-button. Auto-opens if any inner field already has data.
function OptionalSection({
  label, sublabel, icon, defaultOpen = false, children,
}: {
  label: string; sublabel?: string; icon?: React.ReactNode;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (open) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold text-dark flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {label}
          </p>
          <button type="button" onClick={() => setOpen(false)}
            className="text-xs text-text-light hover:text-dark transition-colors">
            Hide
          </button>
        </div>
        {children}
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setOpen(true)}
      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/[0.02] transition-all text-sm font-semibold text-text-light hover:text-primary">
      <Plus size={16} />
      <span>{label}</span>
      {sublabel && <span className="text-xs font-normal text-text-light/70">({sublabel})</span>}
    </button>
  );
}

function InfoBox({ icon, children, colour = "blue" }: {
  icon?: React.ReactNode; children: React.ReactNode; colour?: "blue" | "green" | "amber";
}) {
  const colours = {
    blue: "bg-primary/[0.04] border-primary/20 text-primary-dark",
    green: "bg-emerald-50/60 border-emerald-200/70 text-emerald-800",
    amber: "bg-amber-50/60 border-amber-200/70 text-amber-800",
  };
  const iconColours = {
    blue: "text-primary",
    green: "text-emerald-600",
    amber: "text-amber-600",
  };
  return (
    <div className={`flex gap-3 p-4 rounded-xl border text-sm leading-relaxed ${colours[colour]}`}>
      {icon && <div className={`shrink-0 mt-0.5 ${iconColours[colour]}`}>{icon}</div>}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function SectionCard({ icon, title, description, children }: {
  icon: React.ReactNode; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow p-6 md:p-7 space-y-5">
      {/* Flush header — no grey strip */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-bold text-dark text-base leading-tight tracking-tight">{title}</h3>
          {description && <p className="text-sm text-text-light mt-1 leading-relaxed">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// "Next up" preview — shown at the bottom of each editable step so users always know
// what's coming and that they're nearly done. Reduces "how long is this going to take" anxiety.
/**
 * One row in the post-signup onboarding timeline. `done` toggles the visual
 * (green check vs. soft pending dot). `when` is a short relative timing
 * label that sits to the right of the title.
 */
function TimelineStep({
  icon, title, when, done,
}: { icon: React.ReactNode; title: string; when: string; done: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          done
            ? 'bg-emerald-50 text-success border border-emerald-200'
            : 'bg-gray-50 text-text-light border border-gray-200'
        }`}
      >
        {done ? <Check size={16} strokeWidth={2.5} /> : icon}
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-3 pt-1">
        <p className={`text-sm ${done ? 'text-text-light line-through decoration-1' : 'text-text font-medium'}`}>
          {title}
        </p>
        <p className="text-xs text-text-light shrink-0">{when}</p>
      </div>
    </li>
  );
}

function NextUpHint({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-text-light shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider">Coming up next</p>
        <p className="text-sm font-semibold text-dark truncate">{title}</p>
        <p className="text-xs text-text-light truncate">{desc}</p>
      </div>
    </div>
  );
}

// ─── PostCoder address lookup ─────────────────────────────────────────────────

function AddressLookup({
  onSelect, fieldPrefix,
}: {
  onSelect: (street: string, city: string, county: string, postcode: string) => void;
  fieldPrefix: string;
}) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<PostcoderAddress[]>([]);
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    const pc = query.trim();
    if (pc.length < 3) { setError("Please enter a valid postcode"); return; }
    setSearching(true); setError(""); setSearched(false); setResults([]);
    try {
      const res = await fetch(`/api/address?postcode=${encodeURIComponent(pc)}`);
      const data = await res.json();
      if (!res.ok || data.error) { setError("No addresses found. Please enter manually."); return; }
      if (!Array.isArray(data) || data.length === 0) { setError("No addresses found for that postcode."); return; }
      setResults(data);
      setOpen(true);
      setSearched(true);
    } catch {
      setError("Lookup unavailable. Please enter address manually.");
    } finally {
      setSearching(false);
    }
  }

  function pick(addr: PostcoderAddress) {
    const lines = [addr.addressline1, addr.addressline2, addr.addressline3].filter(Boolean);
    onSelect(lines.join(", "), addr.posttown, addr.county ?? "", addr.postcode);
    setOpen(false);
    setResults([]);
    setQuery(addr.postcode);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-light uppercase tracking-wide">{fieldPrefix} Address Search</p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), search())}
            placeholder="Enter postcode (e.g. SW1A 1AA)"
            className={inputCls}
          />
        </div>
        <button
          type="button"
          onClick={search}
          disabled={searching}
          className="px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {searching ? "Searching…" : "Find Address"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {open && results.length > 0 && (
        <div className="border border-border rounded-xl bg-white shadow-lg max-h-56 overflow-y-auto divide-y divide-gray-50">
          {results.map((addr, i) => {
            const lines = [addr.addressline1, addr.addressline2, addr.addressline3, addr.posttown].filter(Boolean);
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(addr)}
                className="w-full text-left px-4 py-2.5 hover:bg-primary/5 text-sm text-text transition-colors"
              >
                <span className="font-medium">{lines[0]}</span>
                {lines.length > 1 && <span className="text-text-light"> — {lines.slice(1).join(", ")}</span>}
                <span className="text-xs text-text-light ml-2">{addr.postcode}</span>
              </button>
            );
          })}
        </div>
      )}
      {searched && !open && (
        <p className="text-xs text-text-light">Address selected. Edit the fields below if needed.</p>
      )}
    </div>
  );
}

function AddressFields({
  prefix, streetField, cityField, countyField, postcodeField,
  streetVal, cityVal, countyVal, postcodeVal,
  onStreet, onCity, onCounty, onPostcode,
  streetError, cityError, postcodeError,
  onLookup,
}: {
  prefix: string;
  streetField: string; cityField: string; countyField: string; postcodeField: string;
  streetVal: string; cityVal: string; countyVal: string; postcodeVal: string;
  onStreet: (v: string) => void; onCity: (v: string) => void;
  onCounty: (v: string) => void; onPostcode: (v: string) => void;
  streetError?: string; cityError?: string; postcodeError?: string;
  onLookup: (s: string, c: string, co: string, pc: string) => void;
}) {
  return (
    <div className="space-y-3">
      <AddressLookup fieldPrefix={prefix} onSelect={onLookup} />
      <div className="grid grid-cols-1 gap-3 pt-1">
        <FieldWrapper label="Street / First line of address" required error={streetError}
          validState={validateField(streetVal, "required")}>
          <input type="text" value={streetVal} onChange={(e) => onStreet(e.target.value)}
            className={streetError ? inputErrCls : inputCls} placeholder="e.g. 12 High Street" />
        </FieldWrapper>
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="Town / City" required error={cityError}
            validState={validateField(cityVal, "required")}>
            <input type="text" value={cityVal} onChange={(e) => onCity(e.target.value)}
              className={cityError ? inputErrCls : inputCls} />
          </FieldWrapper>
          <FieldWrapper label="County">
            <input type="text" value={countyVal} onChange={(e) => onCounty(e.target.value)} className={inputCls} />
          </FieldWrapper>
        </div>
        <FieldWrapper label="Postcode" required error={postcodeError}
          validState={validateField(postcodeVal, "ukPostcode")}>
          <input type="text" value={postcodeVal} onChange={(e) => onPostcode(e.target.value)}
            className={`${postcodeError ? inputErrCls : inputCls} w-40`} />
        </FieldWrapper>
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const ALL_STEPS = [
  { label: "Business", icon: <Building2 size={16} />, time: "1 min" },
  { label: "Identity", icon: <ShieldCheck size={16} />, time: "1 min" },
  { label: "Addresses", icon: <MapPin size={16} />, time: "1 min" },
  { label: "Payment", icon: <CreditCard size={16} />, time: "1 min" },
  { label: "Confirm", icon: <CheckCircle2 size={16} />, time: "30s" },
];

// Visible steps depend on the payment-bypass flag — internal `step` state still uses
// the original numbering (1=Business … 5=Confirm) and we skip 4 in navigation.
const STEPS = BYPASS_SIGNUP_PAYMENT
  ? ALL_STEPS.filter((s) => s.label !== "Payment")
  : ALL_STEPS;

// `current` is the internal step state (1..5); we translate to a display index
// against the visible STEPS array so the dots line up after a step is filtered out.
function StepIndicator({ current }: { current: number }) {
  const displayCurrent = BYPASS_SIGNUP_PAYMENT && current > 4 ? current - 1 : current;
  return (
    <div className="flex items-center mb-6">
      {STEPS.map((step, i) => {
        const num = i + 1;
        const done = num < displayCurrent;
        const active = num === displayCurrent;
        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                done ? "bg-success text-white shadow-sm" :
                active ? "bg-primary text-white shadow-md ring-4 ring-primary/20" :
                "bg-gray-100 text-gray-400"
              }`}>
                {done ? <CheckCircle2 size={18} /> : step.icon}
              </div>
              <span className={`text-[10px] md:text-xs mt-1.5 hidden sm:block font-medium ${
                active ? "text-primary" : done ? "text-success" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 md:mx-2 mb-5 transition-colors ${done ? "bg-success" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Persistent contact info — collapsed view shows summary, expand to edit inline
function ContactStrip({
  firstName, lastName, email, phone,
  onChange,
}: {
  firstName: string; lastName: string; email: string; phone: string;
  onChange: (field: "firstName" | "lastName" | "email" | "phone", value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ firstName, lastName, email, phone });

  function startEdit() {
    setDraft({ firstName, lastName, email, phone });
    setEditing(true);
  }

  function save() {
    onChange("firstName", draft.firstName.trim());
    onChange("lastName", draft.lastName.trim());
    onChange("email", draft.email.trim());
    onChange("phone", draft.phone.trim());
    setEditing(false);
  }

  function cancel() {
    setDraft({ firstName, lastName, email, phone });
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
            {(firstName?.[0] || "") + (lastName?.[0] || "")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-dark truncate">{firstName} {lastName}</p>
            <p className="text-xs text-text-light truncate">{email} {phone && <span className="text-text-light/60">·</span>} {phone}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={startEdit}
          className="text-xs text-primary hover:text-primary-dark font-semibold shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
        >
          Edit
        </button>
      </div>
    );
  }

  const emailValid = !draft.email || VALIDATORS.email(draft.email);
  const canSave = draft.firstName.trim() && draft.lastName.trim() && emailValid;

  return (
    <div className="bg-white border-2 border-primary/30 rounded-xl mb-6 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-dark">Edit your contact details</p>
        <button type="button" onClick={cancel} className="text-xs text-text-light hover:text-dark">
          Cancel
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-light mb-1">First Name</label>
          <input type="text" value={draft.firstName}
            onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
            className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-light mb-1">Last Name</label>
          <input type="text" value={draft.lastName}
            onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
            className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-light mb-1">Email Address</label>
          <input type="email" value={draft.email}
            onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            className={!emailValid ? inputErrCls : inputCls} />
          {!emailValid && <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-text-light mb-1">Phone Number</label>
          <input type="tel" value={draft.phone}
            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            className={inputCls} />
        </div>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={!canSave}
        className="mt-4 w-full sm:w-auto bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
      >
        Save changes
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SignUpDetailsContent({ freephone }: { freephone?: string }) {
  const brand = useBrand();
  const phone = freephone || brand.freephone;
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const paymentParam = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus | null>(null);
  const [stripePaymentComplete, setStripePaymentComplete] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [pageError, setPageError] = useState("");

  const isLtd = formData.businessStructure === "Limited Company";
  const isCIS = formData.businessStructure === "CIS";
  const isFirstMonthFree = formData.signUpIncentive === "1st month free";
  const monthlyFee = parseFloat(formData.expectedFee || "0");
  // 50% off first 3 months is a Limited Company offer only.
  // Sole traders / others pay the full monthly fee upfront at step 4.
  const chargeAmount = monthlyFee > 0
    ? parseFloat((isLtd ? monthlyFee * 0.5 : monthlyFee).toFixed(2))
    : 0;
  // VAT is added by Stripe automatic_tax based on customer's UK billing address.
  // We surface the gross figure in the UI so the Pay button matches what Stripe debits.
  const VAT_RATE = 0.20;
  const vatAmount = parseFloat((chargeAmount * VAT_RATE).toFixed(2));
  const chargeAmountInclVat = parseFloat((chargeAmount + vatAmount).toFixed(2));

  // ── Load form data ─────────────────────────────────────────────────────────

  const loadFormData = useCallback(async () => {
    if (!token) { setIsInvalid(true); setIsLoading(false); return; }
    try {
      const res = await fetch(`/api/signup?t=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) { setIsInvalid(true); setIsLoading(false); return; }
      if (data.isExpired) { setIsExpired(true); setIsLoading(false); return; }
      if (data.isCompleted) { setIsCompleted(true); setIsLoading(false); return; }
      setFormData((prev) => ({
        ...prev, ...Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v ?? prev[k as keyof FormData]])
        ),
        mailingCountry: data.mailingCountry || "United Kingdom",
      }));
    } catch {
      setIsInvalid(true);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { loadFormData(); }, [loadFormData]);

  // When the signup is complete, fetch the post-conversion status so we can
  // render the rich completion screen (assigned accountant + payment summary).
  // Polled briefly after submit because the Salesforce queueable runs async,
  // so the Account/Owner may not exist for the first few seconds.
  useEffect(() => {
    if (!isCompleted || !token) return;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8; // ~24s total at 3s intervals — enough for the conversion queueable to land
    async function poll() {
      try {
        const res = await fetch(`/api/signup/conversion-status?t=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error('non-ok');
        const data: ConversionStatus = await res.json();
        if (cancelled) return;
        setConversionStatus(data);
        // Keep polling until the accountant info is filled in (Account.OwnerId resolved)
        if (!data.accountant?.name && attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 3000);
        }
      } catch {
        if (cancelled) return;
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 3000);
        }
      }
    }
    poll();
    return () => { cancelled = true; };
  }, [isCompleted, token]);

  // Re-capture UTMs from URL in case sessionStorage was cleared (e.g. after Stripe redirect)
  useEffect(() => {
    captureUTMParams();
    trackEvent("signup_stage2_view", {
      step: 1,
      ...getStoredUTMParams(),
    });
  }, []);

  // Auto-fill director name with user's own name (Ltd Co only).
  // Runs whenever first/last name change AND director field is still empty —
  // so a manually edited director name is never clobbered.
  useEffect(() => {
    if (!isLtd) return;
    if (formData.firstName && !formData.directorFirstName) {
      setFormData((d) => ({ ...d, directorFirstName: formData.firstName }));
    }
    if (formData.lastName && !formData.directorLastName) {
      setFormData((d) => ({ ...d, directorLastName: formData.lastName }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLtd, formData.firstName, formData.lastName]);

  // Abandonment tracking — fire when user leaves mid-flow
  useEffect(() => {
    function handleUnload() {
      if (step < 5 && !isCompleted) {
        // Use sendBeacon so it fires even as the page closes
        const payload = JSON.stringify({
          event: "signup_abandoned",
          step_abandoned: step,
          business_type: formData.businessStructure,
          sector: formData.sector,
          ...getStoredUTMParams(),
        });
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics/abandon", payload);
        }
        trackEvent("signup_abandoned", {
          step_abandoned: step,
          business_type: formData.businessStructure,
          sector: formData.sector,
        });
      }
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isCompleted, formData.businessStructure, formData.sector]);

  // Defensive: if the bypass flag is on but the user lands on step 4 anyway
  // (e.g. a stale Stripe redirect URL from before the flag flipped), skip
  // them straight to the review step rather than show an empty payment screen.
  useEffect(() => {
    if (BYPASS_SIGNUP_PAYMENT && step === 4) setStep(5);
  }, [step]);

  // ── Handle Stripe return ───────────────────────────────────────────────────

  useEffect(() => {
    if (paymentParam === "cancelled") {
      setStripeError("Payment was cancelled. Please try again when you're ready.");
      setStep(4); setIsLoading(false);
    } else if (paymentParam === "success" && sessionId && token) {
      fetch(`/api/signup/stripe/status?t=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.status === "complete") {
            setStripePaymentComplete(true);
            setFormData((prev) => ({ ...prev, stripePaymentIntentId: d.paymentIntentId ?? "" }));
            trackEvent("signup_payment_complete", {
              amount_gbp: chargeAmount,
              business_type: formData.businessStructure,
              sector: formData.sector,
              ...getStoredUTMParams(),
            });
            setStep(5);
          } else {
            setStripeError("Payment could not be verified. Please try again or contact us.");
            setStep(4);
          }
        })
        .catch(() => { setStripeError("Could not verify payment. Please contact us."); setStep(4); })
        .finally(() => setIsLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Field helpers ──────────────────────────────────────────────────────────

  function set(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  function err(field: keyof FormData) { return fieldErrors[field]; }

  // ── Save progress ──────────────────────────────────────────────────────────

  async function saveProgress() {
    setIsSaving(true);
    try {
      await fetch(`/api/signup/save?t=${encodeURIComponent(token)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } finally { setIsSaving(false); }
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateStep(s: number): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};
    // Step 1 — Business basics + switching
    if (s === 1) {
      if (!formData.company.trim()) errors.company = "Please enter your business name";
      if (!formData.sector.trim()) errors.sector = "Please select your business sector";
      if (!formData.describeTheBusiness.trim()) errors.describeTheBusiness = "Please describe your business";
      if (isLtd && !formData.newCompany && !formData.companyNumber.trim()) {
        errors.companyNumber = "Enter your company number";
      }
      if (formData.transferringFromAccountant && !formData.priorAccountantDetails.trim()) {
        errors.priorAccountantDetails = "Please provide your previous accountant details";
      }
    }
    // Step 2 — Identity
    if (s === 2) {
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required";
      } else if (!VALIDATORS.dob(formData.dateOfBirth)) {
        errors.dateOfBirth = "Enter a valid date of birth (must be 18 or over)";
      }
      if (!formData.nationality) errors.nationality = "Please select your nationality";
      if (isLtd) {
        if (!formData.directorFirstName.trim()) errors.directorFirstName = "Director first name is required";
        if (!formData.directorLastName.trim()) errors.directorLastName = "Director last name is required";
      }
    }
    // Step 3 — Addresses
    if (s === 3) {
      if (!formData.ownerStreet.trim()) errors.ownerStreet = "Home street address is required";
      if (!formData.ownerCity.trim()) errors.ownerCity = "Home town/city is required";
      if (!formData.ownerPostalCode.trim()) errors.ownerPostalCode = "Home postcode is required";
      if (isLtd && formData.registeredOfficeAddress === null) {
        errors.registeredOfficeAddress = "Please choose your registered office option" as never;
      }
      // Business address only required when user opts to use their own (Ltd) or always (sole trader)
      const needsBusinessAddress = !isLtd || formData.registeredOfficeAddress === false;
      if (needsBusinessAddress) {
        if (!formData.mailingStreet.trim()) errors.mailingStreet = "Business street address is required";
        if (!formData.mailingCity.trim()) errors.mailingCity = "Business town/city is required";
        if (!formData.mailingPostalCode.trim()) errors.mailingPostalCode = "Business postcode is required";
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) window.scrollTo({ top: 0, behavior: "smooth" });
    return Object.keys(errors).length === 0;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async function handleNext() {
    if (!validateStep(step)) return;
    await saveProgress();
    trackEvent("signup_step_complete", {
      step_completed: step,
      business_type: formData.businessStructure,
      sector: formData.sector,
      is_new_company: formData.newCompany,
      transferring: formData.transferringFromAccountant,
      ...getStoredUTMParams(),
    });
    // Skip step 4 (Payment) when the bypass flag is on — jump 3 → 5 and back 5 → 3.
    setStep((s) => (BYPASS_SIGNUP_PAYMENT && s === 3 ? 5 : s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep((s) => (BYPASS_SIGNUP_PAYMENT && s === 5 ? 3 : s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  // ── Stripe ─────────────────────────────────────────────────────────────────

  async function handlePayNow() {
    setStripeError("");
    trackEvent("signup_payment_initiated", {
      amount_gbp: chargeAmount,
      monthly_fee: monthlyFee,
      business_type: formData.businessStructure,
      sector: formData.sector,
      ...getStoredUTMParams(),
    });
    try {
      const res = await fetch(`/api/signup/stripe/checkout?t=${encodeURIComponent(token)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountGbp: chargeAmount }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) { setStripeError(data.error || "Could not start payment. Please try again."); return; }
      window.location.href = data.url;
    } catch { setStripeError("A network error occurred. Please try again."); }
  }

  // ── Final submit ───────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!formData.termsAccepted) { setPageError("Please accept the Terms and Conditions to continue."); return; }
    setIsSubmitting(true); setPageError("");
    try {
      // Derive the sign-up incentive from the business type if it isn't already
      // set on the Lead. The front-end charges Limited Companies half-price via
      // Stripe (see chargeAmount), but without persisting "3 month 50% discount"
      // to Lead.Sign_up_incentive__c, the post-signup conversion status reports
      // the full monthly fee on the "Welcome aboard" page instead of what the
      // user actually paid.
      const derivedIncentive = formData.signUpIncentive
        || (isLtd ? "3 month 50% discount" : "");
      // `paymentBypassed: true` tells LeadSignupService.validateSubmission to skip its
      // stripePaymentIntentId requirement when the front-end has hidden the payment step.
      const submitBody = {
        ...formData,
        signUpIncentive: derivedIncentive,
        paymentBypassed: BYPASS_SIGNUP_PAYMENT,
      };
      const res = await fetch(`/api/signup/submit?t=${encodeURIComponent(token)}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitBody),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setPageError(data.error || data.message || "Submission failed. Please try again."); return; }
      trackEvent("signup_complete", {
        business_type: formData.businessStructure,
        sector: formData.sector,
        monthly_fee: monthlyFee,
        is_new_company: formData.newCompany,
        transferring: formData.transferringFromAccountant,
        first_month_free: isFirstMonthFree,
        ...getStoredUTMParams(),
      });
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { setPageError("A network error occurred. Please try again."); }
    finally { setIsSubmitting(false); }
  }

  // ── Render states ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-text-light text-sm">Loading your details…</p>
      </div>
    );
  }

  if (isInvalid) {
    return (
      <PageShell>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Invalid Sign-Up Link</h2>
          <p className="text-text-light mb-6">This link doesn&apos;t appear to be valid. If you received it by email, please check you copied it correctly.</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Contact Us <ArrowRight size={16} />
          </a>
        </div>
      </PageShell>
    );
  }

  if (isExpired) {
    return (
      <PageShell>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Link Expired</h2>
          <p className="text-text-light mb-6">This sign-up link has expired (they&apos;re valid for 7 days). Please contact us and we&apos;ll send you a fresh one.</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Get a New Link <ArrowRight size={16} />
          </a>
        </div>
      </PageShell>
    );
  }

  if (isCompleted) {
    const cs = conversionStatus;
    const firstName = cs?.firstName || formData.firstName;
    const company = cs?.company || formData.company;
    const email = cs?.email || formData.email;
    const accountant = cs?.accountant;
    const hasAccountant = !!accountant?.name;
    const paid = cs?.totalGross != null && cs.totalGross > 0;
    // Treat company as redundant when it equals the person's name (the
    // sole-trader pattern: Lead.Company is auto-populated with firstName lastName
    // because the field is required on the standard Lead object).
    const personFullName = `${firstName || ''} ${cs?.lastName || formData.lastName || ''}`.trim();
    const showCompanyInHeader = !!company && company.trim().toLowerCase() !== personFullName.toLowerCase();
    // Salesforce returns a default avatar URL even when no photo is uploaded
    // (path ends in /profilephoto/005/F or 005/T with no content ID). Detect
    // those defaults and fall back to the gradient + initials block.
    const hasRealPhoto = !!accountant?.photoUrl
      && !/\/profilephoto\/005\/[FT](?:[?#]|$)/i.test(accountant.photoUrl);
    const fmtMoney = (n?: number) => n != null ? `£${n.toFixed(2)}` : '—';
    const fmtDate = (s?: string) => {
      if (!s) return '—';
      try {
        return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch { return s; }
    };
    const isHalfPriceDiscount = cs?.signUpIncentive === '3 month 50% discount';

    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-10 md:py-16 pb-24">
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          {/* ── Header ── */}
          <div className="text-center mb-2">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 size={44} className="text-success" strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-dark tracking-tight mb-3">
              Welcome aboard, {firstName}!
            </h1>
            <p className="text-text-light text-lg max-w-xl mx-auto leading-relaxed">
              {showCompanyInHeader
                ? <>Your sign-up for <strong className="text-dark">{company}</strong> is confirmed. Here&apos;s what happens next.</>
                : <>Your sign-up is confirmed. Here&apos;s what happens next.</>
              }
            </p>
            {email && (
              <p className="text-sm text-text-light mt-3 inline-flex items-center gap-1.5">
                <Mail size={14} className="text-primary" />
                Confirmation sent to <strong className="text-dark">{email}</strong>
              </p>
            )}
          </div>

          {/* ── Top row: Accountant + Payment ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Dedicated accountant card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                {hasAccountant && accountant?.firstName
                  ? `Meet ${accountant.firstName}`
                  : 'Your Dedicated Team'}
              </p>
              {hasAccountant ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    {hasRealPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={accountant!.photoUrl}
                        alt={accountant!.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/15"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {accountant?.initials || accountant?.name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-dark truncate">{accountant?.name}</p>
                      <p className="text-sm text-primary font-semibold truncate">{accountant?.title || 'Your Dedicated Accountant'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {accountant?.phone && (
                      <a href={`tel:${accountant.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-text hover:text-primary transition-colors">
                        <Phone size={15} className="text-primary shrink-0" />
                        {accountant.phone}
                      </a>
                    )}
                    {accountant?.email && (
                      <a href={`mailto:${accountant.email}`} className="flex items-center gap-2 text-text hover:text-primary transition-colors break-all">
                        <Mail size={15} className="text-primary shrink-0" />
                        {accountant.email}
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-text-light mt-4 pt-4 border-t border-gray-100">
                    {accountant?.firstName || 'Your accountant'} will call you within 24 hours.
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-3 text-sm text-text-light py-2">
                  <Loader2 size={16} className="animate-spin text-primary shrink-0" />
                  Matching you with the right accountant…
                </div>
              )}
            </div>

            {/* Payment summary card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Today&apos;s Payment</p>
              {paid ? (
                <>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-text-light">Subtotal</span>
                      <span className="text-text font-medium">{fmtMoney(cs?.subtotalNet)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">VAT (20%)</span>
                      <span className="text-text font-medium">{fmtMoney(cs?.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="font-bold text-dark">Paid today</span>
                      <span className="font-bold text-primary text-lg">{fmtMoney(cs?.totalGross)}</span>
                    </div>
                  </div>
                  {isHalfPriceDiscount && cs?.fullMonthlyFee != null && (
                    <div className="bg-primary/5 rounded-xl p-3 text-xs text-text-light">
                      <p className="flex items-center gap-1.5 font-semibold text-dark mb-0.5">
                        <Calendar size={13} className="text-primary" />
                        Full price kicks in {fmtDate(cs?.nextChargeDate)}
                      </p>
                      <p>Then £{cs.fullMonthlyFee.toFixed(2)}/mo + VAT (£{(cs.fullMonthlyFee * 1.2).toFixed(2)} gross)</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-text-light">Your subscription is set up.</p>
                  {cs?.fullMonthlyFee != null && (
                    <p className="text-text">
                      Monthly fee: <strong>£{cs.fullMonthlyFee.toFixed(2)}/mo + VAT</strong>
                    </p>
                  )}
                  <p className="text-xs text-text-light pt-2">First charge {fmtDate(cs?.nextChargeDate)}</p>
                </div>
              )}
            </div>

          </div>

          {/* ── Onboarding timeline ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Your Onboarding</p>
              <p className="text-xs text-text-light">Next 48 hours</p>
            </div>
            <ol className="space-y-4">
              <TimelineStep
                icon={<Mail size={16} />}
                done
                title={`Confirmation email sent${email ? ` to ${email}` : ''}`}
                when="Just now"
              />
              <TimelineStep
                icon={<ClipboardList size={16} />}
                done={false}
                title="Letter of engagement to sign"
                when="In your inbox within 10 minutes"
              />
              <TimelineStep
                icon={<Phone size={16} />}
                done={false}
                title={hasAccountant
                  ? `Welcome call from ${accountant?.firstName || accountant?.name}`
                  : 'Welcome call from your accountant'}
                when="Within 24 hours"
              />
              <TimelineStep
                icon={<Building2 size={16} />}
                done={false}
                title="FreeAgent accounting software set up"
                when="Login emailed by tomorrow"
              />
              <TimelineStep
                icon={<ShieldCheck size={16} />}
                done={false}
                title="ID & AML check (HMRC requirement)"
                when="Quick link emailed today"
              />
            </ol>
          </div>

          {/* ── Trust + perks ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Refer-a-friend */}
            <a href="/refer-a-friend" className="group bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
              <Gift size={24} className="mb-3 opacity-90" />
              <p className="font-bold text-base mb-1">Earn £250 per referral</p>
              <p className="text-sm text-white/85 mb-3">Know a friend who needs a great accountant? Refer them and you both win.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                Refer a friend <ArrowRight size={14} />
              </span>
            </a>

            {/* Trustpilot */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 font-bold text-dark">4.7</span>
              </div>
              <p className="text-sm text-text mb-1">Rated <strong>Excellent</strong> on Trustpilot</p>
              <p className="text-xs text-text-light mb-auto">By 700+ UK businesses just like yours.</p>
              <a href="https://uk.trustpilot.com/review/cleveraccounts.co.uk" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:text-primary-dark mt-3 inline-flex items-center gap-1">
                Leave a quick review <ArrowRight size={12} />
              </a>
            </div>

            {/* Accreditations */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Award size={20} className="text-primary mb-2" />
              <p className="font-bold text-dark text-sm mb-2">FCSA accredited</p>
              <p className="text-xs text-text-light leading-relaxed">
                Regulated and audited annually. Your accounts are in safe, compliant hands.
              </p>
            </div>

          </div>

          {/* ── Help footer ── */}
          <div className="text-center pt-4">
            <p className="text-sm text-text-light">
              Questions before your accountant calls?{' '}
              <a href="/contact" className="text-primary font-semibold hover:underline">Chat to us</a>
              {' or call '}
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-primary font-semibold hover:underline whitespace-nowrap">{phone}</a>
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ── Validation error banner ────────────────────────────────────────────────

  const hasErrors = Object.keys(fieldErrors).length > 0;

  // ─── Main form ─────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 md:py-12 pb-32">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left column — sticky reassurance panel (desktop only) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Step header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step {BYPASS_SIGNUP_PAYMENT && step > 4 ? step - 1 : step} of {STEPS.length} · ~{STEPS[(BYPASS_SIGNUP_PAYMENT && step > 4 ? step - 1 : step) - 1]?.time}</p>
                </div>
                <h1 className="text-3xl xl:text-4xl font-black text-dark tracking-tight leading-[1.1]">
                  {step === 1 && <>Welcome, <span className="text-primary">{formData.firstName}</span></>}
                  {step === 2 && "Verify your identity"}
                  {step === 3 && "Where should we reach you?"}
                  {step === 4 && "Secure your account"}
                  {step === 5 && <>Almost done — <span className="text-primary">review & confirm</span></>}
                </h1>
                <p className="text-text-light mt-3 text-base leading-relaxed">
                  {step === 1 && "A few quick things about your business so we can match you with the right accountant."}
                  {step === 2 && "HMRC requires us to verify who you are before we can act on your behalf. Takes about 60 seconds."}
                  {step === 3 && "These addresses are used for HMRC correspondence and your statutory filings."}
                  {step === 4 && (isLtd
                    ? "50% off your first 3 months. Secure your account with a small upfront payment."
                    : "Secure your account with your first month's fee — fully refundable.")}
                  {step === 5 && "A quick check that everything looks right, then we'll get you onboarded."}
                </p>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-dark">4.7</span>
                  <span className="text-xs text-text-light">on Trustpilot</span>
                </div>
                <div className="text-xs text-text-light leading-relaxed">
                  <strong className="text-dark">10,000+</strong> UK businesses · <strong className="text-dark">FCSA</strong> accredited · <strong className="text-dark">FreeAgent</strong> Platinum Partner
                </div>
                <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                  {["No setup fees", "Cancel anytime", "Free FreeAgent software", "Dedicated UK accountant"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-text">
                      <Check size={12} className="text-success shrink-0" strokeWidth={3} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help — quiet supporting nudge */}
              <div className="text-xs text-text-light text-center leading-relaxed">
                Stuck on something?{" "}
                <a href="/contact" className="text-primary font-semibold hover:underline">Chat to us</a>
                {" or call "}
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-primary font-semibold hover:underline whitespace-nowrap">{phone}</a>
              </div>
            </div>
          </aside>

          {/* Right column — form */}
          <main className="lg:col-span-8">

            {/* Mobile-only header (collapsed onto same column) */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Step {BYPASS_SIGNUP_PAYMENT && step > 4 ? step - 1 : step} of {STEPS.length} · ~{STEPS[(BYPASS_SIGNUP_PAYMENT && step > 4 ? step - 1 : step) - 1]?.time}</p>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-dark tracking-tight leading-[1.1]">
                {step === 1 && <>Welcome, <span className="text-primary">{formData.firstName}</span></>}
                {step === 2 && "Verify your identity"}
                {step === 3 && "Where should we reach you?"}
                {step === 4 && "Secure your account"}
                {step === 5 && <>Almost done — <span className="text-primary">review</span></>}
              </h1>
              <p className="text-text-light mt-2 text-sm max-w-md mx-auto leading-relaxed">
                {step === 1 && "A few quick things about your business."}
                {step === 2 && "HMRC requires us to verify who you are. Takes about 60 seconds."}
                {step === 3 && "Used for HMRC correspondence and your statutory filings."}
                {step === 4 && (isLtd ? "50% off your first 3 months." : "Your first month upfront — fully refundable.")}
                {step === 5 && "Quick check that everything looks right."}
              </p>
            </div>

        {/* Card — lighter chrome, more breathing room */}
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-10">
            <StepIndicator current={step} />

            {/* Validation error banner */}
            {hasErrors && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-sm text-red-700">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Please fix the following before continuing:</p>
                  <ul className="mt-1 space-y-0.5 list-disc pl-4">
                    {Object.values(fieldErrors).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* Persistent contact strip — visible on all editable steps */}
            {step < 4 && (
              <ContactStrip
                firstName={formData.firstName}
                lastName={formData.lastName}
                email={formData.email}
                phone={formData.phone}
                onChange={(field, value) => set(field, value)}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 1 — ABOUT YOUR BUSINESS
            ═══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-5">

                {/* Business / Company */}
                <SectionCard icon={<Building2 size={18} />} title={isLtd ? "Your Company" : "Your Business"}
                  description={isLtd ? "The basics so we can set up your accounting." : "Quick details so we can match you with the right accountant."}>

                  {isLtd && (
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.newCompany ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}>
                      <input type="checkbox" checked={formData.newCompany}
                        onChange={(e) => set("newCompany", e.target.checked)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.newCompany ? "bg-primary border-primary" : "border-gray-300 bg-white"}`}>
                        {formData.newCompany && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">I need to form a new limited company</p>
                        <p className="text-xs text-text-light mt-0.5">Tick this if you haven&apos;t registered your company yet — we&apos;ll handle the formation.</p>
                      </div>
                    </label>
                  )}

                  <FieldWrapper
                    label={isLtd ? (formData.newCompany ? "Preferred Company Name" : "Registered Company Name") : "Business / Trading Name"}
                    required
                    hint={isLtd
                      ? formData.newCompany
                        ? "Your preferred name — we'll check availability and register it for you."
                        : "Exactly as it appears on Companies House."
                      : "The name you trade under — or your own name if you don't have a separate business name."}
                    error={err("company")}
                    validState={validateField(formData.company, "required")}
                  >
                    <input type="text" value={formData.company}
                      onChange={(e) => set("company", e.target.value)}
                      className={err("company") ? inputErrCls : inputCls}
                      placeholder={isLtd ? (formData.newCompany ? "e.g. Acme Consulting" : "e.g. Acme Consulting Ltd") : "e.g. John Smith Plumbing"} />
                  </FieldWrapper>

                  {isLtd && !formData.newCompany && (
                    <FieldWrapper label="Companies House Number" required
                      hint="Your 8-digit company registration number from Companies House."
                      error={err("companyNumber")}
                      tip="Find your company number at beta.companieshouse.gov.uk — it's an 8-digit number like 12345678."
                      validState={validateField(formData.companyNumber, "companyNumber")}>
                      <input type="text" value={formData.companyNumber}
                        onChange={(e) => set("companyNumber", e.target.value)}
                        className={err("companyNumber") ? inputErrCls : inputCls}
                        placeholder="e.g. 12345678" maxLength={8} />
                    </FieldWrapper>
                  )}

                  <SectorSearch
                    value={formData.sector}
                    onChange={(v) => set("sector", v)}
                    error={err("sector")}
                  />

                  <FieldWrapper label={`Briefly Describe ${isLtd ? "the Company" : "the Business"}`} required
                    hint="A short description helps us assign the right accountant and tailor our service to you."
                    error={err("describeTheBusiness")}
                    validState={validateField(formData.describeTheBusiness, "longText")}>
                    <textarea rows={3} value={formData.describeTheBusiness}
                      onChange={(e) => set("describeTheBusiness", e.target.value)}
                      className={`${err("describeTheBusiness") ? inputErrCls : inputCls} resize-none`}
                      placeholder="e.g. IT contractor providing software development services to financial sector clients" />
                  </FieldWrapper>
                </SectionCard>

                {/* Transferring accountant — collapsed by default to keep step 1 light */}
                <OptionalSection
                  label="I'm switching from another accountant"
                  sublabel="we'll handle the handover"
                  icon={<ArrowRight size={14} />}
                  defaultOpen={formData.transferringFromAccountant}
                >
                  <div className="space-y-4">
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.transferringFromAccountant ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}>
                      <input type="checkbox" checked={formData.transferringFromAccountant}
                        onChange={(e) => set("transferringFromAccountant", e.target.checked)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.transferringFromAccountant ? "bg-primary border-primary" : "border-gray-300 bg-white"}`}>
                        {formData.transferringFromAccountant && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">Yes, transfer me from my current accountant</p>
                        <p className="text-xs text-text-light mt-0.5">We&apos;ll contact them to obtain your records and arrange a smooth handover.</p>
                      </div>
                    </label>

                    {formData.transferringFromAccountant && (
                      <>
                        <FieldWrapper label="Previous Accountant — Name & Contact Details" required
                          hint="Firm name, email address or phone number so we can contact them."
                          error={err("priorAccountantDetails")}
                          validState={validateField(formData.priorAccountantDetails, "required")}>
                          <textarea rows={2} value={formData.priorAccountantDetails}
                            onChange={(e) => set("priorAccountantDetails", e.target.value)}
                            className={`${err("priorAccountantDetails") ? inputErrCls : inputCls} resize-none`}
                            placeholder="e.g. Smith & Co Accountants — john@smithco.co.uk" />
                        </FieldWrapper>
                        <FieldWrapper label="Reason for Leaving (optional)"
                          hint="Helps us understand any issues — completely optional.">
                          <textarea rows={2} value={formData.whyLookingToChange}
                            onChange={(e) => set("whyLookingToChange", e.target.value)}
                            className={`${inputCls} resize-none`}
                            placeholder="e.g. Looking for more proactive advice and better communication" />
                        </FieldWrapper>
                      </>
                    )}
                  </div>
                </OptionalSection>

                <NextUpHint title="Next: Verify your identity" desc="Quick HMRC checks — DoB, nationality, and your NI/UTR if you have one." icon={<ShieldCheck size={14} />} />
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 2 — IDENTITY (HMRC verification)
            ═══════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-5">

                {/* Required identity — info banner now nested inside for tighter visual hierarchy */}
                <SectionCard icon={<ShieldCheck size={18} />} title="Identity Check"
                  description="Required — we are required to perform identification checks.">

                  <InfoBox icon={<ShieldCheck size={16} />} colour="blue">
                    <p className="font-semibold mb-0.5">Held securely, never shared</p>
                    <p>This information is encrypted and <strong>never shared with third parties</strong> outside of the systems required to perform these identity checks.</p>
                  </InfoBox>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldWrapper label="Date of Birth" required
                      hint="Used by HMRC to confirm your identity."
                      error={err("dateOfBirth")}
                      validState={validateField(formData.dateOfBirth, "dob")}>
                      <input type="date" value={formData.dateOfBirth}
                        onChange={(e) => set("dateOfBirth", e.target.value)}
                        min="1900-01-01"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().slice(0, 10)}
                        className={err("dateOfBirth") ? inputErrCls : inputCls} />
                    </FieldWrapper>

                    <FieldWrapper label="Nationality" required error={err("nationality")}
                      validState={validateField(formData.nationality, "required")}>
                      <div className="relative">
                        <select value={formData.nationality} onChange={(e) => set("nationality", e.target.value)}
                          className={`${err("nationality") ? inputErrCls : selectCls} appearance-none pr-10`}>
                          <option value="">Select nationality…</option>
                          {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                      </div>
                    </FieldWrapper>
                  </div>

                  {/* Ltd-only: Director details — flattened (was a nested card) */}
                  {isLtd && (
                    <div className="space-y-3 pt-4 mt-2 border-t border-gray-100">
                      <div>
                        <p className="text-[13px] font-semibold text-dark">Director on Record</p>
                        <p className="text-xs text-text-light mt-0.5">We&apos;ve pre-filled this with your name — change it if a different person is the primary director. Multiple directors? We&apos;ll collect the rest after onboarding.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldWrapper label="Director First Name" required error={err("directorFirstName")}
                          validState={validateField(formData.directorFirstName, "required")}>
                          <input type="text" value={formData.directorFirstName}
                            onChange={(e) => set("directorFirstName", e.target.value)}
                            className={err("directorFirstName") ? inputErrCls : inputCls}
                            placeholder={formData.firstName || "First name"} />
                        </FieldWrapper>
                        <FieldWrapper label="Director Last Name" required error={err("directorLastName")}
                          validState={validateField(formData.directorLastName, "required")}>
                          <input type="text" value={formData.directorLastName}
                            onChange={(e) => set("directorLastName", e.target.value)}
                            className={err("directorLastName") ? inputErrCls : inputCls}
                            placeholder={formData.lastName || "Last name"} />
                        </FieldWrapper>
                      </div>
                    </div>
                  )}
                </SectionCard>

                {/* Optional Tax References — collapsed by default to keep step 2 focused */}
                <OptionalSection
                  label="Add tax references now"
                  sublabel="optional · saves time later"
                  icon={<Info size={14} />}
                  defaultOpen={!!(formData.personalUtr || formData.nationalInsuranceNumber)}
                >
                  <p className="text-xs text-text-light leading-relaxed -mt-1 mb-1">
                    These speed things up but we can collect them later if you don&apos;t have them handy.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldWrapper label="Personal UTR Number"
                      hint="10-digit number from HMRC. Skip if you don't have one yet."
                      tip="Your Unique Taxpayer Reference (UTR) is a 10-digit number on any letter from HMRC or your self assessment return. Leave blank if you haven't registered for self assessment yet."
                      validState={validateField(formData.personalUtr, "utr")}>
                      <input type="text" value={formData.personalUtr}
                        onChange={(e) => set("personalUtr", e.target.value)}
                        className={inputCls} placeholder="e.g. 1234567890" maxLength={10} />
                    </FieldWrapper>
                    <FieldWrapper label="National Insurance Number"
                      hint="Format QQ123456C — found on a payslip or P60."
                      tip="Your NI number is in the format QQ123456C (2 letters, 6 digits, 1 letter). You'll find it on a payslip, P60, or any letter from HMRC or the Department for Work and Pensions."
                      validState={validateField(formData.nationalInsuranceNumber, "niNumber")}>
                      <input type="text" value={formData.nationalInsuranceNumber}
                        onChange={(e) => set("nationalInsuranceNumber", e.target.value.replace(/\s/g, "").toUpperCase())}
                        className={inputCls} placeholder="e.g. QQ123456C" maxLength={9} />
                    </FieldWrapper>
                  </div>
                </OptionalSection>

                <NextUpHint title="Next: Your addresses" desc={isLtd ? "Home address and your registered office choice." : "Home address and where your business operates from."} icon={<MapPin size={14} />} />
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 3 — ADDRESSES
            ═══════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-5">

                {/* Home address — always required */}
                <SectionCard icon={<MapPin size={18} />} title="Your Home Address"
                  description="Your personal residential address. We use this for HMRC correspondence about you personally.">
                  <AddressFields
                    prefix="Home"
                    streetField="ownerStreet" cityField="ownerCity" countyField="ownerCounty" postcodeField="ownerPostalCode"
                    streetVal={formData.ownerStreet} cityVal={formData.ownerCity}
                    countyVal={formData.ownerCounty} postcodeVal={formData.ownerPostalCode}
                    onStreet={(v) => set("ownerStreet", v)} onCity={(v) => set("ownerCity", v)}
                    onCounty={(v) => set("ownerCounty", v)} onPostcode={(v) => set("ownerPostalCode", v)}
                    streetError={err("ownerStreet")} cityError={err("ownerCity")} postcodeError={err("ownerPostalCode")}
                    onLookup={(s, c, co, pc) => { set("ownerStreet", s); set("ownerCity", c); set("ownerCounty", co); set("ownerPostalCode", pc); }}
                  />
                </SectionCard>

                {/* Registered office (Ltd only) — choice gates whether business address is required below */}
                {isLtd && (
                  <SectionCard icon={<Building2 size={18} />} title="Registered Office Address"
                    description="Every limited company needs an official address on the public Companies House register.">

                    <InfoBox icon={<Info size={16} />} colour="blue">
                      <p className="font-semibold mb-0.5">What is this?</p>
                      <p>This is the address HMRC and Companies House will use for official correspondence. <strong>It&apos;s public</strong> — anyone can search Companies House and see it. It doesn&apos;t have to be where you actually work.</p>
                    </InfoBox>

                    <div className="space-y-3">
                      {[
                        { val: "ours", label: `Use ${brandPossessive(brand)} registered office`, desc: "We provide our office as your registered address — keeps your home address off the public record. Recommended if you work from home.", recommended: true },
                        { val: "own", label: "Use my own address", desc: "Your business address will appear publicly on the Companies House register.", recommended: false },
                      ].map(({ val, label, desc, recommended }) => {
                        const selected = (val === "ours" && formData.registeredOfficeAddress === true) ||
                                         (val === "own" && formData.registeredOfficeAddress === false);
                        return (
                          <div key={val}
                            onClick={() => set("registeredOfficeAddress", val === "ours")}
                            className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selected ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-gray-300"
                            }`}>
                            {recommended && (
                              <span className="absolute -top-2 right-4 bg-success text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              selected ? "border-primary" : "border-gray-300"
                            }`}>
                              {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-dark">{label}</p>
                              <p className="text-xs text-text-light mt-0.5">{desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {err("registeredOfficeAddress") && (
                      <p className="text-xs text-red-500">{err("registeredOfficeAddress")}</p>
                    )}
                  </SectionCard>
                )}

                {/* Business address — only required if user opted to use their own (Ltd) or always (sole trader) */}
                {(!isLtd || formData.registeredOfficeAddress === false) && (
                  <SectionCard icon={<MapPin size={18} />} title={isLtd ? "Your Business Address" : "Business Address"}
                    description={isLtd
                      ? "This will be used as your registered office and appear publicly on Companies House."
                      : "Where your business operates. For sole traders this is often your home address."}>
                    {/* Quick-fill: copy personal address into business address */}
                    {(formData.ownerStreet || formData.ownerCity || formData.ownerPostalCode) && (
                      <button
                        type="button"
                        onClick={() => {
                          set("mailingStreet", formData.ownerStreet);
                          set("mailingCity", formData.ownerCity);
                          set("mailingState", formData.ownerCounty);
                          set("mailingPostalCode", formData.ownerPostalCode);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/12 border border-primary/20 px-3 py-1.5 rounded-lg transition-colors mb-3"
                      >
                        <MapPin size={13} />
                        Use my personal address
                      </button>
                    )}
                    <AddressFields
                      prefix="Business"
                      streetField="mailingStreet" cityField="mailingCity"
                      countyField="mailingState" postcodeField="mailingPostalCode"
                      streetVal={formData.mailingStreet} cityVal={formData.mailingCity}
                      countyVal={formData.mailingState} postcodeVal={formData.mailingPostalCode}
                      onStreet={(v) => set("mailingStreet", v)} onCity={(v) => set("mailingCity", v)}
                      onCounty={(v) => set("mailingState", v)} onPostcode={(v) => set("mailingPostalCode", v)}
                      streetError={err("mailingStreet")} cityError={err("mailingCity")} postcodeError={err("mailingPostalCode")}
                      onLookup={(s, c, co, pc) => { set("mailingStreet", s); set("mailingCity", c); set("mailingState", co); set("mailingPostalCode", pc); }}
                    />
                    <div className="pt-2">
                      <FieldWrapper label="Country">
                        <input type="text" value={formData.mailingCountry}
                          onChange={(e) => set("mailingCountry", e.target.value)}
                          className={`${inputCls} w-56`} />
                      </FieldWrapper>
                    </div>
                  </SectionCard>
                )}

                {/* When user chose "ours", show a confirmation card so they know nothing's missing */}
                {isLtd && formData.registeredOfficeAddress === true && (
                  <InfoBox icon={<CheckCircle2 size={16} />} colour="green">
                    <p className="font-semibold mb-0.5">All set</p>
                    <p>We&apos;ll use {brandPossessive(brand)} registered office for your company. We&apos;ll forward any HMRC or Companies House post to you the same day it arrives.</p>
                  </InfoBox>
                )}

                {BYPASS_SIGNUP_PAYMENT ? (
                  <NextUpHint
                    title="Next: Review & confirm"
                    desc="One last check, then we'll match you with your accountant — no payment needed today."
                    icon={<ClipboardList size={14} />}
                  />
                ) : (
                  <NextUpHint
                    title="Next: Secure your account"
                    desc={isLtd
                      ? "50% off your first 3 months — fully refundable, cancel anytime."
                      : "Your first month upfront — fully refundable, cancel anytime."}
                    icon={<CreditCard size={14} />}
                  />
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 4 — PAYMENT
            ═══════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-5">
                {isFirstMonthFree ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40} className="text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">First Month Free!</h3>
                    <p className="text-text-light mb-6 max-w-sm mx-auto">
                      No payment is needed today. Your monthly fee of <strong>£{monthlyFee.toFixed(2)}</strong> will begin from month two.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-text-light max-w-xs mx-auto">
                      From month 4 onwards: <strong className="text-dark">£{monthlyFee.toFixed(2)}/month</strong>
                    </div>
                  </div>
                ) : stripePaymentComplete ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40} className="text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Payment Received!</h3>
                    <p className="text-text-light">
                      <strong>£{chargeAmountInclVat.toFixed(2)}</strong> collected today (£{chargeAmount.toFixed(2)} + £{vatAmount.toFixed(2)} VAT){isLtd ? " — that's 50% off your first 3 months." : " — your first month upfront."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pricing breakdown */}
                    <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-6 border border-primary/10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-text-light">Your monthly fee</p>
                          <p className="text-2xl font-bold text-dark">£{monthlyFee.toFixed(2)}<span className="text-sm font-normal text-text-light">/month + VAT</span></p>
                        </div>
                        <div className="text-right">
                          {isLtd && <div className="inline-block bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full mb-1">50% OFF</div>}
                          <p className="text-sm text-text-light">{isLtd ? "First 3 months" : "First month"}</p>
                          <p className="text-2xl font-bold text-primary">£{chargeAmount.toFixed(2)}<span className="text-sm font-normal text-text-light"> + VAT</span></p>
                        </div>
                      </div>
                      {/* VAT-inclusive total — what Stripe will actually debit today */}
                      <div className="border-t border-primary/10 pt-3 mb-3 flex items-center justify-between text-sm">
                        <div className="text-text-light">
                          <p>Subtotal: £{chargeAmount.toFixed(2)}</p>
                          <p>VAT (20%): £{vatAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-light uppercase tracking-wider">Today&apos;s payment</p>
                          <p className="text-xl font-bold text-dark">£{chargeAmountInclVat.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="border-t border-primary/10 pt-4 space-y-2 text-sm">
                        {(isLtd
                          ? [
                              "50% discount on your first 3 months",
                              "Full price applies from month 4",
                              "This payment is refundable if you're not happy",
                              "Cancel anytime — no minimum contract",
                            ]
                          : [
                              "Your first month's fee, paid upfront",
                              "Standard monthly billing from month 2",
                              "This payment is refundable if you're not happy",
                              "Cancel anytime — no minimum contract",
                            ]
                        ).map((item) => (
                          <div key={item} className="flex items-center gap-2 text-text">
                            <CheckCircle2 size={14} className="text-success shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {stripeError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-sm text-red-700">
                        <AlertCircle size={18} className="shrink-0" />
                        {stripeError}
                      </div>
                    )}

                    <button type="button" onClick={handlePayNow}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <CreditCard size={20} />
                      Pay £{chargeAmountInclVat.toFixed(2)} Securely
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-text-light">
                      <ShieldCheck size={14} className="text-success" />
                      Secure checkout powered by Stripe — your card details are never stored by us
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 5 — REVIEW & CONFIRM
            ═══════════════════════════════════════════════════════════════ */}
            {step === 5 && (
              <div className="space-y-6">

                {/* ── Summary grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SummaryCard title="Contact Details" colour="blue">
                    <SummaryRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                    <SummaryRow label="Email" value={formData.email} />
                    <SummaryRow label="Phone" value={formData.phone} />
                  </SummaryCard>

                  <SummaryCard title="Business" colour="purple">
                    <SummaryRow label="Type" value={formData.businessStructure} />
                    <SummaryRow label={isLtd ? "Company Name" : "Business Name"} value={formData.company} />
                    {isLtd && !formData.newCompany && formData.companyNumber && <SummaryRow label="Company No." value={formData.companyNumber} />}
                    {isLtd && formData.newCompany && <SummaryRow label="Formation" value={`To be formed by ${brand.name}`} />}
                    {formData.tradingStartDate && <SummaryRow label="Trading Since" value={formData.tradingStartDate} />}
                  </SummaryCard>

                  <SummaryCard title="Personal" colour="green">
                    <SummaryRow label="Date of Birth" value={formatDobUK(formData.dateOfBirth)} />
                    <SummaryRow label="Nationality" value={formData.nationality} />
                    {formData.nationalInsuranceNumber && <SummaryRow label="NI Number" value={formData.nationalInsuranceNumber} />}
                    <SummaryRow label="Home Address" value={[formData.ownerStreet, formData.ownerCity, formData.ownerPostalCode].filter(Boolean).join(", ")} />
                  </SummaryCard>

                  <SummaryCard title="Addresses" colour="amber">
                    {isLtd && formData.registeredOfficeAddress === true && (
                      <SummaryRow label="Registered Office" value={`${brand.name} (provided by us)`} />
                    )}
                    {(!isLtd || formData.registeredOfficeAddress === false) && (
                      <SummaryRow label={isLtd ? "Registered Office" : "Business Address"}
                        value={[formData.mailingStreet, formData.mailingCity, formData.mailingPostalCode].filter(Boolean).join(", ")} />
                    )}
                  </SummaryCard>
                </div>

                {/* ── Pricing summary ── */}
                <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50 p-5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Your Pricing Summary</p>
                  <div className="space-y-2">
                    {BYPASS_SIGNUP_PAYMENT ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-text">Today</span>
                          <span className="font-bold text-success">No upfront payment</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-primary/10 pt-2">
                          <span className="text-sm text-text">Monthly fee</span>
                          <span className="font-semibold text-dark">£{monthlyFee.toFixed(2)}/month + VAT</span>
                        </div>
                      </>
                    ) : isFirstMonthFree ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text">First month</span>
                        <span className="font-bold text-success">FREE</span>
                      </div>
                    ) : isLtd ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text">Months 1–3 <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 ml-1">50% OFF</span></span>
                        <span className="font-bold text-primary">£{chargeAmount.toFixed(2)}/month + VAT</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text">First month (paid upfront)</span>
                        <span className="font-bold text-primary">£{chargeAmount.toFixed(2)} + VAT</span>
                      </div>
                    )}
                    {!BYPASS_SIGNUP_PAYMENT && (
                      <div className="flex justify-between items-center border-t border-primary/10 pt-2">
                        <span className="text-sm text-text">{isLtd ? "From month 4 onwards" : "From month 2 onwards"}</span>
                        <span className="font-semibold text-dark">£{monthlyFee.toFixed(2)}/month + VAT</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-text-light mt-3">
                    {BYPASS_SIGNUP_PAYMENT
                      ? "Nothing to pay today — your accountant will arrange standard monthly billing as part of your onboarding. All fees are exclusive of VAT at 20%. No setup fees. Cancel anytime."
                      : "All fees are exclusive of VAT at 20%. No setup fees. Cancel anytime."}
                  </p>
                </div>

                {/* ── What happens next ── */}
                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="bg-dark px-6 py-4">
                    <h3 className="text-white font-bold text-lg">What happens next?</h3>
                    <p className="text-gray-300 text-sm mt-0.5">Here&apos;s exactly what to expect after you click submit</p>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      {
                        day: "Immediately",
                        title: "Welcome email & confirmation",
                        desc: `You'll receive a confirmation email with everything you need to know about getting started with ${brand.name}.`,
                        icon: "📧",
                      },
                      {
                        day: "Within 24 hours",
                        title: "Meet your dedicated accountant",
                        desc: "An experienced accountant will be personally assigned to your account. They'll call to introduce themselves, walk through your VAT, PAYE and trading setup, and answer any questions.",
                        icon: "🤝",
                      },
                      {
                        day: "Within 24 hours",
                        title: "Letter of engagement",
                        desc: "We'll send a digital letter of engagement for you to sign. This formally authorises us to act as your accountant with HMRC.",
                        icon: "✍️",
                      },
                      {
                        day: "Day 1–2",
                        title: "FreeAgent software setup",
                        desc: "We'll set up your FreeAgent accounting software account and send you login details. Your accountant will walk you through how to use it.",
                        icon: "💻",
                      },
                      ...(formData.transferringFromAccountant ? [{
                        day: "Day 3–5",
                        title: "Handover from previous accountant",
                        desc: "We'll contact your previous accountant to request all records, outstanding returns, and any documents we need to take over seamlessly.",
                        icon: "🔄",
                      }] : []),
                      {
                        day: "Ongoing",
                        title: "Unlimited support",
                        desc: "Unlimited phone and email access to your accountant — no per-query charges, no waiting weeks for a response.",
                        icon: "📞",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 px-6 py-4">
                        <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.day}</span>
                            <span className="text-sm font-semibold text-dark">{item.title}</span>
                          </div>
                          <p className="text-sm text-text-light">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {pageError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-sm text-red-700">
                    <AlertCircle size={18} className="shrink-0" />
                    {pageError}
                  </div>
                )}

                {/* T&Cs */}
                <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => set("termsAccepted", !formData.termsAccepted)}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.termsAccepted ? "bg-primary border-primary" : "border-gray-300"}`}>
                    {formData.termsAccepted && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <p className="text-sm text-text">
                    I have read and accept the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer"
                      className="text-primary underline font-medium" onClick={(e) => e.stopPropagation()}>
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer"
                      className="text-primary underline font-medium" onClick={(e) => e.stopPropagation()}>
                      Privacy Policy
                    </a>
                  </p>
                </div>

                <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md">
                  {isSubmitting
                    ? <><Loader2 size={20} className="animate-spin" /> Completing sign-up…</>
                    : <><ClipboardList size={20} /> Complete My Sign-Up</>
                  }
                </button>
              </div>
            )}

          </div>
        </div>

          </main>
        </div>
      </div>

      {/* ── Sticky bottom CTA bar ── always visible; Continue is hidden when payment step is awaiting Stripe action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button type="button" onClick={handleBack}
                className="flex items-center gap-1.5 text-text-light hover:text-dark transition-colors text-sm font-semibold px-3 py-2.5 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={18} /> Back
              </button>
            ) : <div />}
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden md:block text-xs text-text-light">
              Step {BYPASS_SIGNUP_PAYMENT && step > 4 ? step - 1 : step} of {STEPS.length}
            </p>
            {/* Hide Continue on the payment step until either: it's a 1st-month-free
                signup (no payment required), OR the user has already paid (intent
                stored). Without the payment-intent check, a back-then-forward
                navigation after a successful charge traps the user on step 4. */}
            {step < 5 && !(step === 4 && !isFirstMonthFree && !formData.stripePaymentIntentId) && (
              <button type="button" onClick={handleNext} disabled={isSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-70 shadow-md">
                {isSaving
                  ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                  : <>Continue <ChevronRight size={18} /></>
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sector search ────────────────────────────────────────────────────────────

function SectorSearch({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = query.trim().length > 0
    ? SECTORS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SECTORS;

  function select(sector: string) {
    onChange(sector);
    setQuery(sector);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="block text-sm font-medium text-dark">
          Business Sector <span className="text-red-500 ml-0.5">*</span>
        </label>
      </div>
      <p className="text-xs text-text-light mb-1.5">Start typing to search — e.g. &ldquo;IT&rdquo;, &ldquo;construction&rdquo;, &ldquo;health&rdquo;</p>
      <div className="relative">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
          <input
            type="text"
            value={query || value}
            onChange={(e) => { setQuery(e.target.value); onChange(""); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search for your sector…"
            className={`${error ? inputErrCls : inputCls} pl-9 pr-9`}
          />
          {(query || value) && (
            <button type="button" onMouseDown={() => { setQuery(""); onChange(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-dark">
              ✕
            </button>
          )}
        </div>

        {open && filtered.length > 0 && (
          <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {filtered.length === SECTORS.length && (
              <p className="px-4 py-2 text-xs text-text-light border-b border-gray-100">All sectors — or type to filter</p>
            )}
            {filtered.map((sector) => (
              <button key={sector} type="button" onMouseDown={() => select(sector)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 ${value === sector ? "bg-primary/10 text-primary font-medium" : "text-text"}`}>
                {sector}
              </button>
            ))}
          </div>
        )}
      </div>
      {value && !error && (
        <p className="text-xs text-success mt-1.5 flex items-center gap-1">
          <CheckCircle2 size={12} /> Selected: <strong>{value}</strong>
        </p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, colour, children }: {
  title: string; colour: "blue" | "purple" | "green" | "amber"; children: React.ReactNode;
}) {
  const accents = {
    blue:   "border-blue-200 bg-blue-50/50",
    purple: "border-purple-200 bg-purple-50/50",
    green:  "border-green-200 bg-green-50/50",
    amber:  "border-amber-200 bg-amber-50/50",
  };
  const titleColours = {
    blue: "text-blue-700", purple: "text-purple-700",
    green: "text-green-700", amber: "text-amber-700",
  };
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${accents[colour]}`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${titleColours[colour]}`}>{title}</p>
      <div className="space-y-1.5">
        {children}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-text-light shrink-0">{label}</span>
      <span className="text-dark text-right font-medium">{value}</span>
    </div>
  );
}

export default function SignUpDetailsClient({ freephone }: { freephone?: string }) {
  return (
    <Suspense>
      <SignUpDetailsContent freephone={freephone} />
    </Suspense>
  );
}
