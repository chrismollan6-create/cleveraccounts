import { Mail, ShieldCheck, Hourglass } from "lucide-react";
import type { BrandConfig } from "@/lib/constants";

interface Props {
  brand: BrandConfig;
  state: "disabled" | "pending";
  firstName?: string | null;
  email?: string | null;
}

/**
 * Friendly soft-block page shown when a signed-in Clerk user's email doesn't
 * map to an active Salesforce Contact (state='disabled') or when the link
 * table hasn't been populated yet (state='pending', usually a race condition
 * where the Clerk webhook is in flight).
 *
 * Calm tone — these aren't error states from the user's perspective. We never
 * tell them "you don't exist in our database" because that's confusing and
 * leaks information. We tell them what to do.
 */
export default function AccessGate({ brand, state, firstName, email }: Props) {
  const isDisabled = state === "disabled";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
          <div
            className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center ${
              isDisabled ? "bg-primary/10" : "bg-secondary/10"
            }`}
          >
            {isDisabled ? (
              <ShieldCheck size={26} className="text-primary" />
            ) : (
              <Hourglass size={26} className="text-secondary-dark" />
            )}
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-text">
            {isDisabled ? (
              <>Welcome{firstName ? `, ${firstName}` : ""} — almost there</>
            ) : (
              <>Setting up your portal…</>
            )}
          </h1>

          <p className="mt-3 text-text-light leading-relaxed">
            {isDisabled ? (
              <>
                We couldn&apos;t find {email ? <strong>{email}</strong> : "your email"}{" "}
                on file in our records. Drop your accountant a quick email and they&apos;ll
                get you set up — usually within a few hours during business days.
              </>
            ) : (
              <>
                We&apos;re finishing the connection between your sign-up and your account
                with us. This usually takes a few seconds — refresh the page in a
                moment.
              </>
            )}
          </p>

          {isDisabled && (
            <a
              href={`mailto:${brand.supportEmail}?subject=${encodeURIComponent(
                "Portal access — please link my account"
              )}&body=${encodeURIComponent(
                `Hi,\n\nI signed up for the ${brand.name} client portal but my email doesn't seem to be linked to my account yet. Could you set me up?\n\n${email ? `Email: ${email}\n\n` : ""}Thanks!`
              )}`}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-dark transition-all"
            >
              <Mail size={16} />
              Email your accountant
            </a>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-text-light/80">
            <p>
              Support:{" "}
              <a
                href={`mailto:${brand.supportEmail}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {brand.supportEmail}
              </a>
            </p>
            <p className="mt-1">
              Phone:{" "}
              <a
                href={`tel:${brand.phone.replace(/\s/g, "")}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {brand.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
