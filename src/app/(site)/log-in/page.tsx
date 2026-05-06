import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Clever Accounts portal to manage your accounting, view your dashboard, and access your FreeAgent software.",
};

export default function LogInPage() {
  return (
    <section className="gradient-hero-subtle min-h-[calc(100vh-200px)] flex items-center py-16">
      <div className="max-w-lg mx-auto px-4 w-full">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-border text-center">
          <div className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">CA</div>
          <h1 className="text-3xl font-bold text-dark mb-2">Welcome Back</h1>
          <p className="text-text-light mb-8">Log in to your Clever Accounts portal</p>
          <a
            href={COMPANY.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
          >
            Go to Client Portal <ExternalLink size={18} />
          </a>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-text-light mb-3">Don&apos;t have an account yet?</p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
