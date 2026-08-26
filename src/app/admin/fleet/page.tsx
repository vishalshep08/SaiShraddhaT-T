import React from "react";
import Link from "next/link";
import { Plus, Car, Layers } from "lucide-react";
import { getCMSFleetCategoriesAction, getCMSVehiclesAction } from "@/actions/cmsActions";
import { VEHICLE_CATEGORIES, OWNED_FLEET_SUMMARY } from "@/data/fleetData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminFleetPage() {
  const dbCategories = await getCMSFleetCategoriesAction();
  const dbVehicles = await getCMSVehiclesAction();

  const categories = dbCategories.length > 0
    ? dbCategories
    : VEHICLE_CATEGORIES.map((c, idx) => ({
        id: `static-${c.slug}`,
        name: c.name,
        slug: c.slug,
        seatingCapacity: c.typicalCapacity,
        minPassengers: 1,
        maxPassengers: c.maxPassengers || 6,
        luggageCapacity: c.luggageCapacity || "3-4 Bags",
        idealFor: c.features?.join(", "),
        description: c.description,
        availabilityNote: c.ownershipLabel,
        isFeatured: Boolean(c.isOwned),
        status: "published" as const,
        displayOrder: idx + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

  const vehicles = dbVehicles.length > 0
    ? dbVehicles
    : OWNED_FLEET_SUMMARY.ownedBreakdown.map((v, idx) => ({
        id: `owned-${idx}`,
        name: `${v.model} (${v.count} Vehicles)`,
        categoryName: v.model,
        seatingCapacity: v.seating.includes("6") ? 6 : 8,
        ownerType: "owned" as const,
        status: "available" as const,
        fuelType: "CNG / Petrol / Diesel",
        acType: "Dual AC",
        notes: v.usage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Fleet & Vehicle Categories CMS
            </h1>
            <Badge variant="maroon" size="sm">
              {categories.length} Categories
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage passenger seating capacities, vehicle types, owned fleet records (Ertiga & Tavera), and on-demand network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/fleet/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Vehicle Category
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Directly Owned Vehicles Card */}
      <div className="bg-brand-charcoal-900 text-white p-6 rounded-2xl border border-brand-charcoal-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-saffron tracking-wider">
              Directly Owned Core Fleet (Sai Ashram Desk)
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Sai Shraddha Dedicated Vehicles ({OWNED_FLEET_SUMMARY.totalOwnedVehicles} Total)
            </h2>
          </div>
          <Badge variant="green" size="sm">
            4 Directly Owned
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl bg-brand-charcoal-800/80 border border-brand-charcoal-700 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{v.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-semibold">
                  Directly Owned
                </span>
              </div>
              <div className="text-xs text-stone-300">
                Seating: <strong>{v.categoryName}</strong>
              </div>
              <div className="text-[11px] text-stone-400">
                {v.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Vehicle Categories Management Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
        <h2 className="text-base font-bold text-brand-charcoal-900">
          Public Vehicle Categories
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Category Name</th>
                <th className="p-4">Seating</th>
                <th className="p-4">Availability Note</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {categories.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4 font-bold text-brand-charcoal-900">
                    <Link
                      href={`/admin/fleet/${item.id}`}
                      className="hover:text-brand-maroon flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-stone-100 text-brand-charcoal-700 flex items-center justify-center shrink-0">
                        <Car className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  </td>
                  <td className="p-4 font-semibold text-stone-800 whitespace-nowrap">
                    {item.seatingCapacity}
                  </td>
                  <td className="p-4 text-stone-600">
                    {item.availabilityNote || "Subject to availability"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.isFeatured ? (
                      <span className="text-amber-600 font-bold text-[11px]">★ Featured</span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                    <Link
                      href="/fleet"
                      target="_blank"
                      className="inline-flex p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-brand-maroon transition-colors"
                      title="View Public Fleet Page"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/fleet/${item.id}`}
                      className="inline-flex px-2.5 py-1 rounded-lg bg-stone-100 font-semibold hover:bg-brand-maroon hover:text-white transition-colors text-[11px]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
