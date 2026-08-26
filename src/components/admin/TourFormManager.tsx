"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Save, ExternalLink, Plus, Trash2 } from "lucide-react";
import { CMSTourPackageItem, ContentStatus, ItineraryDay } from "@/types/cms";
import { saveCMSTourAction } from "@/actions/cmsActions";
import { Button } from "@/components/ui/Button";

interface TourFormManagerProps {
  initialData: Partial<CMSTourPackageItem>;
}

export function TourFormManager({ initialData }: TourFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<CMSTourPackageItem>>({
    id: initialData.id,
    title: initialData.title || "",
    slug: initialData.slug || "",
    duration: initialData.duration || "1 Day",
    startingLocation: initialData.startingLocation || "Shirdi",
    destinationsIncluded: initialData.destinationsIncluded || ["Shirdi"],
    startingFare: initialData.startingFare,
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",
    itinerary: initialData.itinerary || [
      { day: 1, title: "Day 1: Darshan & Sightseeing", description: "Departure from Shirdi hotel..." },
    ],
    inclusions: initialData.inclusions || ["Dedicated AC Vehicle", "Driver Allowance", "Toll & Parking"],
    exclusions: initialData.exclusions || ["Temple VIP Darshan Pass", "Hotel Accommodation", "Food & Meals"],
    isFeatured: Boolean(initialData.isFeatured),
    status: initialData.status || "published",
    displayOrder: initialData.displayOrder || 0,
    seoTitle: initialData.seoTitle || "",
    metaDescription: initialData.metaDescription || "",
  });

  const [destinationsInput, setDestinationsInput] = useState(
    (initialData.destinationsIncluded || []).join(", ")
  );

  const [inclusionsInput, setInclusionsInput] = useState(
    (initialData.inclusions || []).join("\n")
  );

  const [exclusionsInput, setExclusionsInput] = useState(
    (initialData.exclusions || []).join("\n")
  );

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

  const handleAddItineraryDay = () => {
    setFormData((prev) => {
      const nextDay = (prev.itinerary?.length || 0) + 1;
      return {
        ...prev,
        itinerary: [
          ...(prev.itinerary || []),
          { day: nextDay, title: `Day ${nextDay}: Sightseeing`, description: "" },
        ],
      };
    });
  };

  const handleRemoveItineraryDay = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: (prev.itinerary || []).filter((_, i) => i !== idx),
    }));
  };

  const handleItineraryChange = (idx: number, field: "title" | "description", val: string) => {
    setFormData((prev) => {
      const updated = [...(prev.itinerary || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      return { ...prev, itinerary: updated };
    });
  };

  const handleSubmit = (statusToSave?: ContentStatus) => {
    setMessage(null);
    const destList = destinationsInput
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const incList = inclusionsInput
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const excList = exclusionsInput
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    const payload = {
      ...formData,
      destinationsIncluded: destList,
      inclusions: incList,
      exclusions: excList,
      status: statusToSave || formData.status,
    };

    startTransition(async () => {
      const res = await saveCMSTourAction(payload);
      if (res.success) {
        setMessage({ type: "success", text: "Tour package saved and published successfully." });
        router.refresh();
        if (initialData.id === "new" && res.id) {
          router.push(`/admin/tours/${res.id}`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save tour package." });
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
              1. Tour Package Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">Tour Name *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Nashik & Trimbakeshwar Darshan Day Tour"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">URL Slug *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-stone-100 border border-r-0 border-stone-200 text-stone-500 text-xs rounded-l-xl font-mono">
                    /packages/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="nashik-trimbakeshwar-darshan"
                    className="w-full px-3 py-2 rounded-r-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Duration *</label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. Same Day / 1 Day"
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
                  placeholder="e.g. 3200"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Destinations Included (Comma-separated)
                </label>
                <input
                  type="text"
                  value={destinationsInput}
                  onChange={(e) => setDestinationsInput(e.target.value)}
                  placeholder="Shirdi, Nashik, Trimbakeshwar, Panchavati"
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
                  setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                placeholder="Complete same-day holy darshan tour from Shirdi covering Trimbakeshwar Jyotirlinga and Nashik temples..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
              />
            </div>
          </div>

          {/* Section 2: Itinerary */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider">
                2. Itinerary Schedule
              </h3>
              <button
                type="button"
                onClick={handleAddItineraryDay}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.itinerary || []).map((day, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                      placeholder="e.g. Day 1: Trimbakeshwar & Panchavati"
                      className="font-bold text-xs sm:text-sm text-brand-charcoal-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 flex-1 mr-2"
                    />
                    {(formData.itinerary?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(idx)}
                        className="p-1 rounded text-stone-400 hover:text-rose-600"
                        title="Remove Day"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={day.description}
                    onChange={(e) => handleItineraryChange(idx, "description", e.target.value)}
                    placeholder="Morning departure at 6:30 AM -> Direct darshan at Trimbakeshwar -> Lunch at Nashik -> Evening return to Shirdi..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Inclusions & Exclusions */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              3. Inclusions & Exclusions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-800">
                  Inclusions (One per line)
                </label>
                <textarea
                  rows={4}
                  value={inclusionsInput}
                  onChange={(e) => setInclusionsInput(e.target.value)}
                  placeholder="Dedicated AC Vehicle&#10;Driver Allowance&#10;Toll & Parking Charges&#10;Hotel Pickup & Drop"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-800">
                  Exclusions (One per line)
                </label>
                <textarea
                  rows={4}
                  value={exclusionsInput}
                  onChange={(e) => setExclusionsInput(e.target.value)}
                  placeholder="VIP Darshan Pass&#10;Hotel Accommodation&#10;Food, Meals & Entry Fees&#10;Personal Expenses"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
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
                  href={`/packages/${formData.slug}`}
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
