import React from "react";
import { MapPin, CheckCircle2 } from "lucide-react";

export interface PlaceItem {
  name: string;
  description: string;
  image?: string;
}

interface PlacesCoveredSectionProps {
  places: PlaceItem[];
  title?: string;
  subtitle?: string;
}

export function PlacesCoveredSection({
  places,
  title = "Places You Can Visit on This Trip",
  subtitle = "Key holy shrines, heritage sites, and sightseeing stops covered comfortably during your cab tour.",
}: PlacesCoveredSectionProps) {
  if (!places || places.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
      <div className="space-y-1 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-maroon" />
          <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal-900">
            {title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {places.map((place, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-brand-maroon/30 hover:bg-stone-50 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-maroon-50 border border-brand-maroon-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-maroon">
                {idx + 1}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-brand-charcoal-900 leading-snug">
                {place.name}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
