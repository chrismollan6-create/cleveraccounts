"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();

  const tfa55 = searchParams.get("tfa_55") ?? "";
  const submitted = searchParams.get("submitted");

  const showForm = submitted == null || submitted === "";
  const showHighScore = submitted === "0";
  const showLowScore = !showForm && !showHighScore;

  useEffect(() => {
    if (showForm) {
      const script = document.createElement("script");
      script.src = "https://cleveraccounts.tfaforms.net/js/iframe_resize_helper.js";
      document.body.appendChild(script);
    }
  }, [showForm]);

  return (
    <FormPageLayout
      title="We'd love some feedback"
      description="We would really appreciate if you could spend 60 seconds in completing a short feedback survey."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/wfNLQ2G?tfa_55=${tfa55}`}
          height={1000}
          className="w-full"
          frameBorder={0}
        />
      )}

      {showHighScore && (
        <div className="py-8">
          <div className="text-center mb-8">
            <p className="text-text-light text-lg">You&apos;re amazing — thank you! We have a couple of small favours to ask&hellip;</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Review */}
            <div className="card-glow flex flex-col items-center text-center gap-5 p-8 rounded-2xl border border-border bg-white shadow-sm">
              <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center text-2xl">⭐</div>
              <div>
                <h2 className="text-xl font-black text-dark mb-1">Google Review</h2>
                <div className="flex justify-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-text text-sm leading-relaxed">If you have 30 seconds, please could we ask you to leave us a Google review?</p>
              </div>
              <p className="text-secondary font-semibold text-sm">Leave a review &amp; enter our monthly £150 prize draw!</p>
              <a
                href="https://g.page/r/CRm3VFKd_1VBEAg/review"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center"
              >
                Submit your review
              </a>
            </div>

            {/* Refer a Friend */}
            <div className="card-glow flex flex-col items-center text-center gap-5 p-8 rounded-2xl border border-border bg-white shadow-sm">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-2xl">🤝</div>
              <div>
                <h2 className="text-xl font-black text-dark mb-1">Refer a Friend</h2>
                <div className="h-7 mb-3" />
                <p className="text-text text-sm leading-relaxed">If you&apos;ve enjoyed our service, why not refer us to your friends, family or colleagues?</p>
              </div>
              <p className="text-primary font-semibold text-sm">Earn £250 commission when they sign up to our limited company package!</p>
              <a
                href="/refer-a-friend"
                className="btn-secondary w-full text-center"
              >
                Refer a friend
              </a>
            </div>
          </div>
        </div>
      )}

      {showLowScore && (
        <div className="py-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
          <h2 className="text-2xl font-black text-dark mb-3">Thanks for your feedback</h2>
          <p className="text-text-light">We value all feedback and will review your comments shortly. If we need to speak to you, we&apos;ll be in touch soon.</p>
        </div>
      )}

    </FormPageLayout>
  );
}

export default function StatementOfFactsPage() {
  return (
    <Suspense>
      <StatementOfFacts />
    </Suspense>
  );
}
