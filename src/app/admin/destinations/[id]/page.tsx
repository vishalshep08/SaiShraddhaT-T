import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getCMSDestinationByIdAction } from "@/actions/cmsActions";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { DestinationFormManager } from "@/components/admin/DestinationFormManager";
import { CMSDestinationItem } from "@/types/cms";

export const dynamic = "force-dynamic";

interface AdminDestinationEditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminDestinationEditPage({
  params,
}: AdminDestinationEditPageProps) {
  const isNew = params.id === "new";
  let destination: Partial<CMSDestinationItem> = {
    id: "new",
    name: "",
    slug: "",
    origin: "Shirdi",
    shortDescription: "",
    fullDescription: "",
    highlights: [],
    isPopular: false,
    isFeatured: false,
    status: "published",
    displayOrder: 0,
  };

  if (!isNew) {
    if (params.id.startsWith("static-")) {
      const slug = params.id.replace("static-", "");
      const foundStatic = DESTINATIONS_DATA.find((d) => d.slug === slug);
      if (foundStatic) {
        destination = {
          id: params.id,
          name: foundStatic.name,
          slug: foundStatic.slug,
          origin: "Shirdi",
          approxTravelTime: foundStatic.approxDurationText,
          shortDescription: foundStatic.shortDescription,
          fullDescription: foundStatic.fullOverview,
          highlights: foundStatic.keyAttractions,
          isPopular: true,
          isFeatured: true,
          status: "published",
          displayOrder: 1,
          seoTitle: foundStatic.seoTitle,
          metaDescription: foundStatic.seoDescription,
        };
      }
    } else {
      const dbDest = await getCMSDestinationByIdAction(params.id);
      if (dbDest) {
        destination = dbDest;
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
          <Link href="/admin/destinations" className="hover:text-brand-charcoal-900">
            Destinations
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "New Destination" : destination.name || "Edit Destination"}
          </span>
        </nav>

        <Link
          href="/admin/destinations"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Destinations</span>
        </Link>
      </div>

      <DestinationFormManager initialData={destination} />
    </div>
  );
}
