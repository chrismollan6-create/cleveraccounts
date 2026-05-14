import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Bare /portal landing. Auth-aware redirect:
 *   - Signed in  → /dashboard
 *   - Signed out → /sign-in
 *
 * Middleware marks this path as public so we can run our own check here
 * and choose the right destination without an extra redirect hop.
 */
export default async function PortalRoot() {
  const { userId } = await auth();
  if (userId) {
    redirect("/portal/dashboard");
  }
  redirect("/portal/sign-in");
}
