"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SERVICES_DATA } from "@/data/servicesData";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { ROUTES_DATA } from "@/data/routesData";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";

export interface SEOIssueItem {
  type: "service" | "destination" | "route" | "package" | "fleet";
  id: string;
  title: string;
  slug: string;
  missingFields: string[];
  editUrl: string;
  publicUrl: string;
  status: "published" | "draft" | "archived";
}

export interface SEOHealthReport {
  totalPages: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
  missingTitleCount: number;
  missingDescriptionCount: number;
  issues: SEOIssueItem[];
}

export async function getSEOHealthReportAction(): Promise<SEOHealthReport> {
  try {
    const supabase = createSupabaseServerClient();

    let services: any[] = [];
    let destinations: any[] = [];
    let routes: any[] = [];
    let packages: any[] = [];
    let categories: any[] = [];

    if (supabase) {
      const [sRes, dRes, rRes, pRes, cRes] = await Promise.all([
        (supabase.from("services") as any).select("*"),
        (supabase.from("destinations") as any).select("*"),
        (supabase.from("routes") as any).select("*"),
        (supabase.from("packages") as any).select("*"),
        (supabase.from("vehicle_categories") as any).select("*"),
      ]);
      services = sRes.data || [];
      destinations = dRes.data || [];
      routes = rRes.data || [];
      packages = pRes.data || [];
      categories = cRes.data || [];
    }

    // Fall back to constants if DB empty
    if (services.length === 0) {
      services = SERVICES_DATA.map((s) => ({
        id: `static-${s.slug}`,
        title: s.title,
        slug: s.slug,
        seo_title: s.seoTitle,
        meta_description: s.seoDescription,
        status: "published",
      }));
    }

    if (destinations.length === 0) {
      destinations = DESTINATIONS_DATA.map((d) => ({
        id: `static-${d.slug}`,
        title: d.name,
        slug: d.slug,
        seo_title: d.seoTitle,
        meta_description: d.seoDescription,
        status: "published",
      }));
    }

    if (routes.length === 0) {
      routes = ROUTES_DATA.map((r) => ({
        id: `static-${r.slug}`,
        title: r.headline,
        slug: r.slug,
        seo_title: r.seoTitle,
        meta_description: r.seoDescription,
        status: "published",
      }));
    }

    if (packages.length === 0) {
      packages = TOUR_PACKAGES_DATA.map((p) => ({
        id: `static-${p.slug}`,
        title: p.title,
        slug: p.slug,
        seo_title: p.seoTitle,
        meta_description: p.seoDescription,
        status: "published",
      }));
    }

    if (categories.length === 0) {
      categories = VEHICLE_CATEGORIES.map((c) => ({
        id: `static-${c.slug}`,
        title: c.name,
        slug: c.slug,
        seo_title: `${c.name} | Sai Shraddha Fleet`,
        meta_description: c.description,
        status: "published",
      }));
    }

    const allItems: { type: "service" | "destination" | "route" | "package" | "fleet"; item: any; editPrefix: string; publicPrefix: string }[] = [
      ...services.map((i) => ({ type: "service" as const, item: i, editPrefix: "/admin/services", publicPrefix: "/services" })),
      ...destinations.map((i) => ({ type: "destination" as const, item: i, editPrefix: "/admin/destinations", publicPrefix: "/destinations" })),
      ...routes.map((i) => ({ type: "route" as const, item: i, editPrefix: "/admin/routes", publicPrefix: "/routes" })),
      ...packages.map((i) => ({ type: "package" as const, item: i, editPrefix: "/admin/tours", publicPrefix: "/packages" })),
      ...categories.map((i) => ({ type: "fleet" as const, item: i, editPrefix: "/admin/fleet", publicPrefix: "/fleet" })),
    ];

    let publishedCount = 0;
    let draftCount = 0;
    let archivedCount = 0;
    let missingTitleCount = 0;
    let missingDescriptionCount = 0;
    const issues: SEOIssueItem[] = [];

    allItems.forEach(({ type, item, editPrefix, publicPrefix }) => {
      const status = item.status || "published";
      if (status === "published") publishedCount++;
      else if (status === "draft") draftCount++;
      else if (status === "archived") archivedCount++;

      const missing: string[] = [];
      const title = item.title || item.name || item.headline || "Untitled";
      const seoTitle = item.seo_title || item.seoTitle;
      const metaDesc = item.meta_description || item.seo_description || item.seoDescription;

      if (!seoTitle || !seoTitle.trim()) {
        missing.push("SEO Title Missing");
        if (status === "published") missingTitleCount++;
      }
      if (!metaDesc || !metaDesc.trim()) {
        missing.push("Meta Description Missing");
        if (status === "published") missingDescriptionCount++;
      }

      if (missing.length > 0) {
        issues.push({
          type,
          id: item.id,
          title,
          slug: item.slug,
          missingFields: missing,
          editUrl: `${editPrefix}/${item.id}`,
          publicUrl: `${publicPrefix}/${item.slug}`,
          status,
        });
      }
    });

    return {
      totalPages: allItems.length,
      publishedCount,
      draftCount,
      archivedCount,
      missingTitleCount,
      missingDescriptionCount,
      issues,
    };
  } catch (err) {
    console.error("[SEO Health Error]:", err);
    return {
      totalPages: 0,
      publishedCount: 0,
      draftCount: 0,
      archivedCount: 0,
      missingTitleCount: 0,
      missingDescriptionCount: 0,
      issues: [],
    };
  }
}
