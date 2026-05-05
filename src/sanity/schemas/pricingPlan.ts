import { defineType, defineField } from "sanity";

export default defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Plan Name",
      type: "string",
      description: "e.g. 'Sole Trader', 'Limited Company', 'Contractor'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "e.g. 'Perfect for self-employed'",
    }),
    defineField({
      name: "price",
      title: "Monthly Price",
      type: "string",
      description: "e.g. '42.50' (just the number, no £ symbol)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "string",
      description: "e.g. '+ VAT' or 'excl. VAT'",
      initialValue: "+ VAT where applicable",
    }),
    defineField({
      name: "popular",
      title: "Most Popular?",
      type: "boolean",
      description: "Shows 'Most Popular' badge",
      initialValue: false,
    }),
    defineField({
      name: "features",
      title: "Features Included",
      type: "array",
      of: [{ type: "string" }],
      description: "One feature per line",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
      initialValue: "Get Started",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Button Link",
      type: "string",
      initialValue: "/sign-up",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Left to right: 1, 2, 3",
    }),
    defineField({
      name: "homepageIcon",
      title: "Homepage Icon",
      type: "string",
      description: "Icon shown in the homepage 'I'm a...' tab",
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
      title: "Homepage Headline",
      type: "string",
      description: "Headline shown in the homepage 'I'm a...' panel, e.g. 'Complete accounting for your limited company'",
    }),
    defineField({
      name: "homepageStat",
      title: "Homepage Stat",
      type: "string",
      description: "Stat pill shown above features, e.g. 'Average £3,800 tax saved per year'",
    }),
    defineField({
      name: "homepageLearnMore",
      title: "Homepage 'Learn More' Link",
      type: "string",
      description: "Page the 'Learn more' link points to, e.g. '/limited-company'",
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "price" },
    prepare({ title, subtitle }) {
      return { title, subtitle: `£${subtitle}/mo` };
    },
  },
});
