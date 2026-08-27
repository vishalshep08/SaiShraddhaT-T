"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare, MapPin, Mail, ShieldCheck, Heart } from "lucide-react";
import { BUSINESS_CONFIG, CORE_SERVICES, POPULAR_DESTINATIONS, PILGRIMAGE_PACKAGES } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { BusinessLogo } from "@/components/shared/BusinessLogo";

interface FooterProps {
  logoUrl?: string;
}

export function Footer({ logoUrl }: FooterProps) {
  const pathname = usePathname();
  const ramesh = BUSINESS_CONFIG.contacts[0];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-brand-charcoal-900 text-stone-300 pt-16 pb-28 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Historical Identity (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BusinessLogo size="md" variant="footer" customLogoUrl={logoUrl} />

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
            <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-brand-maroon pl-2">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              {CORE_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="hover:text-brand-saffron-300 transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Routes */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-brand-maroon pl-2">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-xs">
              {POPULAR_DESTINATIONS.slice(0, 5).map((d) => (
                <li key={d.slug}>
                  <Link href={`/destinations#${d.slug}`} className="hover:text-brand-saffron-300 transition-colors">
                    Shirdi to {d.name} Taxi
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services#airport" className="hover:text-brand-saffron-300 transition-colors">
                  Shirdi Airport (SAG) Drop
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Direct Desk */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-brand-saffron pl-2 text-brand-saffron-300">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Sole Owner & Manager:</span>
                <span className="font-semibold text-white">Ramesh Shep</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px]">Mobile / WhatsApp:</span>
                <a
                  href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                  className="font-bold text-brand-saffron-300 hover:underline block"
                >
                  {ramesh.primaryPhone}
                </a>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px]">Primary Email:</span>
                <span className="text-stone-300">{BUSINESS_CONFIG.email}</span>
              </div>

              <div className="pt-2">
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-600 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Message</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400 text-center md:text-left">
          <div>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved. Operating in Shirdi since {BUSINESS_CONFIG.establishedYear}.
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Direct Pilgrimage Transport</span>
            <span>•</span>
            <span className="text-brand-saffron-400 font-semibold">॥ ॐ साईं राम ॥</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-stone-300 transition-colors">
              Staff Login
            </Link>
          </div>
        </div>

        {/* Developer Credit Strip */}
        <div className="mt-4 pt-4 border-t border-stone-800/60 flex items-center justify-center gap-1.5 text-xs text-stone-400">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block" />
          <span>by</span>
          <a
            href="https://wa.me/919689541883?text=Hello%20Vishal%20Shep,%20I%20would%20like%20to%20inquire%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-saffron-300 hover:text-brand-saffron-200 transition-colors underline underline-offset-2"
          >
            Vishal Shep
          </a>
        </div>
      </div>
    </footer>
  );
}
