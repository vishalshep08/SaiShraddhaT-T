import React from "react";
import { ShieldCheck, MapPin, Heart } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function BusinessStory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Story Text */}
          <div className="lg:col-span-8 space-y-4">
            <Badge variant="saffron" size="sm">
              Our Journey Since {BUSINESS_CONFIG.establishedYear}
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Founded &amp; Managed with Care in Shirdi
            </h2>

            <div className="text-sm text-stone-700 space-y-3 leading-relaxed">
              <p>
                In <strong>2014</strong>, <strong>Sai Shraddha Tours &amp; Travels</strong> was established right outside the holy shrine of Shirdi, operating from <em>Sai Ashram (Bhakta Niwas 1000 Rooms)</em>. Founded and managed by <strong>Ramesh Shep</strong>, the business was built on personal conversations, genuine hospitality, and deep devotion to visiting yatris.
              </p>
              <p>
                Ramesh Shep personally assists families arriving by train, flight, or bus—understanding their pilgrimage darshan timings and arranging clean, comfortable cabs for local temple visits, Shani Shingnapur, Trimbakeshwar Jyotirlinga, Grishneshwar, and highway outstation travel.
              </p>
              <p className="font-medium text-brand-charcoal-900">
                Today, our core promise remains genuine: you speak directly with the owner, receive honest transparent pricing without middleman fees, and travel in well-maintained owned Ertiga and Tavera vehicles.
              </p>
            </div>
          </div>

          {/* Highlight Visual Card */}
          <div className="lg:col-span-4 bg-brand-ivory-200/90 rounded-2xl p-6 border border-stone-300 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-xs border border-brand-maroon/20">
              <img
                src="/images/shirdi/sai-baba-emblem.svg"
                alt="Sai Baba Sacred Shirdi Emblem"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-brand-charcoal-900 uppercase">
                {BUSINESS_CONFIG.name}
              </h3>
              <p className="text-xs text-brand-maroon font-semibold">
                Owner: Ramesh Shep
              </p>
            </div>

            <div className="pt-2 border-t border-stone-300/80 text-xs text-stone-600 space-y-1">
              <div>📍 <strong>Location:</strong> {BUSINESS_CONFIG.officeLocationName}</div>
              <div>📅 <strong>Established:</strong> {BUSINESS_CONFIG.establishedYear}</div>
              <div>🚗 <strong>Owned Fleet:</strong> 3 × Ertiga, 1 × Tavera</div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 italic">
              "॥ ॐ साईं राम ॥ Dedicated to honest pilgrimage journeys."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
