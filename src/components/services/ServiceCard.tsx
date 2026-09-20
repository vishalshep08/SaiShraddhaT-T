import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, Car, Navigation, Plane, Compass, Users, Briefcase } from "lucide-react";
import { ServiceItem } from "@/types/services";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const iconMap: Record<string, React.ElementType> = {
  Car,
  Navigation,
  Plane,
  Compass,
  Users,
  Briefcase,
};

interface ServiceCardProps {
  service: ServiceItem;
  featured?: boolean;
}

export function ServiceCard({ service, featured = false }: ServiceCardProps) {
  const Icon = iconMap[service.iconName] || Car;

  return (
    <div
      id={service.slug}
      className={`rounded-2xl bg-white border border-stone-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-6 ${
        featured ? "md:col-span-2 bg-gradient-to-br from-white via-white to-brand-ivory-100/60" : ""
      }`}
    >
      <div className="space-y-4">
        {/* Top bar: Category badge + Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-brand-maroon-50 text-brand-maroon flex items-center justify-center border border-brand-maroon-100 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon">
                {service.category.toUpperCase()} TRAVEL
              </span>
              <h3 className="text-xl font-extrabold text-brand-charcoal-900 leading-tight">
                {service.title}
              </h3>
            </div>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Suitable For Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {service.suitableFor.map((item, i) => (
            <span
              key={i}
              className="text-[11px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Highlights */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          {service.keyHighlights.slice(0, 3).map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
        <a
          href={buildWhatsAppLink({ drop: service.title })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs"
            leftIcon={<MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
          >
            WhatsApp Quote
          </Button>
        </a>

        <Link href={`/services/${service.slug}`}>
          <Button size="sm" variant="primary" className="text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            {service.ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
