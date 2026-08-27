import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, Car, Navigation, Plane, Compass, Users, Briefcase } from "lucide-react";
import { CORE_SERVICES } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

const iconMap: Record<string, React.ElementType> = {
  Car,
  Navigation,
  Plane,
  Compass,
  Users,
  Briefcase,
};

export function ServicesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 border-b border-stone-200/80 pb-4">
        <div>
          <Badge variant="saffron" size="sm" className="mb-2">
            Complete Travel Solutions
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Travel & Taxi Services From Shirdi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            From local Shirdi temple pickups to long-distance Maharashtra outstation routes and group travel.
          </p>
        </div>

        <Link href="/services" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Services
          </Button>
        </Link>
      </div>

      <HorizontalCarousel
        ariaLabel="Shirdi Travel & Taxi Services"
        desktopMode="grid"
        desktopGridCols="md:grid-cols-2 lg:grid-cols-3"
      >
        {CORE_SERVICES.map((service, idx) => {
          const Icon = iconMap[service.icon] || Car;
          return (
            <div
              key={service.slug}
              className="h-full rounded-xl bg-white border border-stone-200/90 p-5 sm:p-6 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center border border-brand-maroon-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-400">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-charcoal-900 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-2 space-y-1.5 border-t border-stone-100">
                  {service.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={buildWhatsAppLink({ drop: service.title })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Enquire</span>
                </a>

                <Link
                  href={`/services#${service.slug}`}
                  className="text-xs font-medium text-brand-maroon hover:underline"
                >
                  Details →
                </Link>
              </div>
            </div>
          );
        })}
      </HorizontalCarousel>
    </section>
  );
}
