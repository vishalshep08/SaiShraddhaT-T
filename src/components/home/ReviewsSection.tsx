import React from "react";
import Link from "next/link";
import { MessageSquare, HeartHandshake, ArrowRight } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPublicReviewsAction, getSiteSettingsAction } from "@/actions/trustActions";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

export async function ReviewsSection() {
  const [reviews, settings] = await Promise.all([
    getPublicReviewsAction({ featuredOnly: true, limit: 3 }),
    getSiteSettingsAction(),
  ]);

  const googleReviewUrl = settings.googleReviewUrl;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {reviews.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <Badge variant="maroon" size="sm" className="mb-1.5">
                Traveller Feedback
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
                Real Customer Reviews
              </h2>
            </div>

            <Link href="/reviews" className="shrink-0">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Reviews →
              </Button>
            </Link>
          </div>

          <HorizontalCarousel
            ariaLabel="Customer reviews and traveller testimonials"
            autoplay={false}
            desktopMode="grid"
            desktopGridCols="md:grid-cols-3"
          >
            {reviews.map((r) => (
              <div key={r.id} className="h-full">
                <TestimonialCard review={r} />
              </div>
            ))}
          </HorizontalCarousel>
        </>
      ) : (
        /* Review-Ready Invitation Container when no approved reviews in DB */
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs max-w-2xl mx-auto text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-brand-saffron-50 text-brand-saffron-800 flex items-center justify-center mx-auto border border-brand-saffron-200">
            <HeartHandshake className="w-5 h-5 text-brand-saffron-600" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-brand-charcoal-900">
              Travelled With Us?
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Share your experience with Sai Shraddha Tours &amp; Travels. We appreciate your honest feedback.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {googleReviewUrl ? (
              <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="primary" className="font-bold">
                  Share Feedback on Google
                </Button>
              </a>
            ) : (
              <a
                href={buildWhatsAppLink({
                  customMessage: `Hello Ramesh Shep, I would like to share feedback about my journey with Sai Shraddha Tours & Travels.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="primary"
                  className="font-bold"
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Share Feedback
                </Button>
              </a>
            )}

            <Link href="/reviews">
              <Button size="sm" variant="outline">
                Read Reviews
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
