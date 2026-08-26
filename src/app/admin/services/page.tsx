import React from "react";
import Link from "next/link";
import { Plus, Car, ExternalLink } from "lucide-react";
import { getCMSServicesAction } from "@/actions/cmsActions";
import { SERVICES_DATA } from "@/data/servicesData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const dbServices = await getCMSServicesAction();

  const services = dbServices.length > 0
    ? dbServices
    : SERVICES_DATA.map((s, idx) => ({
        id: `static-${s.slug}`,
        title: s.title,
        slug: s.slug,
        serviceCategory: s.category,
        shortDescription: s.shortDescription,
        fullDescription: s.fullOverview,
        iconName: s.iconName,
        isFeatured: true,
        status: "published" as const,
        displayOrder: idx + 1,
        seoTitle: s.seoTitle,
        metaDescription: s.seoDescription,
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
              Services CMS
            </h1>
            <Badge variant="maroon" size="sm">
              {services.length} Services
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage public service offerings, descriptions, SEO metadata, and publishing status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/services/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {services.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4 font-bold text-brand-charcoal-900">
                    <Link
                      href={`/admin/services/${item.id}`}
                      className="hover:text-brand-maroon flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center shrink-0">
                        <Car className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.title}</span>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium capitalize">
                      {item.serviceCategory}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-stone-500">
                    /services/{item.slug}
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
                      href={`/services/${item.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-brand-maroon transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/services/${item.id}`}
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
