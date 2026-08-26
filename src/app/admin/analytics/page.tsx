import React from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { getAnalyticsDashboardAction } from "@/actions/analyticsActions";
import { AnalyticsDateRangeKey } from "@/types/analytics";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface AdminAnalyticsPageProps {
  searchParams: {
    range?: AnalyticsDateRangeKey;
    start?: string;
    end?: string;
  };
}

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  const rangeKey = searchParams.range || "last_30_days";
  const data = await getAnalyticsDashboardAction(
    rangeKey,
    searchParams.start,
    searchParams.end
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Business Analytics &amp; Reporting
            </h1>
            <Badge variant="maroon" size="sm">
              Operational Intelligence
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real performance metrics, customer conversion, popular pilgrimage routes, and vehicle utilization.
          </p>
        </div>
      </div>

      <AnalyticsDashboard initialData={data} />
    </div>
  );
}
