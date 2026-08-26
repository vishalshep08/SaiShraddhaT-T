"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Save, ExternalLink } from "lucide-react";
import { CMSVehicleCategoryItem, ContentStatus } from "@/types/cms";
import { saveCMSVehicleCategoryAction } from "@/actions/cmsActions";
import { Button } from "@/components/ui/Button";

interface FleetCategoryFormManagerProps {
  initialData: Partial<CMSVehicleCategoryItem>;
}

export function FleetCategoryFormManager({ initialData }: FleetCategoryFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<CMSVehicleCategoryItem>>({
    id: initialData.id,
    name: initialData.name || "",
    slug: initialData.slug || "",
    seatingCapacity: initialData.seatingCapacity || "4+1 Seater",
    minPassengers: initialData.minPassengers || 1,
    maxPassengers: initialData.maxPassengers || 4,
    luggageCapacity: initialData.luggageCapacity || "2-3 Bags",
    idealFor: initialData.idealFor || "",
    description: initialData.description || "",
    availabilityNote: initialData.availabilityNote || "Direct Owned Fleet / Readily Available",
    isFeatured: Boolean(initialData.isFeatured),
    status: initialData.status || "published",
    displayOrder: initialData.displayOrder || 0,
  });

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
    const payload = {
      ...formData,
      status: statusToSave || formData.status,
    };

    startTransition(async () => {
      const res = await saveCMSVehicleCategoryAction(payload);
      if (res.success) {
        setMessage({ type: "success", text: "Vehicle category saved and published successfully." });
        router.refresh();
        if (initialData.id === "new" && res.id) {
          router.push(`/admin/fleet/${res.id}`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save category." });
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
              1. Vehicle Category Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. SUV / MUV (Ertiga & Tavera)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="suv-muv-ertiga"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Seating Capacity *
                </label>
                <input
                  type="text"
                  required
                  value={formData.seatingCapacity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, seatingCapacity: e.target.value }))
                  }
                  placeholder="e.g. 6+1 Seater / 7 Passengers"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Luggage Capacity
                </label>
                <input
                  type="text"
                  value={formData.luggageCapacity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, luggageCapacity: e.target.value }))
                  }
                  placeholder="e.g. 3-4 Medium Bags"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Availability Note (Honest Business Disclosure)
                </label>
                <input
                  type="text"
                  value={formData.availabilityNote}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, availabilityNote: e.target.value }))
                  }
                  placeholder="e.g. Directly Owned (3 Ertiga + 1 Tavera) • Readily available"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Ideal For (Features / Suitability)
                </label>
                <input
                  type="text"
                  value={formData.idealFor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idealFor: e.target.value }))}
                  placeholder="e.g. Families, senior citizens, pilgrimage day tours with spacious legroom"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-brand-charcoal-900">
                Detailed Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Comfortable air-conditioned family travel. Our Maruti Suzuki Ertiga and Chevrolet Tavera fleet are impeccably maintained with dedicated professional drivers..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
              />
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
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Feature on Homepage Fleet
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

            <div className="pt-2 border-t border-stone-100">
              <a
                href="/fleet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
              >
                <span>View Public Fleet Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
