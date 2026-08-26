import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getAdminReviewByIdAction } from "@/actions/trustActions";
import { ReviewFormManager } from "@/components/admin/ReviewFormManager";

export const dynamic = "force-dynamic";

interface AdminReviewDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminReviewDetailPage({
  params,
}: AdminReviewDetailPageProps) {
  const isNew = params.id === "new";
  const review = isNew ? null : await getAdminReviewByIdAction(params.id);

  if (!isNew && !review) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/admin/dashboard" className="hover:text-brand-charcoal-900">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/admin/reviews" className="hover:text-brand-charcoal-900">
            Reviews
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "Add Review" : review?.customerDisplayName}
          </span>
        </nav>

        <Link
          href="/admin/reviews"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Reviews</span>
        </Link>
      </div>

      <ReviewFormManager review={review} />
    </div>
  );
}
