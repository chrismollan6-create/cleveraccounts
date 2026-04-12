import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Self Assessment Tax Returns | Done For You | Clever Accounts",
  description:
    "Clever Accounts prepares and files your self assessment tax return to HMRC — accurately, on time, and with every allowable expense claimed. Dedicated accountant from £32.50/month. No setup fees.",
  keywords: [
    "self assessment",
    "self assessment tax return",
    "HMRC self assessment",
    "self assessment accountant",
    "self assessment filing",
    "sole trader tax return",
    "landlord self assessment",
    "31 January deadline",
    "self assessment UK",
  ],
  openGraph: {
    title: "Self Assessment Tax Return — Done For You | Clever Accounts",
    description:
      "Stop dreading the 31 January deadline. We prepare and file your self assessment tax return to HMRC. Dedicated accountant, all income sources covered, from £32.50/month.",
    type: "website",
  },
};

export default function SelfAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
