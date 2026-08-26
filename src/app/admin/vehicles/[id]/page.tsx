import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getVehicleByIdAction } from "@/actions/bookingActions";
import { VehicleFormManager } from "@/components/admin/VehicleFormManager";

export const dynamic = "force-dynamic";

interface AdminVehicleDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminVehicleDetailPage({
  params,
}: AdminVehicleDetailPageProps) {
  const isNew = params.id === "new";
  const vehicle = isNew ? null : await getVehicleByIdAction(params.id);

  if (!isNew && !vehicle) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/admin/dashboard" className="hover:text-brand-charcoal-900">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/admin/vehicles" className="hover:text-brand-charcoal-900">
            Vehicles
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "Add Vehicle" : vehicle?.displayName || vehicle?.name}
          </span>
        </nav>

        <Link
          href="/admin/vehicles"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Vehicles</span>
        </Link>
      </div>

      <VehicleFormManager vehicle={vehicle} />
    </div>
  );
}
