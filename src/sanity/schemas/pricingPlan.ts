import { defineType, defineField } from "sanity";
import { PoundSterling } from "lucide-react";

/**
 * A single pricing plan card (Sole Trader, Limited Company, Contractor, etc).
 * Organised into tabs (Plan / Pricing / Features & button / Homepage panel)
 * so the form stays approachable for non-technical editors.
 */
export default defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  icon: PoundSterling,
  groups: [
    { name: "plan", title: "Plan", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "features", title: "Features & button" },
    { name: "homepage", title: "Homepage panel" },
  ],
  fieldsets: [
    { name: "cta", title: "Sign-up button", options: { collapsible: false } },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Plan name",
      type: "string",
      group: "plan",
      description: "The name shown on the plan card, e.g. 'Sole Trader', 'Limited Company' or 'Contractor'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Short tagline",
      type: "string",
      group: "plan",
      description: "A one-line description under the name, e.g. 'Perfect for self-employed'.",
    }),
    defineField({
      name: "order",
      title: "Position on the page",
      type: "number",
      group: "plan",
      description: "Controls the order the plans appear in, left to right (1 = first, 2 = next, and so on).",
    }),
    defineField({
      name: "price",
      title: "Monthly price",
      type: "string",
      group: "pricing",
      description: "Just the number with no £ symbol, e.g. '42.50'. The £ is added automatically.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceNote",
      title: "Small print next to the price",
      type: "string",
      group: "pricing",
      description: "Shown beside the price, e.g. '+ VAT' or 'excl. VAT'.",
      initialValue: "+ VAT where applicable",
    }),
    defineField({
      name: "popular",
      title: "Highlight as 'Most Popular'?",
      type: "boolean",
      group: "pricing",
      description: "Turn on to add a 'Most Popular' badge to this plan card.",
      initialValue: false,
    }),
    defineField({
      name: "features",
      title: "What's included",
      type: "array",
      of: [{ type: "string" }],
      group: "features",
      description: "The checklist shown on the card. Add one item per line.",
    }),
    defineField({
      name: "ctaText",
      title: "Button text",
      type: "string",
      group: "features",
      fieldset: "cta",
      description: "The wording on the sign-up button, e.g. 'Get Started'.",
      initialValue: "Get Started",
    }),
    defineField({
      name: "ctaLink",
      title: "Button link",
      type: "string",
      group: "features",
      fieldset: "cta",
      description: "Where the button takes people when clicked, e.g. '/sign-up'.",
      initialValue: "/sign-up",
    }),
    defineField({
      name: "homepageIcon",
      title: "Homepage icon",
      type: "string",
      group: "homepage",
      description: "The icon shown beside this plan in the homepage 'I'm a...' tab.",
      options: {
        list: [
          { title: "User (Sole Trader)", value: "user" },
          { title: "Building (Limited Company)", value: "building" },
          { title: "Briefcase (Contractor)", value: "briefcase" },
        ],
      },
    }),
    defineField({
      name: "homepageHeadline",
      title: "Homepage headline",
      type: "string",
      group: "homepage",
      description: "The heading in the homepage 'I'm a...' panel, e.g. 'Complete accounting for your limited company'. If left blank, a headline is created automatically from the plural label below.",
    }),
    defineField({
      name: "homepagePlural",
      title: "Plural label (for the auto headline)",
      type: "string",
      group: "homepage",
      description: "The plural form of the plan, used to build the headline when 'Homepage headline' is blank, e.g. 'limited companies', 'sole traders', 'contractors'. Always lowercase.",
    }),
    defineField({
      name: "homepageStat",
      title: "Homepage stat pill",
      type: "string",
      group: "homepage",
      description: "A short proof point shown above the features, e.g. 'Average £3,800 tax saved per year'.",
    }),
    defineField({
      name: "homepageLearnMore",
      title: "Homepage 'Learn more' link",
      type: "string",
      group: "homepage",
      description:
        "The page the homepage 'Learn more' link points to, e.g. '/limited-company'. " +
        "This also connects the plan to its service page — so a promo discount on this " +
        "plan shows its badge on that page (e.g. /limited-company, /contractor-accountancy).",
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", price: "price", popular: "popular" },
    prepare({ title, price, popular }) {
      return {
        title,
        subtitle: `${price ? `£${price}/mo` : "No price set"}${popular ? " · Most Popular" : ""}`,
      };
    },
  },
});
