"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Save, ExternalLink } from "lucide-react";
import { CMSRouteItem, ContentStatus } from "@/types/cms";
import { saveCMSRouteAction } from "@/actions/cmsActions";
import { Button } from "@/components/ui/Button";

interface RouteFormManagerProps {
  initialData: Partial<CMSRouteItem>;
}

export function RouteFormManager({ initialData }: RouteFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<CMSRouteItem>>({
    id: initialData.id,
    title: initialData.title || "",
    slug: initialData.slug || "",
    origin: initialData.origin || "Shirdi",
    destination: initialData.destination || "",
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",
    approxDistanceKm: initialData.approxDistanceKm,
    approxTravelTime: initialData.approxTravelTime || "",
    startingFare: initialData.startingFare,
    tripType: initialData.tripType || "one_way",
    vehicleCategories: initialData.vehicleCategories || [
      "Sedan (Dzire / Etios)",
      "SUV / MUV (Ertiga / Tavera)",
      "Tempo Traveller (13-26 Seater)",
    ],
    isPopular: Boolean(initialData.isPopular),
    isFeatured: Boolean(initialData.isFeatured),
    status: initialData.status || "published",
    displayOrder: initialData.displayOrder || 0,
    seoTitle: initialData.seoTitle || "",
    metaDescription: initialData.metaDescription || "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDestinationChange = (destVal: string) => {
    const originVal = formData.origin || "Shirdi";
    const computedTitle = `${originVal} to ${destVal} Cab / Taxi`;
    const computedSlug = !initialData.id || initialData.id === "new"
      ? `${originVal}-to-${destVal}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : formData.slug;

    setFormData((prev) => ({
      ...prev,
      destination: destVal,
      title: !initialData.id || initialData.id === "new" ? computedTitle : prev.title,
      slug: computedSlug,
    }));
  };

  const handleSubmit = (statusToSave?: ContentStatus) => {
    setMessage(null);
    const payload = {
      ...formData,
      status: statusToSave || formData.status,
    };

    startTransition(async () => {
      const res = await saveCMSRouteAction(payload);
      if (res.success) {
        setMessage({ type: "success", text: "Route saved and published successfully." });
        router.refresh();
        if (res.id && (initialData.id === "new" || initialData.id?.startsWith("static-"))) {
          setFormData((prev) => ({ ...prev, id: res.id }));
          router.push(`/admin/routes/${res.id}`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save route." });
      }
    });
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              1. Route Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Origin *</label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, origin: e.target.value }))}
                  placeholder="Shirdi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Destination *</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">Route Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Shirdi to Pune Cab / Taxi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">URL Slug *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-stone-100 border border-r-0 border-stone-200 text-stone-500 text-xs rounded-l-xl font-mono">
                    /routes/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="shirdi-to-pune"
                    className="w-full px-3 py-2 rounded-r-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Approx Distance (km)</label>
                <input
                  type="number"
                  value={formData.approxDistanceKm || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      approxDistanceKm: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  placeholder="e.g. 205"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Approx Travel Time</label>
                <input
                  type="text"
                  value={formData.approxTravelTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, approxTravelTime: e.target.value }))
                  }
                  placeholder="e.g. 4.5 - 5 hrs"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Starting Fare (₹)</label>
                <input
                  type="number"
                  value={formData.startingFare || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startingFare: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  placeholder="e.g. 3800"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Trip Type</label>
                <select
                  value={formData.tripType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="one_way">One-Way Drop</option>
                  <option value="round_trip">Round Trip</option>
                  <option value="airport_transfer">Airport Transfer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-brand-charcoal-900">
                Short Description *
              </label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                placeholder="Comfortable door-to-door cab from Shirdi to Pune via Sangamner and Narayangaon..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. SEO Settings
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="e.g. Shirdi to Pune Cab Service | Transparent Fare & Clean AC Taxis"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                  }
                  placeholder="Book a comfortable AC taxi from Shirdi to Pune. Owned Ertiga & Sedan cabs with transparent pricing and direct hotel pickup."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
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
                    setFormData((prev) => ({ ...prev, status: e.target.value as ContentStatus }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                >
                  <option value="published">✓ Published</option>
                  <option value="draft">● Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isPopular: e.target.checked }))
                  }
                  className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Mark as Popular Route
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
                  href={`/routes/${formData.slug}`}
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
