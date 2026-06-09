/**
 * Representative list of UK business sectors for the homepage "breadth"
 * showcase — communicates "we work with all sorts of businesses".
 *
 * PLACEHOLDER list (~40 common UK trades). Swap for the real export from
 * Salesforce — the distinct set of Account industries/sectors across the
 * client base. SECTORS ONLY, never client company names (confidentiality).
 *
 * Suggested export:
 *   SELECT Industry, COUNT(Id) FROM Account
 *   WHERE Branding__c IN ('Workwell','Clever Accounts')
 *   GROUP BY Industry ORDER BY COUNT(Id) DESC
 */
export const SHOWCASE_SECTORS: string[] = [
  "Plumbing",
  "Electrical",
  "Construction",
  "Building & Trades",
  "IT Consultancy",
  "Software Development",
  "Web Design",
  "Graphic Design",
  "Marketing & PR",
  "Social Media",
  "Hospitality",
  "Cafés & Restaurants",
  "Catering",
  "Hair & Beauty",
  "Dentistry",
  "Healthcare",
  "Physiotherapy",
  "Recruitment",
  "Couriers & Delivery",
  "Taxi & Private Hire",
  "HGV & Logistics",
  "E-commerce",
  "Retail",
  "Photography",
  "Videography",
  "Architecture",
  "Engineering",
  "Property & Lettings",
  "Cleaning Services",
  "Landscaping & Gardening",
  "Fitness & Personal Training",
  "Coaching & Consultancy",
  "Legal Services",
  "Financial Advisers",
  "Event Management",
  "Carpentry & Joinery",
  "Roofing",
  "Painting & Decorating",
  "Manufacturing",
  "Childcare",
  "Tutoring & Education",
  "Interior Design",
  "Florists",
  "Mechanics & Garages",
  "Veterinary",
];
