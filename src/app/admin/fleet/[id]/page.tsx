import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getCMSFleetCategoriesAction } from "@/actions/cmsActions";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { FleetCategoryFormManager } from "@/components/admin/FleetCategoryFormManager";
import { CMSVehicleCategoryItem } from "@/types/cms";

export const dynamic = "force-dynamic";

interface AdminFleetEditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminFleetEditPage({
  params,
}: AdminFleetEditPageProps) {
  const isNew = params.id === "new";
  let category: Partial<CMSVehicleCategoryItem> = {
    id: "new",
    name: "",
    slug: "",
    seatingCapacity: "6+1 Seater",
    minPassengers: 1,
    maxPassengers: 6,
    luggageCapacity: "3-4 Bags",
    idealFor: "",
    description: "",
    availabilityNote: "Subject to availability",
    isFeatured: false,
    status: "published",
    displayOrder: 0,
  };

  if (!isNew) {
    if (params.id.startsWith("static-")) {
      const slug = params.id.replace("static-", "");
      const foundStatic = VEHICLE_CATEGORIES.find((c) => c.slug === slug);
      if (foundStatic) {
        category = {
          id: params.id,
          name: foundStatic.name,
          slug: foundStatic.slug,
          seatingCapacity: foundStatic.typicalCapacity,
          minPassengers: 1,
          maxPassengers: foundStatic.maxPassengers || 6,
          luggageCapacity: foundStatic.luggageCapacity || "3-4 Bags",
          idealFor: foundStatic.features?.join(", "),
          description: foundStatic.description,
          availabilityNote: foundStatic.ownershipLabel,
          isFeatured: Boolean(foundStatic.isOwned),
          status: "published",
          displayOrder: 1,
        };
      }
    } else {
      const allCategories = await getCMSFleetCategoriesAction();
      const foundDb = allCategories.find((c) => c.id === params.id);
      if (foundDb) {
        category = foundDb;
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
          <Link href="/admin/fleet" className="hover:text-brand-charcoal-900">
            Fleet
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "New Category" : category.name || "Edit Category"}
          </span>
        </nav>

        <Link
          href="/admin/fleet"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fleet</span>
        </Link>
      </div>

      <FleetCategoryFormManager initialData={category} />
    </div>
  );
}
