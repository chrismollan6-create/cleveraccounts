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
      title="Please complete the statement of facts"
      description="Before we can process your insurance request, we require you to complete the below statement of facts to confirm your eligibility for the contractor insurance offered."
      note="If you need help with any of the questions, please do let us know."
    >
      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330217?tfa_51=${tfa51}`}
          height={1000}
          className="w-full"
          frameBorder={0}
        />
      )}

      {(showYes || showNo) && (
        <div className="bg-[#f5f0eb] rounded-2xl p-10">
          <h2 className="text-3xl font-black text-primary text-center mb-6 leading-tight">
            Many thanks for completing the insurance statement of facts
          </h2>
          {showYes && (
            <>
              <p className="text-gray-700 mb-4">
                Once a member of our team has reviewed the details submitted and your account details, we will issue you the appropriate insurance policy schedules to you via email.
              </p>
              <p className="text-gray-700">
                Please note that until you receive the documents you should not assume the company is covered by the insurance
              </p>
            </>
          )}
          {showNo && (
            <>
              <p className="text-primary mb-4">
                Unfortunately it appears your company is unsuitable for the insurance we provide as part of the package.
              </p>
              <p className="text-gray-700">
                Regardless, a member of our team will check the details you provided and if there are any further questions, will contact you to speak to you about the information submitted.
              </p>
            </>
          )}
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
