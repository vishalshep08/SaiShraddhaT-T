"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Save, ExternalLink } from "lucide-react";
import { CMSDestinationItem, ContentStatus } from "@/types/cms";
import { saveCMSDestinationAction } from "@/actions/cmsActions";
import { Button } from "@/components/ui/Button";

interface DestinationFormManagerProps {
  initialData: Partial<CMSDestinationItem>;
}

export function DestinationFormManager({ initialData }: DestinationFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<CMSDestinationItem>>({
    id: initialData.id,
    name: initialData.name || "",
    slug: initialData.slug || "",
    origin: initialData.origin || "Shirdi",
    approxDistanceKm: initialData.approxDistanceKm,
    approxTravelTime: initialData.approxTravelTime || "",
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",
    highlights: initialData.highlights || [],
    isPopular: Boolean(initialData.isPopular),
    isFeatured: Boolean(initialData.isFeatured),
    status: initialData.status || "published",
    displayOrder: initialData.displayOrder || 0,
    seoTitle: initialData.seoTitle || "",
    metaDescription: initialData.metaDescription || "",
  });

  const [highlightsInput, setHighlightsInput] = useState(
    (initialData.highlights || []).join("\n")
  );

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !initialData.id || initialData.id === "new"
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        : prev.slug,
    }));
  };

  const handleSubmit = (statusToSave?: ContentStatus) => {
    setMessage(null);
    const splitHighlights = highlightsInput
      .split("\n")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const payload = {
      ...formData,
      highlights: splitHighlights,
      status: statusToSave || formData.status,
    };

    startTransition(async () => {
      const res = await saveCMSDestinationAction(payload);
      if (res.success) {
        setMessage({ type: "success", text: "Destination saved and published successfully." });
        router.refresh();
        if (res.id && (initialData.id === "new" || initialData.id?.startsWith("static-"))) {
          setFormData((prev) => ({ ...prev, id: res.id }));
          router.push(`/admin/destinations/${res.id}`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save destination." });
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
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              1. Destination Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Destination Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Nashik"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-stone-100 border border-r-0 border-stone-200 text-stone-500 text-xs rounded-l-xl font-mono">
                    /destinations/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="nashik"
                    className="w-full px-3 py-2 rounded-r-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Approx Distance (km)
                </label>
                <input
                  type="number"
                  value={formData.approxDistanceKm || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      approxDistanceKm: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  placeholder="e.g. 90"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Approx Travel Time
                </label>
                <input
                  type="text"
                  value={formData.approxTravelTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      approxTravelTime: e.target.value,
                    }))
                  }
                  placeholder="e.g. 2 - 2.5 hrs"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
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
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Ancient holy city on the banks of Godavari, Panchavati, Kalaram Temple..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-brand-charcoal-900">
                Highlights (One per line)
              </label>
              <textarea
                rows={3}
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Panchavati & Sita Gufa&#10;Kalaram Temple&#10;Godavari River Ghats&#10;Muktidham Temple"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon font-sans"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. SEO Settings
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
                  }
                  placeholder="e.g. Shirdi to Nashik Cab & Sightseeing Tour | Sai Shraddha Travels"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Meta Description
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
                  placeholder="Reliable taxi from Shirdi to Nashik for Panchavati and temple darshan."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Publishing Controls */}
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
                  href={`/destinations/${formData.slug}`}
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
