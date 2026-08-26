import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getCMSRouteByIdAction } from "@/actions/cmsActions";
import { ROUTES_DATA } from "@/data/routesData";
import { RouteFormManager } from "@/components/admin/RouteFormManager";
import { CMSRouteItem } from "@/types/cms";

export const dynamic = "force-dynamic";

interface AdminRouteEditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminRouteEditPage({
  params,
}: AdminRouteEditPageProps) {
  const isNew = params.id === "new";
  let route: Partial<CMSRouteItem> = {
    id: "new",
    title: "",
    slug: "",
    origin: "Shirdi",
    destination: "",
    shortDescription: "",
    fullDescription: "",
    tripType: "one_way",
    vehicleCategories: [
      "Sedan (Dzire / Etios)",
      "SUV / MUV (Ertiga / Tavera)",
      "Tempo Traveller (13-26 Seater)",
    ],
    isPopular: false,
    isFeatured: false,
    status: "published",
    displayOrder: 0,
  };

  if (!isNew) {
    if (params.id.startsWith("static-")) {
      const slug = params.id.replace("static-", "");
      const foundStatic = ROUTES_DATA.find((r) => r.slug === slug);
      if (foundStatic) {
        route = {
          id: params.id,
          title: foundStatic.headline,
          slug: foundStatic.slug,
          origin: foundStatic.origin,
          destination: foundStatic.destinationName,
          shortDescription: foundStatic.shortDescription,
          fullDescription: foundStatic.routeOverview,
          approxTravelTime: foundStatic.approxDurationText,
          tripType: "one_way",
          vehicleCategories: ["Sedan", "SUV / MUV (Ertiga / Tavera)", "Tempo Traveller"],
          isPopular: true,
          isFeatured: true,
          status: "published",
          displayOrder: 1,
          seoTitle: foundStatic.seoTitle,
          metaDescription: foundStatic.seoDescription,
        };
      }
    } else {
      const dbRoute = await getCMSRouteByIdAction(params.id);
      if (dbRoute) {
        route = dbRoute;
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/admin/dashboard" className="hover:text-brand-charcoal-900">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/admin/routes" className="hover:text-brand-charcoal-900">
            Routes
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "New Route" : route.title || "Edit Route"}
          </span>
        </nav>

        <Link
          href="/admin/routes"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Routes</span>
        </Link>
      </div>

      <RouteFormManager initialData={route} />
    </div>
  );
}
