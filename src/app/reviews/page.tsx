import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials",
  description:
    "Read reviews from 10,000+ businesses who trust Clever Accounts for their online accounting. See why we're rated 5 stars.",
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

export default function ReviewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Customer Reviews
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-8">
            Don&apos;t just take our word for it — hear from the businesses we support every day.
          </p>
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-border">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-lg font-bold text-dark">5.0</span>
            <span className="text-text-light">from 10,000+ businesses</span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allReviews.map((review, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-2xl p-6 card-hover relative"
              >
                <Quote size={32} className="text-primary/10 absolute top-4 right-4" />
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text leading-relaxed mb-5">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-white text-sm font-bold">
                    {review.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">{review.name}</p>
                    <p className="text-xs text-text-light">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join 10,000+ Happy Businesses
          </h2>
          <p className="text-white/80 mb-8">
            Experience the Clever Accounts difference for yourself.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
          >
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
