import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight, Quote, Users, Award } from "lucide-react";
import GoogleReviewsWidget from "@/components/ui/GoogleReviewsWidget";
import { TESTIMONIALS } from "@/lib/constants";
import { getTestimonials } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials — 5 Stars | Clever Accounts",
  description:
    "Read reviews from 10,000+ businesses who trust Clever Accounts for their accounting. Rated 5 stars — see why sole traders, contractors and limited companies love us.",
};

const allReviews = [
  ...TESTIMONIALS,
  {
    name: "Lisa Crawford",
    role: "Freelance Designer",
    quote: "As a freelancer, I needed someone who understood my unique situation. Clever Accounts has been brilliant — they handle everything and the software is so easy to use. I can do my invoicing on the go!",
    rating: 5,
  },
  {
    name: "Mark Henderson",
    role: "Property Landlord",
    quote: "Managing multiple rental properties used to be a headache at tax time. Clever Accounts took all that stress away. They know property accounting inside and out.",
    rating: 5,
  },
  {
    name: "Rachel Adams",
    role: "Limited Company Director",
    quote: "I switched from a high street accountant and I'm saving over £100 a month. The service is actually better — I get faster responses and the software gives me real-time visibility of my finances.",
    rating: 5,
  },
  {
    name: "Tom Nicholson",
    role: "IT Contractor",
    quote: "The Clever FLEX solution is a game-changer for contractors. Being able to switch between PSC and umbrella seamlessly has saved me so much hassle with IR35 changes.",
    rating: 5,
  },
  {
    name: "Angela Brooks",
    role: "Sole Trader",
    quote: "I was terrified of Making Tax Digital but Clever Accounts made the transition completely painless. They set everything up and walked me through it step by step.",
    rating: 5,
  },
  {
    name: "Chris Palmer",
    role: "Startup Founder",
    quote: "Starting a business is stressful enough without worrying about accounts. From day one, my Clever Accounts accountant has been proactive, helpful and genuinely interested in my success.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Contractor",
    quote: "Best accountancy service I've used in 15 years of contracting. The combination of personal service and great technology is exactly what modern contractors need.",
    rating: 5,
  },
  {
    name: "Robert Williams",
    role: "Limited Company Director",
    quote: "Switched to Clever Accounts last year and haven't looked back. My previous accountant charged more for less. Here I get unlimited support and fantastic software included.",
    rating: 5,
  },
];

// Assign a subtle accent colour per card for variety
const cardAccents = [
  "bg-primary/8",
  "bg-secondary/8",
  "bg-green-500/8",
  "bg-purple-500/8",
  "bg-blue-500/8",
  "bg-amber-500/8",
];

const avatarColours = [
  "from-primary to-primary/70",
  "from-secondary to-orange-400",
  "from-green-500 to-emerald-400",
  "from-purple-500 to-violet-400",
  "from-blue-500 to-sky-400",
  "from-amber-500 to-yellow-400",
];

export default async function ReviewsPage() {
  let reviews = allReviews;
  try {
    const cmsReviews = await getTestimonials();
    if (cmsReviews && cmsReviews.length > 0) reviews = cmsReviews;
  } catch (_e) { /* use fallback */ }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-4">Verified Reviews</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Don't Take<br />
            <span className="text-gradient">Our Word For It</span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            Thousands of sole traders, contractors, and limited companies trust Clever Accounts. Here's what they say.
          </p>

          {/* Ratings display */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/[0.08] border border-white/15 backdrop-blur-sm rounded-2xl px-8 py-5">
            {/* Trustpilot — plain text, no branding */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-secondary text-secondary" />)}
                </div>
                <span className="text-white font-black text-xl">4.7</span>
              </div>
              <div className="text-white/60 text-xs">746 reviews on Trustpilot</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20" />
            {/* Google */}
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                    <Star size={14} className="fill-yellow-400/40 text-yellow-400/40" />
                  </div>
                  <span className="text-white font-black text-xl">4.4</span>
                </div>
                <div className="text-white/60 text-xs">479 verified Google reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-surface py-10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: Star, value: "4.7 / 5", label: "Trustpilot rating", colour: "text-secondary" },
              { icon: Star, value: "4.4 / 5", label: "Google rating", colour: "text-secondary" },
              { icon: Users, value: "10,000+", label: "Businesses served", colour: "text-primary" },
              { icon: Award, value: "20+ years", label: "Accounting expertise", colour: "text-primary" },
            ].map(({ icon: Icon, value, label, colour }) => (
              <div key={label}>
                <Icon size={22} className={`${colour} mx-auto mb-2`} />
                <div className={`text-2xl font-black ${colour}`}>{value}</div>
                <div className="text-text-light text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS GRID ─────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-2xl p-6 card-hover relative overflow-hidden flex flex-col"
              >
                {/* Background quote mark */}
                <Quote
                  size={64}
                  className="absolute -top-2 -right-2 text-border opacity-60"
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4 relative">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={15} className="fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-text leading-relaxed mb-6 flex-1 relative">
                  &ldquo;{review.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColours[i % avatarColours.length]} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                    {review.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark leading-tight">{review.name}</p>
                    <p className="text-xs text-text-light">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOOGLE REVIEWS WIDGET ────────────────────────────── */}
      <section className="bg-white py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <h2 className="text-2xl font-black text-dark">Google Reviews</h2>
            </div>
            <p className="text-text-light text-sm">4.4 stars · 479 verified Google reviews</p>
          </div>
          <GoogleReviewsWidget />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => <Star key={i} size={22} className="fill-white text-white" />)}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Join 10,000+ Happy Businesses
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Experience the Clever Accounts difference. Dedicated accountant, free software, all-inclusive price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get Started Today <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
