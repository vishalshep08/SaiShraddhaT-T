import React from "react";
import Link from "next/link";
import { Plus, MapPin, ExternalLink } from "lucide-react";
import { getCMSDestinationsAction } from "@/actions/cmsActions";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const dbDestinations = await getCMSDestinationsAction();

  const destinations = dbDestinations.length > 0
    ? dbDestinations
    : DESTINATIONS_DATA.map((d, idx) => ({
        id: `static-${d.slug}`,
        name: d.name,
        slug: d.slug,
        origin: "Shirdi",
        approxTravelTime: d.approxDurationText,
        shortDescription: d.shortDescription,
        fullDescription: d.fullOverview,
        highlights: d.keyAttractions,
        isPopular: true,
        isFeatured: true,
        status: "published" as const,
        displayOrder: idx + 1,
        seoTitle: d.seoTitle,
        metaDescription: d.seoDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Destinations CMS
            </h1>
            <Badge variant="maroon" size="sm">
              {destinations.length} Destinations
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage pilgrimage & outstation destination guides, travel times, and highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/destinations/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Destination
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Destination</th>
                <th className="p-4">Origin</th>
                <th className="p-4">Travel Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {destinations.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4 font-bold text-brand-charcoal-900">
                    <Link
                      href={`/admin/destinations/${item.id}`}
                      className="hover:text-brand-maroon flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  </td>
                  <td className="p-4 font-medium text-stone-600">
                    {item.origin || "Shirdi"}
                  </td>
                  <td className="p-4 text-stone-600">
                    {item.approxTravelTime || "—"}
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
                      href={`/destinations/${item.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-brand-maroon transition-colors"
                      title="View Public Guide"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/destinations/${item.id}`}
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
