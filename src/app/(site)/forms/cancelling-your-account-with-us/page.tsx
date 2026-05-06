"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();

  const tfa20 = searchParams.get("tfa_20") ?? "";
  const submitted = searchParams.get("submitted");

  const showForm = submitted == null || submitted === "";
  const showYes = submitted === "1";
  const showNo = submitted === "0";

  useEffect(() => {
    if (showForm) {
      const script = document.createElement("script");
      script.src = "https://cleveraccounts.tfaforms.net/js/iframe_resize_helper.js";
      document.body.appendChild(script);
    }
  }, [showForm]);

  return (
    <FormPageLayout
      title="We're sorry to see you go..."
      description="To understand and improve our experience, we would love your feedback on how you found dealing with us and the reason why you are leaving our service."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330314?tfa_20=${tfa20}`}
          height={1000}
          className="w-full"
          frameBorder={0}
        />
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
