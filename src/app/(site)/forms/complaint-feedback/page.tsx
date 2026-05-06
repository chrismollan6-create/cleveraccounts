"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();

  const tfa21 = searchParams.get("tfa_21") ?? "";
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
      title="How have we handled your complaint?"
      description="We would appreciate you providing some feedback on how we have dealt with your complaint"
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/wfQ3mzL?tfa_21=${tfa21}`}
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
