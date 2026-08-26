import React from "react";
import { Star, CheckCircle2, MapPin, Car } from "lucide-react";
import { ReviewItem } from "@/types/trust";

interface TestimonialCardProps {
  review: ReviewItem;
}

export function TestimonialCard({ review }: TestimonialCardProps) {
  const formattedDate = review.reviewDate
    ? new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
      }).format(new Date(review.reviewDate))
    : null;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-maroon/20 transition-all">
      <div className="space-y-3">
        {/* Star Rating & Source */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? "text-amber-500 fill-amber-500" : "text-stone-300"
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {review.source === "google"
              ? "Google Review"
              : review.source === "whatsapp"
              ? "WhatsApp Feedback"
              : review.source === "direct"
              ? "Direct Traveller"
              : "Customer Review"}
          </span>
        </div>

        {/* Review Quote */}
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
          "{review.reviewText}"
        </p>

        {/* Optional Tag: Service or Destination */}
        {(review.serviceName || review.destinationName) && (
          <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-brand-maroon">
            {review.destinationName && (
              <span className="inline-flex items-center gap-1 bg-brand-maroon-50 px-2 py-0.5 rounded-md">
                <MapPin className="w-3 h-3" />
                {review.destinationName}
              </span>
            )}
            {review.serviceName && (
              <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md text-stone-700">
                <Car className="w-3 h-3 text-stone-500" />
                {review.serviceName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Customer Attribution */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-brand-charcoal-900">
            <span>{review.customerDisplayName}</span>
            {review.isVerified && (
              <span
                className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded"
                title="Verified Customer Trip"
              >
                <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600" />
                Verified
              </span>
            )}
          </div>
        </div>

        {formattedDate && (
          <span className="text-[11px] text-stone-400 font-medium">
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
}
