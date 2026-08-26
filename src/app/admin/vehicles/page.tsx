import React from "react";
import Link from "next/link";
import {
  Plus,
  Car,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wrench,
  Edit,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getVehiclesListAction } from "@/actions/bookingActions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface VehiclesPageProps {
  searchParams: {
    type?: string;
  };
}

export default async function AdminVehiclesPage({ searchParams }: VehiclesPageProps) {
  const allVehicles = await getVehiclesListAction();
  const currentType = searchParams.type || "all";

  const vehicles = allVehicles.filter((v) => {
    if (currentType === "all") return true;
    return v.ownerType === currentType;
  });

  const ownedCount = allVehicles.filter((v) => v.ownerType === "owned").length;
  const partnerCount = allVehicles.filter((v) => v.ownerType === "partner_network").length;
  const availableCount = allVehicles.filter((v) => v.status === "available" && v.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Fleet &amp; Vehicles
            </h1>
            <Badge variant="maroon" size="sm">
              {allVehicles.length} Registered
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage owned (3 Ertiga, 1 Tavera) and partner vehicles for trip dispatch and assignment.
          </p>
        </div>

        <Link href="/admin/vehicles/new">
          <Button variant="primary" size="md" className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Fleet</p>
          <p className="text-xl font-extrabold text-brand-charcoal-900 mt-0.5">{allVehicles.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Owned Fleet</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{ownedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Partner / On-Demand</p>
          <p className="text-xl font-extrabold text-amber-700 mt-0.5">{partnerCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Available Now</p>
          <p className="text-xl font-extrabold text-brand-maroon mt-0.5">{availableCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <Link
          href="/admin/vehicles"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentType === "all"
              ? "bg-brand-maroon text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          All Vehicles ({allVehicles.length})
        </Link>
        <Link
          href="/admin/vehicles?type=owned"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentType === "owned"
              ? "bg-brand-maroon text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Owned Fleet ({ownedCount})
        </Link>
        <Link
          href="/admin/vehicles?type=partner_network"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentType === "partner_network"
              ? "bg-brand-maroon text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Partner / External ({partnerCount})
        </Link>
      </div>

      {/* Vehicles List */}
      {vehicles.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <Car className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-700">No vehicles registered yet.</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Add your owned vehicles (e.g. 3 Maruti Ertiga, 1 Chevrolet Tavera) or external partner vehicles.
          </p>
          <Link href="/admin/vehicles/new" className="inline-block pt-2">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add First Vehicle
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const isOwned = v.ownerType === "owned";
            const primaryImg = v.images && v.images.length > 0 ? v.images[0].url : v.imageUrl;
            return (
              <div
                key={v.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Photo Preview & Badges */}
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {primaryImg ? (
                        <img
                          src={primaryImg}
                          alt={v.altText || v.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car className="w-6 h-6 text-stone-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-sm sm:text-base text-brand-charcoal-900 leading-tight truncate">
                          {v.displayName || v.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isOwned
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isOwned ? "Owned" : "Partner"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-medium text-stone-500">
                          {v.categoryName || `${v.seatingCapacity} Seater`}
                        </span>
                        {v.showInHero && (
                          <span className="text-[9px] font-bold bg-brand-maroon-50 text-brand-maroon border border-brand-maroon-200 px-1.5 py-0.2 rounded">
                            Hero Showcase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Capacity</span>
                      <span className="font-semibold">{v.seatingCapacity} Passengers</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Registration</span>
                      <span className="font-mono font-semibold">
                        {v.registrationNumber || <span className="text-stone-400 font-sans italic">Not set</span>}
                      </span>
                    </div>
                  </div>

                  {v.description && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg line-clamp-2">
                      {v.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        v.status === "available" && v.isActive
                          ? "bg-emerald-500"
                          : v.status === "maintenance"
                          ? "bg-amber-500"
                          : "bg-stone-400"
                      }`}
                    />
                    <span className="text-xs font-semibold capitalize text-stone-700">
                      {v.isActive ? v.status.replace("_", " ") : "Inactive"}
                    </span>
                  </div>

                  <Link href={`/admin/vehicles/${v.id}`}>
                    <Button variant="outline" size="sm" className="text-xs py-1 h-7 font-bold">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
