import type { MetadataRoute } from "next";

import { buildUrl } from "@/lib/utils/urls";

/**
 * Robots.txt configuration for Builder Vancouver
 * Controls search engine crawling and sitemap location
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: buildUrl("/sitemap.xml"),
  };
}
