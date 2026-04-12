"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  CreditCard, ClipboardList, User, Building2, MapPin, Info,
  ShieldCheck, Search, ChevronDown, HelpCircle, ArrowRight,
} from "lucide-react";
import { trackEvent, captureUTMParams, getStoredUTMParams } from "@/components/seo/GoogleTagManager";

// ─── Types ────────────────────────────────────────────────────────────────────

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

const inputCls = "w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-sm";
const inputErrCls = inputCls + " !border-red-400 focus:ring-red-200";
const selectCls = inputCls;

// ─── Reusable field helpers ───────────────────────────────────────────────────

function FieldWrapper({
  label, required, hint, error, children, tip,
}: {
  label: string; required?: boolean; hint?: string; error?: string;
  children: React.ReactNode; tip?: string;
}) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="block text-sm font-medium text-dark">
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
      {children}
      {hint && !error && <p className="text-xs text-text-light mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function InfoBox({ icon, children, colour = "blue" }: {
  icon?: React.ReactNode; children: React.ReactNode; colour?: "blue" | "green" | "amber";
}) {
  const colours = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return (
    <div className={`flex gap-3 p-4 rounded-xl border text-sm ${colours[colour]}`}>
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div>{children}</div>
    </div>
  );
}

function SectionCard({ icon, title, description, children }: {
  icon: React.ReactNode; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-100 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-dark text-sm leading-tight">{title}</h3>
          {description && <p className="text-xs text-text-light mt-0.5">{description}</p>}
        </div>
      </div>
      {/* Content */}
      <div className="p-5 md:p-6 space-y-4">
        {children}
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
        <FieldWrapper label="Street / First line of address" required error={streetError}>
          <input type="text" value={streetVal} onChange={(e) => onStreet(e.target.value)}
            className={streetError ? inputErrCls : inputCls} placeholder="e.g. 12 High Street" />
        </FieldWrapper>
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="Town / City" required error={cityError}>
            <input type="text" value={cityVal} onChange={(e) => onCity(e.target.value)}
              className={cityError ? inputErrCls : inputCls} />
          </FieldWrapper>
          <FieldWrapper label="County">
            <input type="text" value={countyVal} onChange={(e) => onCounty(e.target.value)} className={inputCls} />
          </FieldWrapper>
        </div>
        <FieldWrapper label="Postcode" required error={postcodeError}>
          <input type="text" value={postcodeVal} onChange={(e) => onPostcode(e.target.value)}
            className={`${postcodeError ? inputErrCls : inputCls} w-40`} />
        </FieldWrapper>
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { label: "Your Details", icon: <User size={16} /> },
  { label: "Business Details", icon: <Building2 size={16} /> },
  { label: "Payment", icon: <CreditCard size={16} /> },
  { label: "Confirm", icon: <CheckCircle2 size={16} /> },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                done ? "bg-success text-white shadow-sm" :
                active ? "bg-primary text-white shadow-md ring-4 ring-primary/20" :
                "bg-gray-100 text-gray-400"
              }`}>
                {done ? <CheckCircle2 size={20} /> : step.icon}
              </div>
              <span className={`text-xs mt-1.5 hidden sm:block font-medium ${
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

// ─── Main page ────────────────────────────────────────────────────────────────

function SignUpDetailsContent() {
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
  const [stripePaymentComplete, setStripePaymentComplete] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [pageError, setPageError] = useState("");

  const isLtd = formData.businessStructure === "Limited Company";
  const isCIS = formData.businessStructure === "CIS";
  const isFirstMonthFree = formData.signUpIncentive === "1st month free";
  const monthlyFee = parseFloat(formData.expectedFee || "0");
  const chargeAmount = monthlyFee > 0 ? parseFloat((monthlyFee * 0.5).toFixed(2)) : 0;

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

  // Re-capture UTMs from URL in case sessionStorage was cleared (e.g. after Stripe redirect)
  useEffect(() => {
    captureUTMParams();
    trackEvent("signup_stage2_view", {
      step: 1,
      ...getStoredUTMParams(),
    });
  }, []);

  // Abandonment tracking — fire when user leaves mid-flow
  useEffect(() => {
    function handleUnload() {
      if (step < 4 && !isCompleted) {
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

  // ── Handle Stripe return ───────────────────────────────────────────────────

  useEffect(() => {
    if (paymentParam === "cancelled") {
      setStripeError("Payment was cancelled. Please try again when you're ready.");
      setStep(3); setIsLoading(false);
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
            setStep(4);
          } else {
            setStripeError("Payment could not be verified. Please try again or contact us.");
            setStep(3);
          }
        })
        .catch(() => { setStripeError("Could not verify payment. Please contact us."); setStep(3); })
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
    if (s === 1) {
      if (!formData.company.trim()) errors.company = "Please enter your business name";
      if (!formData.describeTheBusiness.trim()) errors.describeTheBusiness = "Please describe your business";
      if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
      if (!formData.nationality) errors.nationality = "Please select your nationality";
      if (!formData.ownerStreet.trim()) errors.ownerStreet = "Street address is required";
      if (!formData.ownerCity.trim()) errors.ownerCity = "Town/city is required";
      if (!formData.ownerPostalCode.trim()) errors.ownerPostalCode = "Postcode is required";
      if (isLtd) {
        if (!formData.directorFirstName.trim()) errors.directorFirstName = "Required";
        if (!formData.directorLastName.trim()) errors.directorLastName = "Required";
        if (!formData.newCompany && !formData.companyNumber.trim()) errors.companyNumber = "Enter your company number";
      }
      if (formData.transferringFromAccountant && !formData.priorAccountantDetails.trim()) {
        errors.priorAccountantDetails = "Please provide your previous accountant details";
      }
    }
    if (s === 2) {
      if (!formData.vatNeeded) errors.vatNeeded = "Please select your VAT status";
      if (formData.vatNeeded === "Existing VAT registration" && !formData.vatNumber.trim()) {
        errors.vatNumber = "Please enter your VAT number";
      }
      if (!formData.payeNeeded) errors.payeNeeded = "Please select your PAYE status";
      if (formData.payeNeeded === "Existing PAYE registration" && !formData.payeReference.trim()) {
        errors.payeReference = "Please enter your PAYE reference";
      }
      if (!formData.tradingStartDate) errors.tradingStartDate = "Please enter when you started trading";
      if (isLtd && formData.registeredOfficeAddress === null) {
        errors.registeredOfficeAddress = "Please choose your registered office option" as never;
      }
      if (!formData.mailingStreet.trim()) errors.mailingStreet = "Street address is required";
      if (!formData.mailingCity.trim()) errors.mailingCity = "Town/city is required";
      if (!formData.mailingPostalCode.trim()) errors.mailingPostalCode = "Postcode is required";
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
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function handleSkip() { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }

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
      const res = await fetch(`/api/signup/submit?t=${encodeURIComponent(token)}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
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
    return (
      <PageShell>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-3">You&apos;re all set, {formData.firstName}!</h2>
          <p className="text-text-light mb-6 max-w-sm mx-auto">
            Thank you for choosing Clever Accounts. We&apos;ll be in touch within 24 hours to introduce you to your dedicated accountant.
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 text-left max-w-sm mx-auto space-y-3 mb-6">
            {[
              "Your dedicated accountant will be in touch",
              "We'll send you a letter of engagement to sign",
              "Access to FreeAgent accounting software",
              "Unlimited phone and email support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-text">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Validation error banner ────────────────────────────────────────────────

  const hasErrors = Object.keys(fieldErrors).length > 0;

  // ─── Main form ─────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-1">Step {step} of 4</p>
          <h1 className="text-2xl md:text-3xl font-bold text-dark">
            {step === 1 && `Welcome, ${formData.firstName}!`}
            {step === 2 && "About Your Business"}
            {step === 3 && "First Month Payment"}
            {step === 4 && "Review & Confirm"}
          </h1>
          <p className="text-text-light mt-2 text-sm max-w-md mx-auto">
            {step === 1 && "Let's start with a few personal details so we can set up your account correctly."}
            {step === 2 && "Tell us about your business — this helps us handle your accounting from day one."}
            {step === 3 && "Secure your account with your first month's payment."}
            {step === 4 && "Check everything looks right before we get started."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 md:p-8">
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

            {/* ═══════════════════════════════════════════════════════════════
                STEP 1 — YOUR DETAILS
            ═══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-4">

                {/* Contact info (read-only) */}
                <SectionCard icon={<User size={18} />} title="Your Contact Information"
                  description="Pre-filled from when you registered — contact us to make changes.">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "First Name", value: formData.firstName },
                      { label: "Last Name", value: formData.lastName },
                      { label: "Email Address", value: formData.email },
                      { label: "Phone Number", value: formData.phone },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs font-medium text-text-light mb-1">{label}</p>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                          <span className="text-sm text-dark flex-1 truncate">{value}</span>
                          <ShieldCheck size={14} className="text-gray-300 shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Business / Company */}
                <SectionCard icon={<Building2 size={18} />} title={isLtd ? "Your Company" : "Your Business"}
                  description={isLtd ? "Details about your limited company." : "Tell us about your business."}>

                  {isLtd && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer"
                      onClick={() => set("newCompany", !formData.newCompany)}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.newCompany ? "bg-primary border-primary" : "border-gray-300"}`}>
                        {formData.newCompany && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark">I need to form a new limited company</p>
                        <p className="text-xs text-text-light mt-0.5">Tick this if you haven&apos;t registered your company yet — we can help with that.</p>
                      </div>
                    </div>
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
                      tip="Find your company number at beta.companieshouse.gov.uk — it's an 8-digit number like 12345678.">
                      <input type="text" value={formData.companyNumber}
                        onChange={(e) => set("companyNumber", e.target.value)}
                        className={err("companyNumber") ? inputErrCls : inputCls}
                        placeholder="e.g. 12345678" maxLength={8} />
                    </FieldWrapper>
                  )}

                  <SectorSearch
                    value={formData.sector}
                    onChange={(v) => set("sector", v)}
                  />

                  <FieldWrapper label={`Briefly Describe ${isLtd ? "the Company" : "the Business"}`} required
                    hint="A short description helps us assign the right accountant and tailor our service to you."
                    error={err("describeTheBusiness")}>
                    <textarea rows={3} value={formData.describeTheBusiness}
                      onChange={(e) => set("describeTheBusiness", e.target.value)}
                      className={`${err("describeTheBusiness") ? inputErrCls : inputCls} resize-none`}
                      placeholder="e.g. IT contractor providing software development services to financial sector clients" />
                  </FieldWrapper>
                </SectionCard>

                {/* Personal details */}
                <SectionCard icon={<ShieldCheck size={18} />} title="Personal Information"
                  description="Required for HMRC identity verification and to set up your tax records.">

                  <InfoBox icon={<Info size={16} />} colour="blue">
                    <p className="font-medium mb-0.5">Why do we need this?</p>
                    <p>HMRC requires us to verify your identity before we can act as your accountant. This information is held securely and never shared with third parties.</p>
                  </InfoBox>

                  <FieldWrapper label="Date of Birth" required
                    hint="Used for HMRC identity verification."
                    error={err("dateOfBirth")}>
                    <input type="date" value={formData.dateOfBirth}
                      onChange={(e) => set("dateOfBirth", e.target.value)}
                      className={err("dateOfBirth") ? inputErrCls : inputCls} />
                  </FieldWrapper>

                  <FieldWrapper label="Nationality" required error={err("nationality")}>
                    <div className="relative">
                      <select value={formData.nationality} onChange={(e) => set("nationality", e.target.value)}
                        className={`${err("nationality") ? inputErrCls : selectCls} appearance-none pr-10`}>
                        <option value="">Select nationality…</option>
                        {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                    </div>
                  </FieldWrapper>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldWrapper label="Personal UTR Number"
                      hint="10-digit number from HMRC — leave blank if you don't have one yet."
                      tip="Your Unique Taxpayer Reference (UTR) is a 10-digit number on any letter from HMRC or your self assessment return. Leave blank if you haven't registered for self assessment yet.">
                      <input type="text" value={formData.personalUtr}
                        onChange={(e) => set("personalUtr", e.target.value)}
                        className={inputCls} placeholder="e.g. 1234567890" maxLength={10} />
                    </FieldWrapper>
                    <FieldWrapper label="National Insurance Number"
                      hint="9 characters, no spaces — e.g. QQ123456C."
                      tip="Your NI number is in the format QQ123456C (2 letters, 6 digits, 1 letter). You'll find it on a payslip, P60, or any letter from HMRC or the Department for Work and Pensions.">
                      <input type="text" value={formData.nationalInsuranceNumber}
                        onChange={(e) => set("nationalInsuranceNumber", e.target.value.replace(/\s/g, "").toUpperCase())}
                        className={inputCls} placeholder="e.g. QQ123456C" maxLength={9} />
                    </FieldWrapper>
                  </div>

                  {/* Ltd-only: Director details */}
                  {isLtd && (
                    <div className="space-y-4 bg-gray-50 rounded-xl border border-gray-200 p-4 mt-2">
                      <div>
                        <p className="text-sm font-semibold text-dark">Director Details</p>
                        <p className="text-xs text-text-light mt-0.5">The primary director responsible for this account. If there are multiple directors, we&apos;ll collect the others once you&apos;re onboarded.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FieldWrapper label="Director First Name" required error={err("directorFirstName")}>
                          <input type="text" value={formData.directorFirstName}
                            onChange={(e) => set("directorFirstName", e.target.value)}
                            className={err("directorFirstName") ? inputErrCls : inputCls} />
                        </FieldWrapper>
                        <FieldWrapper label="Director Last Name" required error={err("directorLastName")}>
                          <input type="text" value={formData.directorLastName}
                            onChange={(e) => set("directorLastName", e.target.value)}
                            className={err("directorLastName") ? inputErrCls : inputCls} />
                        </FieldWrapper>
                      </div>
                    </div>
                  )}
                </SectionCard>

                {/* Home address */}
                <SectionCard icon={<MapPin size={18} />} title="Your Home Address"
                  description="Your personal residential address — not your business address.">
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

                {/* Transferring accountant */}
                <SectionCard icon={<ArrowRight size={18} />} title="Switching From Another Accountant?"
                  description="If you're moving to us from another accountant, we'll handle the handover for you.">
                  <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl cursor-pointer"
                    onClick={() => set("transferringFromAccountant", !formData.transferringFromAccountant)}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.transferringFromAccountant ? "bg-primary border-primary" : "border-gray-300"}`}>
                      {formData.transferringFromAccountant && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">Yes, I&apos;m transferring from another accountant</p>
                      <p className="text-xs text-text-light mt-0.5">We&apos;ll contact them to obtain your records and arrange a smooth handover.</p>
                    </div>
                  </div>

                  {formData.transferringFromAccountant && (
                    <div className="space-y-4 pl-1">
                      <FieldWrapper label="Previous Accountant — Name & Contact Details" required
                        hint="Firm name, email address or phone number so we can contact them."
                        error={err("priorAccountantDetails")}>
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
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 2 — BUSINESS DETAILS
            ═══════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-5">

                {/* VAT */}
                <SectionCard icon={<Building2 size={18} />} title="VAT Status"
                  description="VAT (Value Added Tax) is charged on most goods and services. We need to know your current status.">

                  <InfoBox icon={<Info size={16} />} colour="blue">
                    <p>Most businesses must register for VAT once their taxable turnover exceeds <strong>£90,000</strong> in a rolling 12-month period. However, <strong>voluntary registration can sometimes be beneficial</strong> even below this threshold — for example, if your customers are VAT-registered businesses, you can reclaim VAT on your costs. If you&apos;re not sure which option is right for you, don&apos;t worry — your dedicated accountant will advise you on the best approach for your situation.</p>
                  </InfoBox>

                  <FieldWrapper label="VAT Registration Status" required error={err("vatNeeded")}>
                    <div className="relative">
                      <select value={formData.vatNeeded} onChange={(e) => set("vatNeeded", e.target.value)}
                        className={`${err("vatNeeded") ? inputErrCls : selectCls} appearance-none pr-10`}>
                        <option value="">Select your VAT status…</option>
                        <option value="Not VAT Registered">Not VAT Registered — turnover under £90k</option>
                        <option value="Existing VAT registration">Already VAT Registered — I have a VAT number</option>
                        <option value="Needs VAT registration">I need to register for VAT</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                    </div>
                  </FieldWrapper>

                  {formData.vatNeeded === "Existing VAT registration" && (
                    <FieldWrapper label="VAT Registration Number" required
                      hint="9-digit number in the format GB123456789 — on your VAT certificate or HMRC online account."
                      error={err("vatNumber")}
                      tip="Your VAT registration number is on your VAT certificate from HMRC, on any VAT returns you've submitted, or in your HMRC business tax account.">
                      <input type="text" value={formData.vatNumber}
                        onChange={(e) => set("vatNumber", e.target.value)}
                        className={err("vatNumber") ? inputErrCls : inputCls}
                        placeholder="e.g. GB123456789" />
                    </FieldWrapper>
                  )}
                  {formData.vatNeeded === "Needs VAT registration" && (
                    <InfoBox colour="green" icon={<CheckCircle2 size={16} />}>
                      No problem — we&apos;ll handle your VAT registration as part of your onboarding. No action needed from you now.
                    </InfoBox>
                  )}
                </SectionCard>

                {/* PAYE */}
                <SectionCard icon={<User size={18} />} title="PAYE / Payroll"
                  description="PAYE (Pay As You Earn) is the system used to pay employees and directors a salary through the company.">

                  <FieldWrapper label="PAYE / Payroll Status" required error={err("payeNeeded")}>
                    <div className="relative">
                      <select value={formData.payeNeeded} onChange={(e) => set("payeNeeded", e.target.value)}
                        className={`${err("payeNeeded") ? inputErrCls : selectCls} appearance-none pr-10`}>
                        <option value="">Select your PAYE status…</option>
                        <option value="Not PAYE registered">No PAYE — I don&apos;t pay a salary through the business</option>
                        <option value="Existing PAYE registration">Already have PAYE — I have a PAYE reference</option>
                        <option value="Needs PAYE registration">I need to set up PAYE / payroll</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                    </div>
                  </FieldWrapper>

                  {formData.payeNeeded === "Existing PAYE registration" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FieldWrapper label="PAYE Reference Number" required
                        hint="Format: 123/AB45678 — on your P60 or HMRC payroll letter."
                        error={err("payeReference")}
                        tip="Your PAYE reference is on any payroll correspondence from HMRC, your P60, or in your HMRC online account under 'PAYE for Employers'.">
                        <input type="text" value={formData.payeReference}
                          onChange={(e) => set("payeReference", e.target.value)}
                          className={err("payeReference") ? inputErrCls : inputCls}
                          placeholder="e.g. 123/AB45678" />
                      </FieldWrapper>
                      <FieldWrapper label="Accounts Office Reference"
                        hint="13-character reference — on your payslip booklet or HMRC letter."
                        tip="The Accounts Office Reference is a 13-character reference (e.g. 123PA00012345) found on your payslip booklet or on any HMRC Accounts Office letter.">
                        <input type="text" value={formData.payeAccountsOffice}
                          onChange={(e) => set("payeAccountsOffice", e.target.value)}
                          className={inputCls} placeholder="e.g. 123PA00012345" />
                      </FieldWrapper>
                    </div>
                  )}
                  {formData.payeNeeded === "Needs PAYE registration" && (
                    <InfoBox colour="green" icon={<CheckCircle2 size={16} />}>
                      Great — we&apos;ll set up your PAYE scheme as part of your onboarding. We&apos;ll be in touch to confirm the details.
                    </InfoBox>
                  )}
                </SectionCard>

                {/* Trading start */}
                <SectionCard icon={<ClipboardList size={18} />} title="Trading History"
                  description="When did you start (or plan to start) trading? This affects your tax obligations.">
                  <FieldWrapper label={`${isCIS ? "CIS" : isLtd ? "Company" : "Self-Employment"} Start Date`} required
                    hint={isLtd ? "The date your company was incorporated, or the date you plan to start trading." : "The date you started (or plan to start) self-employment."}
                    error={err("tradingStartDate")}>
                    <input type="date" value={formData.tradingStartDate}
                      onChange={(e) => set("tradingStartDate", e.target.value)}
                      className={`${err("tradingStartDate") ? inputErrCls : inputCls} w-48`} />
                  </FieldWrapper>
                </SectionCard>

                {/* Registered office (Ltd only) */}
                {isLtd && (
                  <SectionCard icon={<Building2 size={18} />} title="Registered Office Address"
                    description="Every limited company must have a registered office address — this is the official address on public record at Companies House.">

                    <InfoBox icon={<Info size={16} />} colour="blue">
                      This is the address HMRC and Companies House will use for official correspondence. It doesn&apos;t have to be where you actually work.
                    </InfoBox>

                    <div className="space-y-3">
                      {[
                        { val: "ours", label: "Use Clever Accounts' registered office address", desc: "We'll provide our office address — ideal if you work from home and want to keep your home address private." },
                        { val: "own", label: "Use my own address", desc: "Your business address will be used as the registered office and will appear on the public Companies House register." },
                      ].map(({ val, label, desc }) => (
                        <div key={val}
                          onClick={() => set("registeredOfficeAddress", val === "ours")}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            (val === "ours" && formData.registeredOfficeAddress === true) ||
                            (val === "own" && formData.registeredOfficeAddress === false)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            (val === "ours" && formData.registeredOfficeAddress === true) ||
                            (val === "own" && formData.registeredOfficeAddress === false)
                              ? "border-primary" : "border-gray-300"
                          }`}>
                            {((val === "ours" && formData.registeredOfficeAddress === true) ||
                              (val === "own" && formData.registeredOfficeAddress === false)) && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark">{label}</p>
                            <p className="text-xs text-text-light mt-0.5">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {err("registeredOfficeAddress") && (
                      <p className="text-xs text-red-500">{err("registeredOfficeAddress")}</p>
                    )}
                  </SectionCard>
                )}

                {/* Business address */}
                <SectionCard icon={<MapPin size={18} />} title={
                  isLtd
                    ? (formData.registeredOfficeAddress ? "Business Trading Address" : "Registered Office Address")
                    : "Business Address"
                } description={
                  isLtd && formData.registeredOfficeAddress
                    ? "Where the business actually operates from (can be the same as your home address)."
                    : "The main address for your business. For sole traders this is often your home address."
                }>
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
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 3 — PAYMENT
            ═══════════════════════════════════════════════════════════════ */}
            {step === 3 && (
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
                      From month 2 onwards: <strong className="text-dark">£{monthlyFee.toFixed(2)}/month</strong>
                    </div>
                  </div>
                ) : stripePaymentComplete ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40} className="text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Payment Received!</h3>
                    <p className="text-text-light">
                      <strong>£{chargeAmount.toFixed(2)}</strong> collected — that&apos;s 50% off your first month.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pricing breakdown */}
                    <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-6 border border-primary/10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-text-light">Your monthly fee</p>
                          <p className="text-2xl font-bold text-dark">£{monthlyFee.toFixed(2)}<span className="text-sm font-normal text-text-light">/month</span></p>
                        </div>
                        <div className="text-right">
                          <div className="inline-block bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full mb-1">50% OFF</div>
                          <p className="text-sm text-text-light">First month</p>
                          <p className="text-2xl font-bold text-primary">£{chargeAmount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="border-t border-primary/10 pt-4 space-y-2 text-sm">
                        {[
                          "50% discount on your first month",
                          "Full price applies from month 2",
                          "Cancel anytime — no minimum contract",
                        ].map((item) => (
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
                      Pay £{chargeAmount.toFixed(2)} Securely
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
                STEP 4 — REVIEW & CONFIRM
            ═══════════════════════════════════════════════════════════════ */}
            {step === 4 && (
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
                    {isLtd && formData.newCompany && <SummaryRow label="Formation" value="To be formed by Clever Accounts" />}
                    {formData.tradingStartDate && <SummaryRow label="Trading Since" value={formData.tradingStartDate} />}
                  </SummaryCard>

                  <SummaryCard title="Personal" colour="green">
                    <SummaryRow label="Date of Birth" value={formData.dateOfBirth} />
                    <SummaryRow label="Nationality" value={formData.nationality} />
                    {formData.nationalInsuranceNumber && <SummaryRow label="NI Number" value={formData.nationalInsuranceNumber} />}
                    <SummaryRow label="Home Address" value={[formData.ownerStreet, formData.ownerCity, formData.ownerPostalCode].filter(Boolean).join(", ")} />
                  </SummaryCard>

                  <SummaryCard title="Tax &amp; Payroll" colour="amber">
                    <SummaryRow label="VAT Status" value={formData.vatNeeded} />
                    {formData.vatNumber && <SummaryRow label="VAT Number" value={formData.vatNumber} />}
                    <SummaryRow label="PAYE Status" value={formData.payeNeeded} />
                    <SummaryRow label="Business Address" value={[formData.mailingStreet, formData.mailingCity, formData.mailingPostalCode].filter(Boolean).join(", ")} />
                  </SummaryCard>
                </div>

                {/* ── Pricing summary ── */}
                <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50 p-5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Your Pricing Summary</p>
                  <div className="space-y-2">
                    {isFirstMonthFree ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text">First month</span>
                        <span className="font-bold text-success">FREE</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text">Months 1–3 <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 ml-1">50% OFF</span></span>
                        <span className="font-bold text-primary">£{chargeAmount.toFixed(2)}/month + VAT</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-primary/10 pt-2">
                      <span className="text-sm text-text">From month 4 onwards</span>
                      <span className="font-semibold text-dark">£{monthlyFee.toFixed(2)}/month + VAT</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-light mt-3">All fees are exclusive of VAT at 20%. No setup fees. Cancel anytime.</p>
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
                        desc: "You'll receive a confirmation email with everything you need to know about getting started with Clever Accounts.",
                        icon: "📧",
                      },
                      {
                        day: "Within 24 hours",
                        title: "Meet your dedicated accountant",
                        desc: "An experienced accountant will be personally assigned to your account and will call or email to introduce themselves and discuss your needs.",
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
                    <a href="https://www.cleveraccounts.co.uk/terms" target="_blank" rel="noopener noreferrer"
                      className="text-primary underline font-medium" onClick={(e) => e.stopPropagation()}>
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="https://www.cleveraccounts.co.uk/privacy" target="_blank" rel="noopener noreferrer"
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

            {/* ── Navigation ── */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              {/* DEV ONLY: skip button — always visible for testing */}
              {step < 4 && (
                <div className="flex justify-center">
                  <button type="button" onClick={handleSkip}
                    className="text-xs text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                    Skip (testing)
                  </button>
                </div>
              )}

              {!(step === 3 && !isFirstMonthFree && !stripePaymentComplete) && (
                <div className="flex items-center justify-between">
                  {step > 1 ? (
                    <button type="button" onClick={handleBack}
                      className="flex items-center gap-1.5 text-text-light hover:text-dark transition-colors text-sm font-medium">
                      <ChevronLeft size={18} /> Back
                    </button>
                  ) : <div />}

                  {step < 4 && !(step === 3 && !isFirstMonthFree) && (
                    <button type="button" onClick={handleNext} disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3 rounded-xl transition-colors disabled:opacity-70 shadow-sm">
                      {isSaving
                        ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                        : <>Continue <ChevronRight size={18} /></>
                      }
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-text-light mt-4">
          Your progress is saved automatically each time you continue.
        </p>
      </div>
    </div>
  );
}

// ─── Sector search ────────────────────────────────────────────────────────────

function SectorSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
          Business Sector <span className="text-text-light font-normal">(optional)</span>
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
            className={`${inputCls} pl-9 pr-9`}
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
      {value && (
        <p className="text-xs text-success mt-1.5 flex items-center gap-1">
          <CheckCircle2 size={12} /> Selected: <strong>{value}</strong>
        </p>
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

export default function SignUpDetailsPage() {
  return (
    <Suspense>
      <SignUpDetailsContent />
    </Suspense>
  );
}
