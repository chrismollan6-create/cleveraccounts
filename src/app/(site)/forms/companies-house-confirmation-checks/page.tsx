"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FormPageLayout from "@/components/layout/FormPageLayout";

function CompaniesHouseVerification() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "";
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
      title="Confirm your limited company details"
      description="As part of our checks when you sign up, we need to ensure the details of your company are fully correct and that all officers have had their identification checked and verified by Companies House."
    >
      <div className="text-center mb-6">
        <Link
          href="/forms/companies-house-new-rules"
          className="inline-block bg-dark text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-dark/80 transition-colors"
        >
          More information can be found here
        </Link>
      </div>

      {showForm && (
        <iframe
          src={`https://cleveraccounts.tfaforms.net/330324?id=${id}`}
          height={850}
          className="w-full"
          frameBorder={0}
        />
      )}

      {!showForm && (
        <div className="py-12 text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-black text-dark mb-3">Thanks for updating your preferences</h2>
          <p className="text-primary text-sm">If you have not provided us with all the information, please revisit this page to update the details</p>
        </div>
      )}
    </FormPageLayout>
  );
}

export default function CompaniesHouseVerificationPage() {
  return (
    <Suspense>
      <CompaniesHouseVerification />
    </Suspense>
  );
}
