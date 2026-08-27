"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink, Save } from "lucide-react";
import { CMSServiceItem, ContentStatus } from "@/types/cms";
import { saveCMSServiceAction } from "@/actions/cmsActions";
import { Button } from "@/components/ui/Button";

interface ServiceFormManagerProps {
  initialData: Partial<CMSServiceItem>;
}

export function ServiceFormManager({ initialData }: ServiceFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<CMSServiceItem>>({
    id: initialData.id,
    title: initialData.title || "",
    slug: initialData.slug || "",
    serviceCategory: initialData.serviceCategory || "Outstation",
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",
    iconName: initialData.iconName || "Car",
    featuredImageUrl: initialData.featuredImageUrl || "",
    imageAltText: initialData.imageAltText || "",
    isFeatured: Boolean(initialData.isFeatured),
    status: initialData.status || "published",
    displayOrder: initialData.displayOrder || 0,
    seoTitle: initialData.seoTitle || "",
    metaDescription: initialData.metaDescription || "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !initialData.id || initialData.id === "new"
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        : prev.slug,
    }));
  };

  const handleSubmit = (statusToSave?: ContentStatus) => {
    setMessage(null);
    const payload = {
      ...formData,
      status: statusToSave || formData.status,
    };

    startTransition(async () => {
      const res = await saveCMSServiceAction(payload);
      if (res.success) {
        setMessage({ type: "success", text: "Service saved and published successfully." });
        router.refresh();
        if (res.id && (initialData.id === "new" || initialData.id?.startsWith("static-"))) {
          setFormData((prev) => ({ ...prev, id: res.id }));
          router.push(`/admin/services/${res.id}`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save service." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Content Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Airport Transfer"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-stone-100 border border-r-0 border-stone-200 text-stone-500 text-xs rounded-l-xl font-mono">
                    /services/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="airport-transfer"
                    className="w-full px-3 py-2 rounded-r-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Category
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, serviceCategory: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                >
                  <option value="Local">Local (Shirdi Local & Temple)</option>
                  <option value="Sightseeing">Sightseeing / Day Excursion</option>
                  <option value="Outstation">Outstation Cab</option>
                  <option value="Airport Transfer">Airport Transfer (Shirdi SAG / Pune / Mumbai)</option>
                  <option value="Pilgrimage">Pilgrimage Darshan Tour</option>
                  <option value="Group Transportation">Group Transportation</option>
                  <option value="Corporate">Corporate & Event Travel</option>
                  <option value="Custom Tour">Customized Tour</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-brand-charcoal-900">
                Short Description (Shown on cards & previews) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Direct pickup & drop service between Shirdi and Shirdi Airport (SAG), Pune, or Mumbai airports..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
            </div>
          </div>

          {/* Section 2: Full Detailed Content */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. Full Page Content
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal-900">
                Detailed Service Description
              </label>
              <textarea
                rows={6}
                value={formData.fullDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullDescription: e.target.value,
                  }))
                }
                placeholder="Comprehensive service details explaining vehicle options, clean AC interiors, transparent pricing, and punctual driver commitments..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
            </div>
          </div>

          {/* Section 3: SEO Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              3. Search Engine Optimization (SEO)
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  SEO Title (Appears in Google search results)
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
                  }
                  placeholder="e.g. Shirdi Airport Taxi & Drop Service | Sai Shraddha Travels"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Meta Description (Summary snippet in search engines)
                </label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="Book reliable AC cabs for Shirdi Airport (SAG), Pune and Mumbai with punctual pickup and transparent pricing since 2014."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Publishing Controls & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Publishing Controls
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as ContentStatus,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                >
                  <option value="published">✓ Published (Visible to Public)</option>
                  <option value="draft">● Draft (Admin Only)</option>
                  <option value="archived">Archived (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Feature on Homepage
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <Button
                type="button"
                size="md"
                variant="primary"
                disabled={isPending}
                onClick={() => handleSubmit("published")}
                className="w-full font-bold text-xs"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isPending ? "Saving..." : "Save & Publish"}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleSubmit("draft")}
                className="w-full text-xs font-semibold"
              >
                Save as Draft
              </Button>
            </div>

            {formData.slug && (
              <div className="pt-2 border-t border-stone-100">
                <a
                  href={`/services/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                >
                  <span>Preview Public Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
