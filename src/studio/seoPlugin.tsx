import { definePlugin } from "sanity";
import { Search } from "lucide-react";
import { SEODashboard } from "./SEODashboard";

export { SEODocumentView } from "./SEODocumentView";

export const seoPlugin = definePlugin({
  name: "seo-plugin",
  tools: [
    {
      name: "seo",
      title: "SEO",
      icon: Search,
      component: SEODashboard,
    },
  ],
});
