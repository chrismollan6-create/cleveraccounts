"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function VatDecline() {
  const searchParams = useSearchParams();

  const tfa1 = searchParams.get("tfa_1") ?? "";
  const tfa2 = searchParams.get("tfa_2") ?? "";
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
      title="You are declining your VAT return"
      description="Please only decline if you think the figures are incorrect. If you would like a breakdown of the calculation, please approve and ask your accountant."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330226?tfa_1=${tfa1}&tfa_2=${tfa2}`}
          height={650}
          className="w-full"
          frameBorder={0}
        />
      )}

      {!showForm && (
        <div className="py-12 text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-black text-dark mb-3">Thanks for updating your VAT return</h2>
          <p className="text-text-light">If we require any further information, we&apos;ll be in touch in due course.</p>
        </div>
      )}
    </FormPageLayout>
  );
}

export default function VatDeclinePage() {
  return (
    <Suspense>
      <VatDecline />
    </Suspense>
  );
}
