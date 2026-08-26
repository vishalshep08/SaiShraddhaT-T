import React from "react";
import { ShieldCheck, MapPin, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "About Us — Serving Shirdi Pilgrims Since 2014",
  description: "Learn more about Sai Shraddha Tours & Travels. Founded and managed by Ramesh Shep at Sai Ashram, Shirdi since 2014, providing trusted pilgrimage tours, local cabs, and Maharashtra travel services.",
  canonicalPath: "/about",
});

export default function AboutPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="maroon">Our Story &amp; Heritage</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal-900 tracking-tight">
          About {BUSINESS_CONFIG.name}
        </h1>
        <p className="text-base sm:text-lg text-brand-maroon font-semibold">
          {BUSINESS_CONFIG.tagline} • Founded &amp; Managed by Ramesh Shep in Shirdi
        </p>
      </div>

      {/* Shirdi Spiritual Tribute Visual Banner */}
      <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative bg-stone-50 flex items-center justify-center">
        <img
          src="/images/shirdi/shirdi-temple-visual.svg"
          alt="Shirdi Sai Baba Temple & Pilgrimage Destination"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Business Story */}
      <div className="prose prose-stone max-w-none text-stone-700 space-y-6 text-sm sm:text-base leading-relaxed">
        <p>
          Founded in <strong>{BUSINESS_CONFIG.establishedYear}</strong> by <strong>Ramesh Shep</strong>, <strong>{BUSINESS_CONFIG.name}</strong> (operating under trade name <em>{BUSINESS_CONFIG.tradeName}</em>) was established directly in Shirdi, operating continuously from <strong>{BUSINESS_CONFIG.address}</strong>.
        </p>

        <p>
          For over a decade, Ramesh Shep has welcomed yatris, devotees, and families visiting Shirdi from across India and overseas. What began as a dedicated local travel desk—assisting pilgrims one-on-one with warm hospitality and local knowledge—has grown into an established, trusted agency with an owned fleet of Maruti Suzuki Ertiga and Chevrolet Tavera vehicles.
        </p>

        <div className="my-8 p-6 rounded-2xl bg-brand-ivory-200/80 border border-stone-200 space-y-4">
          <h2 className="text-lg font-bold text-brand-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-maroon" />
            Our Core Commitments to Every Pilgrim &amp; Traveller
          </h2>
          <ul className="space-y-2.5 text-sm text-stone-700 list-none p-0 m-0">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Owned &amp; Maintained Fleet:</strong> 3 × Maruti Ertiga and 1 × Chevrolet Tavera directly maintained, air-conditioned, and sanitized for every journey.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Experienced Local Drivers:</strong> Well-mannered drivers with extensive knowledge of darshan timings, pass procedures, and highway safety.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Transparent Fare Quotes:</strong> Clear upfront pricing with zero hidden aggregator charges or surprise fees.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Direct Owner Access:</strong> You speak directly with Ramesh Shep (Owner) at {ramesh.primaryPhone} for honest booking guidance.</span>
            </li>
          </ul>
        </div>

        <p>
          Whether you are arriving at Shirdi Airport (Kakadi) for a weekend darshan, taking a day-trip to Shani Shingnapur, or embarking on an extended tour across Trimbakeshwar Jyotirlinga, Grishneshwar, and Ellora Caves, our mission is to ensure your travel is peaceful, safe, and memorable.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-4">
        <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
          <Button size="md" variant="primary" leftIcon={<Phone className="w-4 h-4" />}>
            Call Ramesh Shep: {ramesh.primaryPhone}
          </Button>
        </a>

        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="md" variant="outline" className="border-emerald-600 text-emerald-800 hover:bg-emerald-50" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}>
            Chat on WhatsApp
          </Button>
        </a>

        <a href="/reviews">
          <Button size="md" variant="outline">
            Read Customer Reviews →
          </Button>
        </a>
      </div>
    </div>
  );
}
