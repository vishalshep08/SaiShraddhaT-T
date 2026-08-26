import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/seo";
import { SERVICES_DATA } from "@/data/servicesData";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { ROUTES_DATA } from "@/data/routesData";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url.replace(/\/+$/, "");
  const now = new Date();

  // Core static landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/routes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fleet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-quote`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic service detail routes
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES_DATA.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic destination routes
  const destinationRoutes: MetadataRoute.Sitemap = DESTINATIONS_DATA.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic route pages (high commercial SEO priority)
  const routePages: MetadataRoute.Sitemap = ROUTES_DATA.map((r) => ({
    url: `${baseUrl}/routes/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // Dynamic package & tour routes
  const packageRoutes: MetadataRoute.Sitemap = TOUR_PACKAGES_DATA.map((p) => ({
    url: `${baseUrl}/packages/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const tourRoutes: MetadataRoute.Sitemap = TOUR_PACKAGES_DATA.map((p) => ({
    url: `${baseUrl}/tours/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...destinationRoutes,
    ...routePages,
    ...packageRoutes,
    ...tourRoutes,
  ];
}
