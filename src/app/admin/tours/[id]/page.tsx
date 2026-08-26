import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getCMSTourByIdAction } from "@/actions/cmsActions";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";
import { TourFormManager } from "@/components/admin/TourFormManager";
import { CMSTourPackageItem } from "@/types/cms";

export const dynamic = "force-dynamic";

interface AdminTourEditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminTourEditPage({
  params,
}: AdminTourEditPageProps) {
  const isNew = params.id === "new";
  let tour: Partial<CMSTourPackageItem> = {
    id: "new",
    title: "",
    slug: "",
    duration: "1 Day",
    startingLocation: "Shirdi",
    destinationsIncluded: ["Shirdi"],
    shortDescription: "",
    fullDescription: "",
    itinerary: [
      { day: 1, title: "Day 1: Darshan & Sightseeing", description: "Departure from Shirdi hotel..." },
    ],
    inclusions: ["Dedicated AC Vehicle", "Driver Allowance", "Toll & Parking"],
    exclusions: ["Temple VIP Darshan Pass", "Hotel Accommodation", "Food & Meals"],
    isFeatured: false,
    status: "published",
    displayOrder: 0,
  };

  if (!isNew) {
    if (params.id.startsWith("static-")) {
      const slug = params.id.replace("static-", "");
      const foundStatic = TOUR_PACKAGES_DATA.find((t) => t.slug === slug);
      if (foundStatic) {
        tour = {
          id: params.id,
          title: foundStatic.title,
          slug: foundStatic.slug,
          duration: foundStatic.durationText,
          startingLocation: "Shirdi",
          destinationsIncluded: foundStatic.destinationsCovered,
          startingFare: undefined,
          shortDescription: foundStatic.shortDescription,
          fullDescription: foundStatic.fullOverview,
          itinerary: [
            { day: 1, title: "Day 1: Darshan Circuit", description: foundStatic.shortDescription },
          ],
          inclusions: ["Dedicated AC Cab", "Driver Allowance", "Toll & Parking"],
          exclusions: ["VIP Darshan Passes", "Personal Meals", "Hotel Stay"],
          isFeatured: true,
          status: "published",
          displayOrder: 1,
          seoTitle: foundStatic.seoTitle,
          metaDescription: foundStatic.seoDescription,
        };
      }
    } else {
      const dbTour = await getCMSTourByIdAction(params.id);
      if (dbTour) {
        tour = dbTour;
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
          <Link href="/admin/tours" className="hover:text-brand-charcoal-900">
            Tours & Packages
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "New Tour Package" : tour.title || "Edit Tour"}
          </span>
        </nav>

        <Link
          href="/admin/tours"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tours</span>
        </Link>
      </div>

      <TourFormManager initialData={tour} />
    </div>
  );
}
