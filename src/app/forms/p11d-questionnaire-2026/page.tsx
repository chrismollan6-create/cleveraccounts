"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function P11dQuestionnaire() {
  const searchParams = useSearchParams();

  const tfa55 = searchParams.get("tfa_55") ?? "";
  const tfa154 = searchParams.get("tfa_154") ?? "";
  const tfa157 = searchParams.get("tfa_157") ?? "";
  const submitted = searchParams.get("submitted");

  const showForm = submitted == null || submitted === "";

  useEffect(() => {
    if (showForm) {
      const script = document.createElement("script");
      script.src = "https://cleveraccounts.tfaforms.net/js/iframe_resize_helper.js";
      document.body.appendChild(script);
    }
  }, [showForm]);

  return (
    <FormPageLayout
      title="P11d Questionnaire for 2026"
      description="If you are in receipt of any company benefit during the year to 5th April 2026, we are required to declare this to HMRC. Please complete the questionnaire below."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330327?tfa_55=${tfa55}&tfa_154=${tfa154}&tfa_157=${tfa157}`}
          height={2000}
          className="w-full"
          frameBorder={0}
        />
      )}

      {!showForm && (
        <div className="py-12 text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-black text-dark mb-3">Thanks for submitting the form</h2>
          <p className="text-text-light">If we require any further information, we&apos;ll be in touch in due course.</p>
        </div>
      )}
    </FormPageLayout>
  );
}

export default function P11dQuestionnairePage() {
  return (
    <Suspense>
      <P11dQuestionnaire />
    </Suspense>
  );
}
