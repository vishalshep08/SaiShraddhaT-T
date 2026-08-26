import React from "react";
import Link from "next/link";
import { Plus, Compass, ExternalLink } from "lucide-react";
import { getCMSToursAction } from "@/actions/cmsActions";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const dbTours = await getCMSToursAction();

  const tours = dbTours.length > 0
    ? dbTours
    : TOUR_PACKAGES_DATA.map((t, idx) => ({
        id: `static-${t.slug}`,
        title: t.title,
        slug: t.slug,
        duration: t.durationText,
        startingLocation: "Shirdi",
        destinationsIncluded: t.destinationsCovered,
        startingFare: undefined,
        shortDescription: t.shortDescription,
        fullDescription: t.fullOverview,
        isFeatured: true,
        status: "published" as const,
        displayOrder: idx + 1,
        seoTitle: t.seoTitle,
        metaDescription: t.seoDescription,
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
              Tours & Pilgrimage Packages CMS
            </h1>
            <Badge variant="maroon" size="sm">
              {tours.length} Tours
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage pilgrimage darshan packages, itineraries, starting fares, and included destinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/tours/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Tour Package
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
                <th className="p-4">Tour Name</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Destinations</th>
                <th className="p-4">Starting Fare</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {tours.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4 font-bold text-brand-charcoal-900">
                    <Link
                      href={`/admin/tours/${item.id}`}
                      className="hover:text-brand-maroon flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div>{item.title}</div>
                        <div className="text-[10px] font-mono text-stone-400 font-normal">
                          /packages/{item.slug}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-4 font-semibold text-stone-700 whitespace-nowrap">
                    {item.duration}
                  </td>
                  <td className="p-4 text-stone-600">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.destinationsIncluded?.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600"
                        >
                          {d}
                        </span>
                      ))}
                      {(item.destinationsIncluded?.length || 0) > 3 && (
                        <span className="text-[10px] text-stone-400">+more</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-brand-charcoal-900 whitespace-nowrap">
                    {item.startingFare ? `₹${item.startingFare}` : "On Request"}
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
                      href={`/packages/${item.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-brand-maroon transition-colors"
                      title="View Public Package"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/tours/${item.id}`}
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
