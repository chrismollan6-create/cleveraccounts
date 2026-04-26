"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();

  const tfa24 = searchParams.get("tfa_24") ?? "";
  const tfa1 = searchParams.get("tfa_1") ?? "";
  const tfa3 = searchParams.get("tfa_3") ?? "";  
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
      title="Pay your outstanding invoice from Clever Accounts"
      description="We appreciate a prompt payment of our invoice when it's not been taken by direct debit."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330291?tfa_24=${tfa24}&tfa_1=${tfa1}&tfa_3=${tfa3}`}
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
