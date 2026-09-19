import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PackagesSection } from "@/components/home/PackagesSection";
import { FleetSection } from "@/components/home/FleetSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BusinessStory } from "@/components/home/BusinessStory";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Shirdi Taxi & Cab Service | Sai Shraddha Tours & Travels",
  description:
    "Sai Shraddha Tours & Travels — Shirdi's trusted taxi, pilgrimage and outstation cab service operating since 2014 from Sai Ashram. Owned Ertiga & Tavera fleet, Nashik, Shani Shingnapur, and Ellora darshan tours.",
  canonicalPath: "/",
});

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16 pb-12 sm:pb-16">
      {/* 1. Hero Section (Headline, 3 Trust Points, Primary/Secondary CTAs, Dynamic Fleet Showcase) */}
      <HeroSection />

      {/* 2. Where Do You Want To Go? (6 Popular Routes Preview) */}
      <DestinationsSection />

      {/* 3. Travel Services From Shirdi (4 Concise Service Categories) */}
      <ServicesSection />

      {/* 4. Popular Pilgrimage Packages (3 Compact Tour Cards) */}
      <PackagesSection />

      {/* 5. Our Owned Vehicles (Ertiga & Tavera Highlight + Verified Partner Network Note) */}
      <FleetSection />

      {/* 6. Why Travel With Sai Shraddha? (4 Concise Trust Points) */}
      <WhyChooseUs />

      {/* 7. Your Journey Begins in Shirdi (Tasteful Sai Baba / Shirdi Visual Section) */}
      <BusinessStory />

      {/* 8. Real Customer Reviews (Dynamic from Supabase; zero fake reviews) */}
      <ReviewsSection />

      {/* 9. Final Conversion CTA (Planning a Trip From Shirdi?) */}
      <FinalCTA />
    </div>
  );
}
