import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

const routes = ["/", "/privacy", "/terms", "/support", "/delete-account", "/safety", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6
  }));
}