"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();

  const tfa2 = searchParams.get("tfa_2") ?? "";
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
      title="Please enter your personal UTR reference"
      description="Please enter your 10 digit personal UTR that you should have received from HMRC regarding your personal taxes. Your personal UTR reference number enables us to complete your self-assessment tax return each year."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330277?tfa_2=${tfa2}`}
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
