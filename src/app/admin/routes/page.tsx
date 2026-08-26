import React from "react";
import Link from "next/link";
import { Plus, Route, ExternalLink } from "lucide-react";
import { getCMSRoutesAction } from "@/actions/cmsActions";
import { ROUTES_DATA } from "@/data/routesData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminRoutesPage() {
  const dbRoutes = await getCMSRoutesAction();

  const routes = dbRoutes.length > 0
    ? dbRoutes
    : ROUTES_DATA.map((r, idx) => ({
        id: `static-${r.slug}`,
        title: r.headline,
        slug: r.slug,
        origin: r.origin,
        destination: r.destinationName,
        shortDescription: r.shortDescription,
        fullDescription: r.routeOverview,
        approxTravelTime: r.approxDurationText,
        startingFare: undefined,
        tripType: "one_way",
        vehicleCategories: ["Sedan", "SUV / MUV", "Tempo Traveller"],
        isPopular: true,
        isFeatured: true,
        status: "published" as const,
        displayOrder: idx + 1,
        seoTitle: r.seoTitle,
        metaDescription: r.seoDescription,
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
              Outstation Routes CMS
            </h1>
            <Badge variant="maroon" size="sm">
              {routes.length} Routes
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage high-intent SEO route pages from Shirdi with distance estimates, starting fares, and vehicle options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/routes/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Route
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
                <th className="p-4">Route</th>
                <th className="p-4">Travel Time</th>
                <th className="p-4">Starting Fare</th>
                <th className="p-4">Status</th>
                <th className="p-4">Popular</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {routes.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4 font-bold text-brand-charcoal-900">
                    <Link
                      href={`/admin/routes/${item.id}`}
                      className="hover:text-brand-maroon flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Route className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div>{item.title}</div>
                        <div className="text-[10px] font-mono text-stone-400 font-normal">
                          /routes/{item.slug}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-4 text-stone-600 whitespace-nowrap">
                    {item.approxTravelTime || "—"}
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
                    {item.isPopular ? (
                      <span className="text-amber-600 font-bold text-[11px]">★ Popular</span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                    <Link
                      href={`/routes/${item.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-brand-maroon transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/routes/${item.id}`}
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
