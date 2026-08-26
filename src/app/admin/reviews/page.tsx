import React from "react";
import Link from "next/link";
import {
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageSquare,
  Edit,
  Globe,
  Save,
} from "lucide-react";
import { getAdminReviewsAction, getSiteSettingsAction, saveSiteSettingAction } from "@/actions/trustActions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface AdminReviewsPageProps {
  searchParams: {
    status?: string;
    search?: string;
  };
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const currentStatus = searchParams.status || "all";
  const [reviews, settings] = await Promise.all([
    getAdminReviewsAction({ status: currentStatus, search: searchParams.search }),
    getSiteSettingsAction(),
  ]);

  const publishedCount = reviews.filter((r) => r.status === "published").length;
  const featuredCount = reviews.filter((r) => r.isFeatured).length;

  async function updateGoogleLink(formData: FormData) {
    "use server";
    const url = formData.get("googleReviewUrl") as string;
    if (url !== null) {
      await saveSiteSettingAction("google_review_url", url);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Customer Reviews &amp; Testimonials
            </h1>
            <Badge variant="maroon" size="sm">
              {reviews.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage authentic customer feedback from Google, WhatsApp, and in-person trips.
          </p>
        </div>

        <Link href="/admin/reviews/new">
          <Button variant="primary" size="md" className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </Button>
        </Link>
      </div>

      {/* Google Review Link Quick Config Box */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-maroon" />
            <h2 className="text-xs font-bold text-brand-charcoal-900 uppercase tracking-wider">
              Google Review Destination URL
            </h2>
          </div>
          <span className="text-[11px] text-stone-400">
            Used on public website for "Review us on Google" buttons
          </span>
        </div>

        <form action={updateGoogleLink} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="url"
            name="googleReviewUrl"
            defaultValue={settings.googleReviewUrl || ""}
            placeholder="e.g. https://g.page/r/.../review or Google Maps Review Link"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 w-full focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
          />
          <Button type="submit" size="sm" variant="primary" className="w-full sm:w-auto font-bold">
            Save URL
          </Button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <Link
          href="/admin/reviews"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentStatus === "all" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          All ({reviews.length})
        </Link>
        <Link
          href="/admin/reviews?status=published"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentStatus === "published" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Published
        </Link>
        <Link
          href="/admin/reviews?status=featured"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentStatus === "featured" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Featured Only
        </Link>
        <Link
          href="/admin/reviews?status=draft"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            currentStatus === "draft" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Drafts
        </Link>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-700">No testimonials found.</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Add genuine customer feedback from Google or WhatsApp to establish trust with new visitors.
          </p>
          <Link href="/admin/reviews/new" className="inline-block pt-2">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add First Testimonial
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-brand-charcoal-900 leading-tight">
                      {r.customerDisplayName}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? "text-amber-500 fill-amber-500" : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      r.status === "published"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed italic line-clamp-4">
                  "{r.reviewText}"
                </p>

                {(r.destinationName || r.serviceName) && (
                  <div className="text-[11px] text-stone-500">
                    🏷 {r.destinationName || r.serviceName}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <span>Source: {r.source}</span>
                  {r.isFeatured && (
                    <span className="font-bold text-amber-700 bg-amber-50 px-1 rounded">
                      ★ Featured
                    </span>
                  )}
                </div>

                <Link href={`/admin/reviews/${r.id}`}>
                  <Button variant="outline" size="sm" className="text-xs py-1 h-7 font-bold">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
