import React from "react";
import Link from "next/link";
import { MessageSquare, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPublicReviewsAction, getSiteSettingsAction } from "@/actions/trustActions";
import { TestimonialCard } from "@/components/shared/TestimonialCard";

export async function ReviewsSection() {
  const [reviews, settings] = await Promise.all([
    getPublicReviewsAction({ featuredOnly: true, limit: 3 }),
    getSiteSettingsAction(),
  ]);

  const googleReviewUrl = settings.googleReviewUrl;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <Badge variant="maroon" size="sm">
          Traveller Feedback &amp; Trust
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
          What Our Travellers Say
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Genuine experiences from pilgrims, families, and groups who have travelled with us across Shirdi and Maharashtra since {BUSINESS_CONFIG.establishedYear}.
        </p>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <TestimonialCard key={r.id} review={r} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/reviews">
              <Button variant="outline" size="md" className="font-bold flex items-center gap-2">
                <span>Read All Customer Experiences</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {googleReviewUrl && (
              <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md" className="font-bold">
                  Review Us on Google
                </Button>
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Review-Ready Container when no reviews are in database yet */
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-xs max-w-3xl mx-auto text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-brand-saffron-50 text-brand-saffron-800 flex items-center justify-center mx-auto border border-brand-saffron-200">
            <HeartHandshake className="w-6 h-6 text-brand-saffron-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-brand-charcoal-900">
              Have You Travelled With Us From Shirdi?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
              We value your honest experience. Whether you booked a local temple cab or travelled to Trimbakeshwar and Shani Shingnapur, we would love to receive your thoughts.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {googleReviewUrl ? (
              <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <Button size="md" variant="primary" className="font-bold">
                  Leave a Google Review
                </Button>
              </a>
            ) : null}

            <a
              href={buildWhatsAppLink({
                customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to share feedback about my recent trip with your team.`,
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
                Share Trip Feedback on WhatsApp
              </Button>
            </a>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Only genuine, verified customer reviews are published on this platform</span>
          </div>
        </div>
      )}
    </section>
  );
}
