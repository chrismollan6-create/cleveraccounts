import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take Home Pay Calculator 2025/26 — Sole Trader & Ltd Company | Clever Accounts",
  description:
    "Free UK take home pay calculator for 2025/26. Compare sole trader vs limited company take-home. Includes income tax, National Insurance, corporation tax and dividends. See how much you could save.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
