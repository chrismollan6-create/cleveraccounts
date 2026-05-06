import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Ecommerce Accounting — Online Seller Accountants | Clever Accounts",
  description:
    "Specialist accounting for ecommerce businesses and online sellers. Amazon, eBay, Etsy, Shopify and WooCommerce experts. International VAT (OSS/IOSS), inventory accounting, platform fee reconciliation. FreeAgent included free.",
};

const faqs = [
  {
    q: "Do I need an accountant for my online shop?",
    a: "Once your online selling is generating a regular income, an accountant becomes essential rather than optional. You need to correctly declare your income on a self assessment tax return, stay on top of the VAT threshold, account for platform fees and inventory correctly, and navigate complex rules like international VAT. Getting any of these wrong can result in HMRC penalties — a good accountant pays for itself several times over.",
  },
  {
    q: "What is OSS and IOSS VAT?",
    a: "OSS (One Stop Shop) is an EU VAT scheme for sellers of physical goods to EU consumers. If your EU sales exceed €10,000 per year, you must charge VAT at the rate of each customer's country. OSS lets you handle all EU VAT via a single registration in one EU member state rather than registering in each country individually. IOSS (Import One Stop Shop) applies to goods worth under €150 imported from outside the EU — it lets you collect and remit VAT at checkout so customers don't face unexpected import charges on delivery.",
  },
  {
    q: "Is accounting different for Amazon vs Etsy?",
    a: "Yes, significantly. Amazon has a complex settlement structure — it nets off FBA storage fees, referral fees, advertising costs, returns, and loan repayments before paying you. Reconciling Amazon payouts requires experience. Etsy is simpler but still has its own fee structure (transaction fees, listing fees, off-site ad fees) and different payment timing. Both platforms require platform-specific knowledge to account for correctly.",
  },
  {
    q: "When should I register for VAT as an online seller?",
    a: "You must register for VAT once your taxable UK turnover exceeds £90,000 in any rolling 12-month period. For most ecommerce sellers this means total sales, not profit. Note that sales to EU consumers may also trigger VAT obligations in the EU (via OSS) once your EU-wide sales exceed €10,000 per year — this is a separate obligation from UK VAT registration. We monitor both thresholds for all our ecommerce clients.",
  },
  {
    q: "Can I claim stock as a business expense?",
    a: "Not directly as an expense in the period you buy it — stock is an asset. You claim the cost of stock as an expense when it is sold (this is your 'cost of goods sold'). Stock remaining at the end of your accounting year must be valued and included in your balance sheet. Getting this wrong distorts your profit figures and can under or over-state your tax liability. We make sure your inventory accounting is handled correctly.",
  },
  {
    q: "How do I account for platform fees?",
    a: "Platform fees (Amazon referral fees, eBay final value fees, Etsy transaction fees, Shopify subscription, Stripe/PayPal fees) are all allowable business expenses deducted from your profit before tax. The tricky part is that most platforms deduct these fees before paying you, so your bank statement shows net receipts rather than gross sales. Your accounts must show gross sales on one side and the fees as expenses on the other — not just the net amount received.",
  },
  {
    q: "What about PayPal and Stripe payments?",
    a: "Both PayPal and Stripe are allowable business expenses for their fees, and their settlements should be reconciled against your sales records. FreeAgent, included free with Clever Accounts, has bank feed connections for Stripe and can import PayPal data, making reconciliation much easier. We set this up for you as part of onboarding so your records stay accurate throughout the year.",
  },
  {
    q: "Should I be a sole trader or limited company for my ecommerce business?",
    a: "For most online sellers starting out, sole trader status is fine and simpler. Once your profit (not turnover) consistently exceeds around £30,000–40,000 per year, a limited company structure typically becomes more tax-efficient — corporation tax at 19–25% on profits vs income tax at 20–45%. There are additional costs and filing obligations for a limited company, so the decision should be made with proper advice. We can model both options for you based on your actual figures.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      {children}
    </>
  );
}
