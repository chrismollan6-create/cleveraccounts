import { definePlugin } from "sanity";
import { BarChart2 } from "lucide-react";
import { PerformanceDashboard } from "./PerformanceDashboard";

/**
 * Registers the Performance Dashboard as a first-class Studio tool.
 * Shows up in the left sidebar of the Studio next to Content and Vision.
 */
export const dashboardPlugin = definePlugin({
  name: "performance-dashboard",
  tools: [
    {
      name: "performance",
      title: "Performance",
      icon: BarChart2,
      component: PerformanceDashboard,
    },
  ],
});
