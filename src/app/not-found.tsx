import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Phone,
  Route,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/config/seo";
import { buildPhoneLink } from "@/lib/utils";

export const metadata = {
  title: "Page Not Found | Sai Shraddha Tours & Travels, Shirdi",
  description:
    "The page you are looking for has moved or does not exist. Browse our Shirdi taxi services, popular routes, or contact Ramesh Shep (Owner) for cab booking.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const popularRoutes = [
    { title: "Shirdi to Nashik Taxi", href: "/routes/shirdi-to-nashik" },
    { title: "Shirdi to Trimbakeshwar Cab", href: "/routes/shirdi-to-trimbakeshwar" },
    { title: "Shirdi to Shani Shingnapur", href: "/routes/shirdi-to-shani-shingnapur" },
    { title: "Shirdi to Mumbai Outstation", href: "/routes/shirdi-to-mumbai" },
    { title: "Shirdi to Pune Taxi", href: "/routes/shirdi-to-pune" },
    { title: "Shirdi Airport (SAG) Drop", href: "/services/airport-transfer" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-8">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-extrabold uppercase tracking-wider">
        <Compass className="w-4 h-4 animate-spin-slow" />
        <span>404 • Destination Not Found</span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight">
          Looking for Cab & Travel Services from Shirdi?
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
          The page you requested may have been moved or updated. Let us help you find the right route, temple darshan package, or vehicle for your journey.
        </p>
      </div>

      {/* Primary Recovery CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button size="md" variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link href="/get-quote">
          <Button size="md" variant="saffron" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Request a Free Quote
          </Button>
        </Link>
        <a
          href={buildPhoneLink(SITE_CONFIG.contact.telephones[0].number)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-charcoal-900 text-white text-xs sm:text-sm font-bold hover:bg-brand-charcoal-800 transition-colors shadow-xs"
        >
          <Phone className="w-4 h-4 text-brand-saffron" />
          <span>Call Ramesh Shep (Owner): {SITE_CONFIG.contact.telephones[0].display}</span>
        </a>
      </div>

      {/* Popular Recovery Links */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs text-left space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Route className="w-4 h-4 text-brand-maroon" />
          <h2 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider">
            Popular Shirdi Outstation & Pilgrimage Routes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {popularRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="p-3 rounded-xl bg-stone-50 hover:bg-brand-maroon-50 hover:text-brand-maroon text-xs font-semibold text-stone-700 flex items-center justify-between transition-colors group"
            >
              <span>{route.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-maroon group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-stone-500 border-t border-stone-100">
          <span>Sai Ashram (1000 Rooms), Shirdi</span>
          <div className="flex items-center gap-3 font-semibold text-brand-maroon">
            <Link href="/services" className="hover:underline">All Services</Link>
            <span>•</span>
            <Link href="/destinations" className="hover:underline">Destinations</Link>
            <span>•</span>
            <Link href="/fleet" className="hover:underline">Our Fleet</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
