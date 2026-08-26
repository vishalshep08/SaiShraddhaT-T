"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  Inbox,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  MapPin,
  Globe,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Info,
  ArrowRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import {
  AnalyticsDashboardData,
  AnalyticsDateRangeKey,
  ReportType,
  ReportResponse,
} from "@/types/analytics";
import { getAnalyticsReportDataAction } from "@/actions/analyticsActions";
import { SimpleTrendChart } from "./SimpleTrendChart";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AnalyticsDashboardProps {
  initialData: AnalyticsDashboardData;
}

export function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"overview" | "routes" | "fleet" | "reports">("overview");
  const [reportType, setReportType] = useState<ReportType>("daily_operations");
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Custom date picker state
  const [customStart, setCustomStart] = useState(initialData.range.startDate);
  const [customEnd, setCustomEnd] = useState(initialData.range.endDate);

  const kpis = initialData.kpis;
  const range = initialData.range;

  const datePresets: { key: AnalyticsDateRangeKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "last_7_days", label: "Last 7 Days" },
    { key: "last_30_days", label: "Last 30 Days" },
    { key: "this_month", label: "This Month" },
    { key: "last_month", label: "Last Month" },
    { key: "this_year", label: "This Year" },
  ];

  const handleRangeChange = (key: AnalyticsDateRangeKey) => {
    startTransition(() => {
      if (key === "custom") {
        router.push(`/admin/analytics?range=custom&start=${customStart}&end=${customEnd}`);
      } else {
        router.push(`/admin/analytics?range=${key}`);
      }
    });
  };

  const handleFetchReport = async (type: ReportType) => {
    setReportType(type);
    setIsReportLoading(true);
    try {
      const res = await getAnalyticsReportDataAction(
        type,
        range.key,
        range.startDate,
        range.endDate
      );
      setReportData(res);
    } catch (e) {
      console.error("Failed to load report", e);
    } finally {
      setIsReportLoading(false);
    }
  };

  const exportCSV = () => {
    if (!reportData || reportData.rows.length === 0) return;

    const headers = reportData.columns.map((c) => `"${c.label}"`).join(",");
    const rows = reportData.rows.map((row) =>
      reportData.columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sai_Shraddha_${reportData.reportType}_${range.startDate}_to_${range.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Date Range Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {datePresets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => handleRangeChange(preset.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  range.key === preset.key
                    ? "bg-brand-maroon text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Picker & Refresh */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1">
              <span className="text-[11px] font-bold text-stone-500">From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="text-xs bg-transparent focus:outline-none"
              />
              <span className="text-[11px] font-bold text-stone-500">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="text-xs bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRangeChange("custom")}
                className="ml-1 px-2 py-0.5 rounded bg-brand-charcoal-900 text-white text-xs font-bold hover:bg-black"
              >
                Apply
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
              disabled={isPending}
              className="font-bold flex items-center gap-1.5 h-8 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <div className="text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-100 pt-2">
          <span>Active Period: <strong>{range.label}</strong> ({range.startDate} → {range.endDate}, Asia/Kolkata)</span>
          <span>Calculated directly from live database records</span>
        </div>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Enquiries */}
        <Link
          href="/admin/enquiries"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-brand-maroon/30 transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Enquiries</span>
            <Inbox className="w-4 h-4 text-stone-400 group-hover:text-brand-maroon" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal-900">{kpis.totalEnquiries}</div>
          <div className="text-[10px] text-stone-500">
            {kpis.totalEnquiriesChange != null ? (
              <span className={kpis.totalEnquiriesChange >= 0 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                {kpis.totalEnquiriesChange >= 0 ? `+${kpis.totalEnquiriesChange}%` : `${kpis.totalEnquiriesChange}%`} vs prev
              </span>
            ) : (
              <span>New period</span>
            )}
          </div>
        </Link>

        {/* Confirmed Bookings */}
        <Link
          href="/admin/bookings"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-brand-maroon/30 transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bookings</span>
            <CalendarCheck2 className="w-4 h-4 text-brand-maroon" />
          </div>
          <div className="text-2xl font-black text-brand-maroon">{kpis.confirmedBookings}</div>
          <div className="text-[10px] text-stone-500">
            {kpis.confirmedBookingsChange != null ? (
              <span className={kpis.confirmedBookingsChange >= 0 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                {kpis.confirmedBookingsChange >= 0 ? `+${kpis.confirmedBookingsChange}%` : `${kpis.confirmedBookingsChange}%`} vs prev
              </span>
            ) : (
              <span>New period</span>
            )}
          </div>
        </Link>

        {/* Completed Trips */}
        <Link
          href="/admin/operations"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500/30 transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{kpis.completedTrips}</div>
          <div className="text-[10px] text-stone-500">
            {kpis.completedTripsChange != null ? (
              <span className={kpis.completedTripsChange >= 0 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                {kpis.completedTripsChange >= 0 ? `+${kpis.completedTripsChange}%` : `${kpis.completedTripsChange}%`} vs prev
              </span>
            ) : (
              <span>New period</span>
            )}
          </div>
        </Link>

        {/* Conversion Rate */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conversion</span>
            <TrendingUp className="w-4 h-4 text-brand-saffron-600" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal-900">
            {kpis.conversionRate !== null ? `${kpis.conversionRate}%` : "—"}
          </div>
          <div className="text-[10px] text-stone-400">Bookings ÷ Enquiries</div>
        </div>

        {/* Upcoming Operational Trips */}
        <Link
          href="/admin/operations"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-blue-500/30 transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{kpis.upcomingTrips}</div>
          <div className="text-[10px] text-stone-400">Future scheduled</div>
        </Link>

        {/* Cancelled Bookings */}
        <Link
          href="/admin/bookings?status=cancelled"
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-rose-500/30 transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-700">{kpis.cancelledBookings}</div>
          <div className="text-[10px] text-stone-400">Cancelled bookings</div>
        </Link>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "overview" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Overview &amp; Trends
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("routes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "routes" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Popular Routes ({initialData.destinations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("fleet")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "fleet" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Fleet Usage ({initialData.vehicles.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("reports");
            if (!reportData) handleFetchReport(reportType);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "reports" ? "bg-brand-maroon text-white" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Reports &amp; CSV Export
        </button>
      </div>

      {/* 4. Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-brand-charcoal-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-maroon" />
                <span>Enquiries &amp; Bookings Activity</span>
              </h2>
            </div>
            <SimpleTrendChart data={initialData.trends} />
          </div>

          {/* Enquiry Funnel */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3">
              Customer Journey &amp; Conversion Funnel
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {initialData.funnel.map((stage, idx) => (
                <div
                  key={stage.stage}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-center space-y-1"
                >
                  <p className="text-[11px] font-bold text-stone-500 uppercase">{stage.label}</p>
                  <p className="text-xl font-extrabold text-brand-charcoal-900">{stage.count}</p>
                  <p className="text-[10px] text-stone-400">{stage.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources & Popular Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-maroon" />
                <span>Lead Source Attribution</span>
              </h2>

              {initialData.leadSources.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">No source records for this period.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {initialData.leadSources.map((src) => (
                    <div key={src.source} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-charcoal-900">{src.source}</span>
                      <div className="flex items-center gap-4 text-stone-600">
                        <span>{src.enquiries} Enquiries</span>
                        <span className="font-bold text-brand-maroon">{src.bookings} Bookings</span>
                        {src.conversionRate !== null && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {src.conversionRate}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Services */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-maroon" />
                <span>Popular Travel Services</span>
              </h2>

              {initialData.services.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">No service records for this period.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {initialData.services.map((srv) => (
                    <div key={srv.serviceSlug} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-charcoal-900">{srv.serviceTitle}</span>
                      <div className="flex items-center gap-4 text-stone-600">
                        <span>{srv.enquiries} Leads</span>
                        <span className="font-bold text-brand-maroon">{srv.bookings} Bookings</span>
                        <span>{srv.completedTrips} Done</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === "routes" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <h2 className="text-sm font-bold text-brand-charcoal-900">
              Popular Pilgrimage Routes &amp; Destinations
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Ranked by combined customer booking and enquiry volume in {range.label}.
            </p>
          </div>

          {initialData.destinations.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">No destination data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Destination / Route</th>
                    <th className="py-3 px-4 font-bold text-center">Enquiries</th>
                    <th className="py-3 px-4 font-bold text-center">Bookings</th>
                    <th className="py-3 px-4 font-bold text-center">Completed</th>
                    <th className="py-3 px-4 font-bold text-center">Cancelled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {initialData.destinations.map((d) => (
                    <tr key={d.destination} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-brand-charcoal-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-maroon" />
                        <span>{d.destination}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-stone-600">{d.enquiries}</td>
                      <td className="py-3 px-4 text-center font-bold text-brand-maroon">{d.bookings}</td>
                      <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{d.completedTrips}</td>
                      <td className="py-3 px-4 text-center text-stone-400">{d.cancelled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Fleet Usage Tab */}
      {activeTab === "fleet" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <h2 className="text-sm font-bold text-brand-charcoal-900">
              Vehicle Utilization &amp; Fleet Assignments
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Directly owned fleet (3× Ertiga, 1× Tavera) and partner network assignments.
            </p>
          </div>

          {initialData.vehicles.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">No vehicles registered in fleet yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Vehicle</th>
                    <th className="py-3 px-4 font-bold">Ownership</th>
                    <th className="py-3 px-4 font-bold text-center">Capacity</th>
                    <th className="py-3 px-4 font-bold text-center">Trips in Period</th>
                    <th className="py-3 px-4 font-bold text-center">Completed</th>
                    <th className="py-3 px-4 font-bold text-center">Upcoming</th>
                    <th className="py-3 px-4 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {initialData.vehicles.map((v) => (
                    <tr key={v.vehicleId} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-brand-charcoal-900">{v.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.ownerType === "owned"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {v.ownerType === "owned" ? "Owned Fleet" : "Partner Network"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-stone-600">{v.seatingCapacity} Seats</td>
                      <td className="py-3 px-4 text-center font-bold text-brand-charcoal-900">{v.totalTrips}</td>
                      <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{v.completedTrips}</td>
                      <td className="py-3 px-4 text-center text-blue-700 font-semibold">{v.upcomingTrips}</td>
                      <td className="py-3 px-4 text-right capitalize text-stone-500">{v.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reports & Export Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-brand-charcoal-900">Select Business Report</h2>
                <p className="text-xs text-stone-500">
                  Generate tabular logs for export to CSV or printing.
                </p>
              </div>

              {reportData && reportData.rows.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={exportCSV}
                    className="font-bold flex items-center gap-1.5 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </Button>

                  <Link
                    href={`/admin/operations/print?date=${range.startDate}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dispatch</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { type: "daily_operations", label: "Daily Summary" },
                { type: "enquiries", label: "Enquiries Log" },
                { type: "bookings", label: "Bookings Log" },
                { type: "trips", label: "Trips & Dispatch" },
              ].map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => handleFetchReport(r.type as ReportType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    reportType === r.type
                      ? "bg-brand-maroon text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            {isReportLoading ? (
              <div className="p-12 text-center text-xs text-stone-400">Loading report data...</div>
            ) : !reportData || reportData.rows.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-400">
                No records found for this report and period.
              </div>
            ) : (
              <div>
                <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-charcoal-900">{reportData.title}</span>
                  <span className="text-stone-500">{reportData.totalCount} records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                      <tr>
                        {reportData.columns.map((c) => (
                          <th key={c.key} className="py-2.5 px-4 font-bold">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {reportData.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                          {reportData.columns.map((c) => (
                            <td key={c.key} className="py-2.5 px-4 text-stone-700">
                              {row[c.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Help & Documentation Footnote */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-500 space-y-1">
        <p className="font-bold text-stone-700 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-brand-maroon" />
          <span>How Business Metrics Are Calculated</span>
        </p>
        <p>
          • <strong>Conversion Rate:</strong> Confirmed Bookings ÷ Total Enquiries in the selected period × 100.
        </p>
        <p>
          • <strong>Timezone:</strong> All daily groupings and filter ranges strictly use <code>Asia/Kolkata</code> (UTC+05:30).
        </p>
        <p>
          • <strong>Traceability:</strong> Every metric derives directly from real enquiries and bookings without fabricated projections.
        </p>
      </div>
    </div>
  );
}
