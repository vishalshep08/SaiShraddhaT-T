import React from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ExternalLink,
  Edit,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { getSEOHealthReportAction } from "@/actions/seoActions";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/config/seo";

export const dynamic = "force-dynamic";

export default async function AdminSEOPage() {
  const report = await getSEOHealthReportAction();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
              SEO Engine & Indexing Health
            </h1>
            <Badge variant="maroon" size="sm">
              {report.publishedCount} Indexable Pages
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Technical SEO, metadata completeness, XML sitemap verification, and Google search readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>View sitemap.xml</span>
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>View robots.txt</span>
          </a>
        </div>
      </div>

      {/* 2. Educational SEO Guidance Card */}
      <div className="bg-brand-charcoal-900 text-white p-6 rounded-2xl border border-brand-charcoal-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-saffron" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-saffron">
            Search Strategy: Shirdi Customer Acquisition
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
          Google ranks pages based on <strong>real customer intent and helpfulness</strong>. Focus on clear travel details (Shirdi pickups, vehicle seating, approximate travel times, temple darshan advice) rather than repeating keywords. Keep meta descriptions human, concise, and trustworthy.
        </p>
      </div>

      {/* 3. Four Health Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Published Pages */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Indexable Pages
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-brand-charcoal-900">
            {report.publishedCount}
          </div>
          <p className="text-[11px] text-stone-500">Live in Google sitemap</p>
        </div>

        {/* Card 2: Drafts */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Drafts (Noindex)
            </span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-700">
            {report.draftCount}
          </div>
          <p className="text-[11px] text-stone-500">Hidden from search engines</p>
        </div>

        {/* Card 3: Missing SEO Titles */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Missing Titles
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {report.missingTitleCount}
          </div>
          <p className="text-[11px] text-stone-500">Using default fallback</p>
        </div>

        {/* Card 4: Missing Descriptions */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Missing Descriptions
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {report.missingDescriptionCount}
          </div>
          <p className="text-[11px] text-stone-500">Needs custom snippet</p>
        </div>
      </div>

      {/* 4. Needs Attention List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-charcoal-900">
              Pages Requiring SEO Attention
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Add custom SEO titles and meta descriptions to improve Google snippet click-through rate.
            </p>
          </div>
          <Badge variant={report.issues.length === 0 ? "green" : "saffron"} size="sm">
            {report.issues.length === 0 ? "All Complete ✓" : `${report.issues.length} Items to Review`}
          </Badge>
        </div>

        {report.issues.length === 0 ? (
          <div className="p-12 text-center text-xs text-emerald-800 bg-emerald-50/50 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <span className="font-bold text-sm text-emerald-900">100% SEO Metadata Completeness</span>
            <span className="text-stone-500 max-w-sm">
              All published services, routes, destinations, and packages have dedicated SEO titles and meta descriptions.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Content Type</th>
                  <th className="p-4">Page Title</th>
                  <th className="p-4">Missing Item</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {report.issues.map((item, idx) => (
                  <tr key={`${item.type}-${item.id}-${idx}`} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-brand-charcoal-900">{item.title}</div>
                      <div className="text-[10px] font-mono text-stone-400">{item.publicUrl}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item.missingFields.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      <Link
                        href={item.publicUrl}
                        target="_blank"
                        className="inline-flex p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-brand-maroon transition-colors"
                        title="Preview Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={item.editUrl}
                        className="inline-flex px-2.5 py-1 rounded-lg bg-brand-maroon text-white font-semibold hover:bg-brand-maroon-800 transition-colors text-[11px]"
                      >
                        Edit SEO
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
