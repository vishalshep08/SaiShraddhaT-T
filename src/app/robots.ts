import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = BUSINESS_CONFIG.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
