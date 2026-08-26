"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare, MapPin, Mail, ShieldCheck, Heart } from "lucide-react";
import { BUSINESS_CONFIG, CORE_SERVICES, POPULAR_DESTINATIONS, PILGRIMAGE_PACKAGES } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { BusinessLogo } from "@/components/shared/BusinessLogo";

export function Footer() {
  const pathname = usePathname();
  const ramesh = BUSINESS_CONFIG.contacts[0];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-brand-charcoal-900 text-stone-300 pt-16 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Historical Identity (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BusinessLogo size="md" variant="footer" />

            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              A trusted local tours, taxi and pilgrimage car rental service operating continuously from Shirdi since 2014. Directly managing owned Maruti Ertiga and Chevrolet Tavera vehicles for safe, peaceful journeys.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-brand-saffron-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.address}</span>
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded border border-stone-700 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>3 × Owned Ertiga & 1 × Tavera in Shirdi</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-maroon pl-2">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              {CORE_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Routes & Packages */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-maroon pl-2">
              Pilgrimage & Tours
            </h4>
            <ul className="space-y-2 text-xs">
              {PILGRIMAGE_PACKAGES.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/packages#${p.slug}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Verified Contacts */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-maroon pl-2">
              Owner &amp; Direct Booking
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/80 space-y-1.5">
                <div className="font-bold text-brand-saffron-300">Ramesh Shep (Owner):</div>
                <p className="text-stone-400 text-[11px]">Direct bookings &amp; fleet management</p>
                <div className="flex flex-col gap-1 pt-1">
                  <a
                    href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                    className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold text-white"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-saffron-400" />
                    <span>{ramesh.primaryPhone}</span>
                  </a>
                </div>
              </div>

              <div>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat on WhatsApp Direct
                </a>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 font-medium">
                ॥ ॐ साईं राम ॥ — Dedicated to Shirdi Devotees
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. Serving Shirdi since {BUSINESS_CONFIG.establishedYear}.
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/reviews" className="hover:text-stone-300">
              Customer Reviews
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-stone-300">
              About Us
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-stone-400">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-stone-400">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
