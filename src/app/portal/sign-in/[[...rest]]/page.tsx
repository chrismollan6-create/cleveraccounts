import { SignIn } from "@clerk/nextjs";
import { getBrand } from "@/lib/brand";

/**
 * Clerk sign-in page. The catch-all [[...rest]] segment is required by Clerk
 * so its internal navigation (verification step, MFA, password reset, etc.)
 * can mount under the same route.
 */
export default async function PortalSignInPage() {
  const brand = await getBrand();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-text">Sign in</h1>
          <p className="text-text-light mt-1">
            Welcome back to your {brand.name} portal.
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-sm border border-gray-100 rounded-2xl",
            },
          }}
          // forceRedirectUrl honoured after successful sign-in
          forceRedirectUrl="/portal/dashboard"
          signUpUrl="/portal/sign-up"
        />
      </div>
    </div>
  );
}
