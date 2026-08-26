"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  Star,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { ReviewItem, ReviewSource, ReviewStatus } from "@/types/trust";
import { saveReviewAction, toggleReviewStatusAction } from "@/actions/trustActions";
import { Button } from "@/components/ui/Button";

interface ReviewFormManagerProps {
  review: ReviewItem | null;
}

export function ReviewFormManager({ review }: ReviewFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isNew = !review || review.id === "new";

  const [customerDisplayName, setCustomerDisplayName] = useState(review?.customerDisplayName || "");
  const [reviewText, setReviewText] = useState(review?.reviewText || "");
  const [rating, setRating] = useState<number>(review?.rating || 5);
  const [source, setSource] = useState<ReviewSource>(review?.source || "google");
  const [reviewDate, setReviewDate] = useState<string>(
    review?.reviewDate || new Date().toISOString().split("T")[0]
  );
  const [serviceName, setServiceName] = useState(review?.serviceName || "");
  const [destinationName, setDestinationName] = useState(review?.destinationName || "");
  const [isVerified, setIsVerified] = useState<boolean>(review?.isVerified ?? true);
  const [isFeatured, setIsFeatured] = useState<boolean>(review?.isFeatured ?? false);
  const [displayOrder, setDisplayOrder] = useState<number>(review?.displayOrder || 0);
  const [status, setStatus] = useState<ReviewStatus>(review?.status || "published");
  const [originalUrl, setOriginalUrl] = useState(review?.originalUrl || "");
  const [hasPhotoConsent, setHasPhotoConsent] = useState<boolean>(review?.hasPhotoConsent ?? false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!customerDisplayName.trim() || !reviewText.trim()) {
      setMessage({ type: "error", text: "Customer display name and review text are required." });
      return;
    }

    startTransition(async () => {
      const res = await saveReviewAction({
        id: review?.id,
        customerDisplayName: customerDisplayName.trim(),
        reviewText: reviewText.trim(),
        rating,
        source,
        reviewDate,
        serviceName: serviceName.trim() || undefined,
        destinationName: destinationName.trim() || undefined,
        isVerified,
        isFeatured,
        displayOrder: Number(displayOrder) || 0,
        status,
        originalUrl: originalUrl.trim() || undefined,
        hasPhotoConsent,
      });

      if (res.success) {
        setMessage({
          type: "success",
          text: isNew ? "Review created successfully." : "Review updated successfully.",
        });
        if (isNew && res.id) {
          router.push(`/admin/reviews/${res.id}`);
        } else {
          router.refresh();
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save review." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-maroon" />
              Review &amp; Testimonial Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Customer Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerDisplayName}
                  onChange={(e) => setCustomerDisplayName(e.target.value)}
                  placeholder="e.g. Rahul P. / Family from Pune"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
                <p className="text-[11px] text-stone-400">
                  Privacy-safe name (no full legal names required).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Rating (1 to 5 Stars) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-bold text-amber-600 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Review Text / Testimonial Quote <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste the genuine customer review as received on Google, WhatsApp, or in person..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Associated Destination (Optional)
                </label>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  placeholder="e.g. Shani Shingnapur, Trimbakeshwar, Nashik"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Associated Service (Optional)
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Outstation Taxi, Airport Transfer"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Review Date</label>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Original Link / URL (Optional)</label>
                <input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="e.g. https://maps.google.com/..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3">
              Status &amp; Display Settings
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Source Platform</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as ReviewSource)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white"
                >
                  <option value="google">Google Business Review</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="direct">Direct In-Person Feedback</option>
                  <option value="website">Website Feedback</option>
                  <option value="other">Other Genuine Source</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white"
                >
                  <option value="published">Published (Visible on site)</option>
                  <option value="draft">Draft (Admin only)</option>
                  <option value="archived">Archived (Hidden)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300"
                />
                <p className="text-[11px] text-stone-400">Lower numbers appear first.</p>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    Verified Customer Trip (Show Verified Badge)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    Featured Review (Show on Homepage &amp; Landing Pages)
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isPending}
                className="w-full font-bold flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isNew ? "Create Review" : "Save Review"}</span>
                  </>
                )}
              </Button>

              <Link
                href="/admin/reviews"
                className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-brand-charcoal-900 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
