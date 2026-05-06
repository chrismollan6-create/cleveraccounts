"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();
  const tfa1 = searchParams.get("tfa_1") ?? "";
  const tfa2 = searchParams.get("tfa_2") ?? "";
  const submitted = searchParams.get("submitted");

  const showForm = submitted == null || submitted === "";
  const showThanks = !showForm;

  useEffect(() => {
    if (showForm) {
      const script = document.createElement("script");
      script.src = "https://cleveraccounts.tfaforms.net/js/iframe_resize_helper.js";
      document.body.appendChild(script);
    }
  }, [showForm]);

  return (
    <FormPageLayout
      title="Companies House webfiling code"
      description="The webfilng code is a 6 digit access code that will allow us to submit documents to Companies House on your behalf personal taxes. Your personal UTR reference number enables us to complete your self-assessment tax return each year."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330218?tfa_2=${tfa2}&tfa_1=${tfa1}`}
          height={1000}
          className="w-full"
          frameBorder={0}
        />
      )}

      {showThanks && (
        <div className="py-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
          <h2 className="text-2xl font-black text-dark mb-3">Thank you!</h2>
          <p className="text-text-light">We&apos;ve received your Companies House webfiling code. We&apos;ll be in touch if we need anything else.</p>
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
