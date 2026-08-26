"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare, Menu, X, ShieldCheck, MapPin } from "lucide-react";
import { BUSINESS_CONFIG, NAV_LINKS } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BusinessLogo } from "@/components/shared/BusinessLogo";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const rameshContact = BUSINESS_CONFIG.contacts[0];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-40">
      {/* Top Utility Trust Strip */}
      <div className="bg-brand-maroon text-white text-xs py-1.5 px-4 border-b border-brand-maroon-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          {/* Trust badge & Location */}
          <div className="flex items-center flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold bg-brand-maroon-800 px-2 py-0.5 rounded text-[11px] text-brand-saffron-200 border border-brand-maroon-700">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-saffron-300" />
              Serving Customers Since {BUSINESS_CONFIG.establishedYear}
            </span>
            <span className="text-brand-maroon-200 text-[11px] hidden sm:inline flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-saffron-300 inline" />
              Sai Ashram (Bhakta Niwas), Shirdi
            </span>
          </div>

          {/* Verified Phone Contact (Ramesh Shep — Owner) */}
          <div className="flex items-center flex-wrap justify-center gap-3 text-[12px]">
            <a
              href={buildPhoneLink(rameshContact.primaryPhoneRaw)}
              className="flex items-center gap-1 hover:text-brand-saffron-200 transition-colors"
            >
              <Phone className="w-3 h-3 text-brand-saffron-300" />
              <span>Ramesh Shep (Owner): <strong className="font-semibold">{rameshContact.primaryPhone}</strong></span>
            </a>

            <span className="text-brand-maroon-400">|</span>

            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2">
          {/* Global Business Logo */}
          <Link href="/" className="flex items-center group">
            <BusinessLogo size="md" variant="header" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-brand-maroon py-1",
                    isActive
                      ? "text-brand-maroon font-bold border-b-2 border-brand-maroon"
                      : "text-brand-charcoal-700"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md border border-emerald-600 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Us
            </a>

            <Link
              href="/#quick-enquiry"
              className="inline-flex items-center justify-center font-medium rounded-md transition-colors bg-brand-maroon text-white hover:bg-brand-maroon-800 shadow-sm h-9 px-3.5 text-xs"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={buildPhoneLink()}
              className="p-2 rounded-md bg-brand-ivory-200 text-brand-maroon hover:bg-brand-ivory-300"
              aria-label="Call business"
            >
              <Phone className="w-5 h-5" />
            </a>

            <Link
              href="/#quick-enquiry"
              className="inline-flex items-center justify-center font-medium rounded-md transition-colors bg-brand-maroon text-white hover:bg-brand-maroon-800 shadow-sm h-9 px-3 text-xs"
            >
              Quote
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-brand-charcoal hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-brand-ivory-50 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-maroon text-white font-bold"
                      : "text-brand-charcoal hover:bg-stone-200/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase px-1">
              Direct Contact &amp; Booking
            </div>

            <div>
              <a
                href={buildPhoneLink(rameshContact.primaryPhoneRaw)}
                className="flex items-center justify-between py-2.5 px-3 rounded-md bg-white border border-stone-300 text-xs font-semibold text-brand-charcoal-900"
              >
                <span>Call Ramesh Shep (Owner)</span>
                <span className="text-brand-maroon">{rameshContact.primaryPhone}</span>
              </a>
            </div>

            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp Direct
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
