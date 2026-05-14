import { SignUp } from "@clerk/nextjs";
import { getBrand } from "@/lib/brand";

/**
 * Clerk sign-up page.
 *
 * Phase 1 strategy: portal accounts are invite-led (Salesforce Flow on
 * New_Client_Workflow__c create → Clerk Invitation API). This page is the
 * landing for invite-link redemption. Direct self-serve sign-up is also
 * accepted but the user must have an email matching an existing Contact
 * with an active workflow (enforced server-side after sign-up via
 * Clerk webhook → portal.users link table → SF lookup).
 */
export default async function PortalSignUpPage() {
  const brand = await getBrand();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-text">Set up your account</h1>
          <p className="text-text-light mt-1">
            Create your {brand.name} portal access.
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-sm border border-gray-100 rounded-2xl",
            },
          }}
          forceRedirectUrl="/portal/dashboard"
          signInUrl="/portal/sign-in"
        />
      </div>
    </div>
  );
}
