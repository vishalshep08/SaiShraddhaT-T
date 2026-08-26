import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickEnquiry } from "@/components/home/QuickEnquiry";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { PackagesSection } from "@/components/home/PackagesSection";
import { FleetSection } from "@/components/home/FleetSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BusinessStory } from "@/components/home/BusinessStory";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Shirdi Taxi & Pilgrimage Travel Services",
  description: "Sai Shraddha Tours & Travels — Shirdi's trusted taxi, pilgrimage and outstation cab service operating since 2014 from Sai Ashram. Owned Ertiga & Tavera fleet, Nashik, Shani Shingnapur, and Ellora darshan tours.",
  canonicalPath: "/",
});

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Quick Enquiry Form Anchor */}
      <QuickEnquiry />

      {/* 3. Understated Trust Strip */}
      <TrustStrip />

      {/* 4. Core Travel Services */}
      <ServicesSection />

      {/* 5. Popular Outstation & Pilgrimage Destinations */}
      <DestinationsSection />

      {/* 6. Historical & Curated Pilgrimage Packages */}
      <PackagesSection />

      {/* 7. Fleet Transparency: Owned vs On-Request */}
      <FleetSection />

      {/* 8. Why Choose Us */}
      <WhyChooseUs />

      {/* 9. Legacy & Modern Business Story (Since 2014) */}
      <BusinessStory />

      {/* 10. Traveller Reviews & Verified Feedback Architecture */}
      <ReviewsSection />

      {/* 11. Final Conversion CTA */}
      <FinalCTA />
    </div>
  );
}
