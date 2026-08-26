import React from "react";
import Link from "next/link";
import { Star, HeartHandshake, MessageSquare, ShieldCheck, CheckCircle2, Phone } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPublicReviewsAction, getPublicFAQsAction, getSiteSettingsAction } from "@/actions/trustActions";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { InlineQuoteForm } from "@/components/enquiry/InlineQuoteForm";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Customer Reviews & Pilgrimage Experiences",
  description: "Read genuine customer reviews and travel testimonials from pilgrims and families who have booked cabs with Sai Shraddha Tours & Travels, Shirdi since 2014.",
  canonicalPath: "/reviews",
});

export default async function ReviewsPage() {
  const [reviews, faqs, settings] = await Promise.all([
    getPublicReviewsAction(),
    getPublicFAQsAction({ category: "pilgrimage", limit: 6 }),
    getSiteSettingsAction(),
  ]);

  const googleReviewUrl = settings.googleReviewUrl;
  const ramesh = BUSINESS_CONFIG.contacts[0];

  // Calculate actual average rating only if genuine reviews exist
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="maroon" size="sm">
          Trust &amp; Customer Experiences
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal-900 tracking-tight">
          Customer Reviews &amp; Testimonials
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Real feedback from pilgrims, families, and travellers who have trusted Sai Shraddha Tours &amp; Travels with their Shirdi and Maharashtra journeys since {BUSINESS_CONFIG.establishedYear}.
        </p>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {googleReviewUrl && (
            <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
              <Button size="md" variant="primary" className="font-bold">
                Review Us on Google
              </Button>
            </a>
          )}
          <a
            href={buildWhatsAppLink({
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to share feedback about my recent journey with your team.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="md"
              variant="outline"
              className="border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold"
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
            >
              Share Feedback on WhatsApp
            </Button>
          </a>
        </div>
      </div>

      {/* 2. Reviews Grid or Invitation Box */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="text-lg font-bold text-brand-charcoal-900">
              Verified Customer Experiences ({totalReviews})
            </h2>
            {averageRating && (
              <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{averageRating} / 5.0 Average Rating</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <TestimonialCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-brand-maroon-50 text-brand-maroon flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-charcoal-900">
            Be the First to Share Your Online Experience
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Having served pilgrims offline since 2014, we are now publishing customer feedback online. If you have travelled with Ramesh Shep, we would be delighted to hear from you.
          </p>
          <div className="pt-2">
            <a
              href={buildWhatsAppLink({
                customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to share feedback about my recent journey with your team.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="md" variant="primary" className="font-bold">
                Send Your Feedback on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* 3. Trust Principles Strip */}
      <div className="bg-brand-ivory-200/80 rounded-2xl p-6 sm:p-8 border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-brand-charcoal-900 flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-maroon" />
              Serving Since {BUSINESS_CONFIG.establishedYear}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Operating continuously right outside Sai Ashram (1000 Rooms), Pimpalwadi Road, Shirdi.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-brand-charcoal-900 flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Owned &amp; Maintained Fleet
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              3 × Maruti Suzuki Ertiga and 1 × Chevrolet Tavera directly owned and maintained for family comfort.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-brand-charcoal-900 flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4 text-brand-maroon" />
              Direct Contact With Owner
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Speak directly with Ramesh Shep ({ramesh.primaryPhone}) for honest quotes and assistance.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions */}
      {faqs.length > 0 && (
        <div className="pt-6">
          <FAQAccordion
            faqs={faqs}
            title="Common Questions About Travelling With Us"
            subtitle="Have questions about our cabs, booking process, or pilgrimage routes? Here are genuine answers."
          />
        </div>
      )}

      {/* 5. Inline Quote & Contact */}
      <div className="pt-6 border-t border-stone-200">
        <InlineQuoteForm
          embedded
          context={{
            enquiryType: "general",
            requestIntent: "quote",
            sourcePage: "/reviews",
            origin: "Shirdi",
          }}
          heading="Ready to Plan Your Pilgrimage or Travel?"
          subtext="Tell us your dates and destination. Ramesh Shep (Owner) will provide you an honest, upfront quote."
          primaryPhone={ramesh.primaryPhone}
          primaryPhoneRaw={ramesh.primaryPhoneRaw}
        />
      </div>
    </div>
  );
}
