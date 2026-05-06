"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormPageLayout from "@/components/layout/FormPageLayout";

function StatementOfFacts() {
  const searchParams = useSearchParams();

  const tfa51 = searchParams.get("tfa_51") ?? "";
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
      title="Thanks for approving your VAT return"
      description="The status of the VAT return has been updated and it will be submitted to HMRC shortly.
      If you subsequently have any queries regarding your VAT return or you do not wish it to be submitted then please contact your accountant urgently.

Payment details for paying VAT can be found on your VAT confirmation email."
      note="If you need help with any of the questions, please do let us know."
    >


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
