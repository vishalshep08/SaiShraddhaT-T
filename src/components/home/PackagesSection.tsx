import React from "react";
import Link from "next/link";
import { Clock, MapPin, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { PILGRIMAGE_PACKAGES } from "@/lib/constants";
import { buildWhatsAppLink, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function PackagesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-stone-200/80 pb-4">
        <div>
          <Badge variant="saffron" size="sm" className="mb-2">
            Spiritual Darshan & Tour Packages
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Pilgrimage Tour Packages
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
            Established holy darshan circuits refined over a decade. Comfortable family pacing, darshan coordination, and clean AC vehicles.
          </p>
        </div>

        <Link href="/packages" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            All Tour Packages
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PILGRIMAGE_PACKAGES.slice(0, 3).map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-xl bg-white border border-stone-200/90 p-6 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-5"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-maroon bg-brand-maroon-50 px-2.5 py-1 rounded">
                  <Clock className="w-3.5 h-3.5" />
                  {pkg.duration}
                </span>
                <span className="text-xs font-bold text-stone-700">
                  {pkg.startingFare ? `From ${formatINR(pkg.startingFare)}*` : "Custom Quote"}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-charcoal-900 leading-snug">
                  {pkg.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  {pkg.destinationsSummary}
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {pkg.shortDescription}
              </p>

              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                  Places Covered:
                </span>
                <div className="space-y-1">
                  {pkg.placesCovered.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0 mt-0.5" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                  {pkg.placesCovered.length > 4 && (
                    <span className="text-[11px] text-stone-400 pl-5">
                      + {pkg.placesCovered.length - 4} more holy locations
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              <a
                href={buildWhatsAppLink({ drop: pkg.title })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Customise & Book
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Special Multi-day / Jyotirlinga Banner */}
      <div className="mt-8 rounded-xl bg-brand-ivory-200/80 p-6 border border-stone-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider bg-brand-maroon-50 px-2 py-0.5 rounded border border-brand-maroon-200">
              Custom Pilgrimage Circuit
            </span>
            <span className="text-xs text-stone-500 font-semibold">• 5 Maharashtra Jyotirlingas</span>
          </div>
          <h4 className="text-base font-bold text-brand-charcoal-900">
            Trimbakeshwar • Grishneshwar • Bhimashankar • Aundha Nagnath • Parli Vaijnath
          </h4>
          <p className="text-xs text-stone-600">
            Planning a custom multi-day yatra for your family or sangh? Speak with Ramesh Shep (Owner) for a tailor-made day-by-day itinerary.
          </p>
        </div>

        <a
          href={buildWhatsAppLink({ drop: "5 Maharashtra Jyotirlinga Custom Circuit" })}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button size="sm" variant="outline" className="border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white">
            Plan Custom Yatra
          </Button>
        </a>
      </div>
    </section>
  );
}
