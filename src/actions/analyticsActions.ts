"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  AnalyticsDateRange,
  AnalyticsDateRangeKey,
  AnalyticsDashboardData,
  KPICardsData,
  FunnelStageItem,
  TrendDataPoint,
  LeadSourceItem,
  ServiceAnalyticsItem,
  DestinationAnalyticsItem,
  VehicleAnalyticsItem,
  ReportType,
  ReportResponse,
} from "@/types/analytics";
import { CORE_SERVICES, POPULAR_DESTINATIONS } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// TIMEZONE & DATE RANGE HELPERS (Asia/Kolkata UTC+05:30)
// ─────────────────────────────────────────────────────────────────────────────

function getKolkataDate(offsetDays: number = 0): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kolkataTime = new Date(utc + 3600000 * 5.5);
  if (offsetDays !== 0) {
    kolkataTime.setDate(kolkataTime.getDate() + offsetDays);
  }
  return kolkataTime;
}

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function resolveAnalyticsDateRange(
  rangeKey: AnalyticsDateRangeKey = "last_30_days",
  customStart?: string,
  customEnd?: string
): Promise<AnalyticsDateRange> {
  const today = getKolkataDate(0);
  const todayStr = formatDateString(today);

  let startDate = todayStr;
  let endDate = todayStr;
  let label = "Last 30 Days";
  let prevStart = todayStr;
  let prevEnd = todayStr;

  switch (rangeKey) {
    case "today": {
      startDate = todayStr;
      endDate = todayStr;
      label = "Today";
      const y = getKolkataDate(-1);
      prevStart = formatDateString(y);
      prevEnd = formatDateString(y);
      break;
    }
    case "yesterday": {
      const y = getKolkataDate(-1);
      startDate = formatDateString(y);
      endDate = formatDateString(y);
      label = "Yesterday";
      const dayBefore = getKolkataDate(-2);
      prevStart = formatDateString(dayBefore);
      prevEnd = formatDateString(dayBefore);
      break;
    }
    case "last_7_days": {
      const s = getKolkataDate(-6);
      startDate = formatDateString(s);
      endDate = todayStr;
      label = "Last 7 Days";
      const ps = getKolkataDate(-13);
      const pe = getKolkataDate(-7);
      prevStart = formatDateString(ps);
      prevEnd = formatDateString(pe);
      break;
    }
    case "this_month": {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = formatDateString(firstDay);
      endDate = todayStr;
      label = "This Month";
      const prevMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const prevMonthLast = new Date(today.getFullYear(), today.getMonth(), 0);
      prevStart = formatDateString(prevMonthFirst);
      prevEnd = formatDateString(prevMonthLast);
      break;
    }
    case "last_month": {
      const prevMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const prevMonthLast = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = formatDateString(prevMonthFirst);
      endDate = formatDateString(prevMonthLast);
      label = "Last Month";
      const twoMonthsAgoFirst = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      const twoMonthsAgoLast = new Date(today.getFullYear(), today.getMonth() - 1, 0);
      prevStart = formatDateString(twoMonthsAgoFirst);
      prevEnd = formatDateString(twoMonthsAgoLast);
      break;
    }
    case "this_year": {
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = formatDateString(firstDayOfYear);
      endDate = todayStr;
      label = `This Year (${today.getFullYear()})`;
      const prevYearFirst = new Date(today.getFullYear() - 1, 0, 1);
      const prevYearLast = new Date(today.getFullYear() - 1, 11, 31);
      prevStart = formatDateString(prevYearFirst);
      prevEnd = formatDateString(prevYearLast);
      break;
    }
    case "custom": {
      startDate = customStart || todayStr;
      endDate = customEnd || todayStr;
      label = `${startDate} to ${endDate}`;
      const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
      const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      const ps = new Date(new Date(startDate).getTime() - days * 86400000);
      const pe = new Date(new Date(startDate).getTime() - 86400000);
      prevStart = formatDateString(ps);
      prevEnd = formatDateString(pe);
      break;
    }
    case "last_30_days":
    default: {
      const s = getKolkataDate(-29);
      startDate = formatDateString(s);
      endDate = todayStr;
      label = "Last 30 Days";
      const ps = getKolkataDate(-59);
      const pe = getKolkataDate(-30);
      prevStart = formatDateString(ps);
      prevEnd = formatDateString(pe);
      break;
    }
  }

  return {
    key: rangeKey,
    startDate,
    endDate,
    label,
    previousStartDate: prevStart,
    previousEndDate: prevEnd,
  };
}

function calcPercentageChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD ANALYTICS ACTION
// ─────────────────────────────────────────────────────────────────────────────

export async function getAnalyticsDashboardAction(
  rangeKey: AnalyticsDateRangeKey = "last_30_days",
  customStart?: string,
  customEnd?: string
): Promise<AnalyticsDashboardData> {
  const range = await resolveAnalyticsDateRange(rangeKey, customStart, customEnd);
  const todayStr = formatDateString(getKolkataDate(0));

  const emptyData: AnalyticsDashboardData = {
    range,
    kpis: {
      totalEnquiries: 0,
      totalEnquiriesChange: null,
      confirmedBookings: 0,
      confirmedBookingsChange: null,
      completedTrips: 0,
      completedTripsChange: null,
      upcomingTrips: 0,
      cancelledBookings: 0,
      conversionRate: null,
      totalBookingValue: 0,
    },
    funnel: [],
    trends: [],
    leadSources: [],
    services: [],
    destinations: [],
    vehicles: [],
    generatedAt: new Date().toISOString(),
  };

  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return emptyData;

    // 1. Current Period Enquiries
    const { data: currentEnquiriesRaw } = await (supabase.from("enquiries") as any)
      .select("*")
      .gte("created_at", `${range.startDate}T00:00:00.000Z`)
      .lte("created_at", `${range.endDate}T23:59:59.999Z`);

    const currentEnquiries = currentEnquiriesRaw || [];

    // 2. Previous Period Enquiries (for comparison)
    const { data: prevEnquiriesRaw } = await (supabase.from("enquiries") as any)
      .select("id")
      .gte("created_at", `${range.previousStartDate}T00:00:00.000Z`)
      .lte("created_at", `${range.previousEndDate}T23:59:59.999Z`);

    const prevEnquiriesCount = prevEnquiriesRaw ? prevEnquiriesRaw.length : 0;

    // 3. Current Period Bookings (matching either created_at or travel_date in range)
    const { data: currentBookingsRaw } = await (supabase.from("bookings") as any)
      .select("*")
      .gte("travel_date", range.startDate)
      .lte("travel_date", range.endDate);

    const currentBookings = currentBookingsRaw || [];

    // 4. Previous Period Bookings
    const { data: prevBookingsRaw } = await (supabase.from("bookings") as any)
      .select("id, status")
      .gte("travel_date", range.previousStartDate)
      .lte("travel_date", range.previousEndDate);

    const prevBookings = prevBookingsRaw || [];
    const prevConfirmedCount = prevBookings.filter((b: any) =>
      ["confirmed", "assigned", "in_progress", "completed"].includes(b.status)
    ).length;
    const prevCompletedCount = prevBookings.filter((b: any) => b.status === "completed").length;

    // 5. Upcoming Operational Trips (Travel date >= today, active status)
    const { count: upcomingCountRaw } = await (supabase.from("bookings") as any)
      .select("id", { count: "exact", head: true })
      .gte("travel_date", todayStr)
      .in("status", ["confirmed", "assigned", "in_progress"]);

    const upcomingTrips = upcomingCountRaw || 0;

    // 6. Registered Fleet
    const { data: vehiclesRaw } = await (supabase.from("vehicles") as any).select("*");
    const vehiclesList = vehiclesRaw || [];

    // ─────────────────────────────────────────────────────────────────────────
    // KPI CALCULATIONS
    // ─────────────────────────────────────────────────────────────────────────

    const totalEnquiries = currentEnquiries.length;
    const confirmedBookings = currentBookings.filter((b: any) =>
      ["confirmed", "assigned", "in_progress", "completed"].includes(b.status)
    ).length;
    const completedTrips = currentBookings.filter((b: any) => b.status === "completed").length;
    const cancelledBookings = currentBookings.filter((b: any) => b.status === "cancelled").length;

    // Total confirmed booking value
    const totalBookingValue = currentBookings
      .filter((b: any) => ["confirmed", "assigned", "in_progress", "completed"].includes(b.status))
      .reduce((sum: number, b: any) => sum + (Number(b.final_fare) || Number(b.quoted_fare) || 0), 0);

    // Conversion rate: Confirmed bookings ÷ Eligible enquiries × 100
    const conversionRate =
      totalEnquiries > 0 ? Math.round((confirmedBookings / totalEnquiries) * 100) : null;

    const kpis: KPICardsData = {
      totalEnquiries,
      totalEnquiriesChange: calcPercentageChange(totalEnquiries, prevEnquiriesCount),
      confirmedBookings,
      confirmedBookingsChange: calcPercentageChange(confirmedBookings, prevConfirmedCount),
      completedTrips,
      completedTripsChange: calcPercentageChange(completedTrips, prevCompletedCount),
      upcomingTrips,
      cancelledBookings,
      conversionRate,
      totalBookingValue: totalBookingValue > 0 ? totalBookingValue : undefined,
    };

    // ─────────────────────────────────────────────────────────────────────────
    // FUNNEL STAGES
    // ─────────────────────────────────────────────────────────────────────────

    const statusCounts: Record<string, number> = {
      new: 0,
      contacted: 0,
      quoted: 0,
      confirmed: confirmedBookings,
      completed: completedTrips,
    };

    currentEnquiries.forEach((e: any) => {
      const s = e.status || "new";
      if (s === "new") statusCounts.new++;
      else if (s === "contacted") statusCounts.contacted++;
      else if (s === "quote_discussed" || s === "follow_up") statusCounts.quoted++;
    });

    const funnel: FunnelStageItem[] = [
      {
        stage: "new",
        label: "New Leads",
        count: statusCounts.new,
        percentage: totalEnquiries > 0 ? Math.round((statusCounts.new / totalEnquiries) * 100) : 0,
      },
      {
        stage: "contacted",
        label: "Contacted",
        count: statusCounts.contacted,
        percentage: totalEnquiries > 0 ? Math.round((statusCounts.contacted / totalEnquiries) * 100) : 0,
      },
      {
        stage: "quoted",
        label: "Quote Discussed",
        count: statusCounts.quoted,
        percentage: totalEnquiries > 0 ? Math.round((statusCounts.quoted / totalEnquiries) * 100) : 0,
      },
      {
        stage: "confirmed",
        label: "Confirmed Bookings",
        count: statusCounts.confirmed,
        percentage: totalEnquiries > 0 ? Math.round((statusCounts.confirmed / totalEnquiries) * 100) : 0,
      },
      {
        stage: "completed",
        label: "Completed Journeys",
        count: statusCounts.completed,
        percentage: totalEnquiries > 0 ? Math.round((statusCounts.completed / totalEnquiries) * 100) : 0,
      },
    ];

    // ─────────────────────────────────────────────────────────────────────────
    // TREND DATA POINTS (Chronological Grouping)
    // ─────────────────────────────────────────────────────────────────────────

    const trendsMap: Record<string, { enquiries: number; bookings: number; completedTrips: number }> = {};

    // Initialize all dates in range (or sample days if long range)
    const startDateObj = new Date(range.startDate);
    const endDateObj = new Date(range.endDate);
    const curDate = new Date(startDateObj);

    while (curDate <= endDateObj) {
      const dateKey = formatDateString(curDate);
      trendsMap[dateKey] = { enquiries: 0, bookings: 0, completedTrips: 0 };
      curDate.setDate(curDate.getDate() + 1);
    }

    currentEnquiries.forEach((e: any) => {
      const dateKey = e.created_at ? e.created_at.split("T")[0] : null;
      if (dateKey && trendsMap[dateKey]) {
        trendsMap[dateKey].enquiries++;
      }
    });

    currentBookings.forEach((b: any) => {
      const dateKey = b.travel_date;
      if (dateKey && trendsMap[dateKey]) {
        if (["confirmed", "assigned", "in_progress", "completed"].includes(b.status)) {
          trendsMap[dateKey].bookings++;
        }
        if (b.status === "completed") {
          trendsMap[dateKey].completedTrips++;
        }
      }
    });

    const trends: TrendDataPoint[] = Object.keys(trendsMap)
      .sort()
      .map((dateStr) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        const dObj = new Date(Date.UTC(y, m - 1, d));
        const displayLabel = new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "short",
        }).format(dObj);

        return {
          date: dateStr,
          displayLabel,
          enquiries: trendsMap[dateStr].enquiries,
          bookings: trendsMap[dateStr].bookings,
          completedTrips: trendsMap[dateStr].completedTrips,
        };
      });

    // ─────────────────────────────────────────────────────────────────────────
    // LEAD SOURCES BREAKDOWN
    // ─────────────────────────────────────────────────────────────────────────

    const sourcesMap: Record<string, { enquiries: number; bookings: number }> = {};

    currentEnquiries.forEach((e: any) => {
      let src = "Website Form";
      if (e.utm_source) src = `Campaign (${e.utm_source})`;
      else if (e.source_page?.includes("whatsapp")) src = "WhatsApp Direct";
      else if (e.source_page?.includes("contact")) src = "Contact Page";
      else if (e.enquiry_type === "service") src = "Service Page";
      else if (e.enquiry_type === "route") src = "Route Page";
      else if (e.enquiry_type === "destination") src = "Destination Page";

      if (!sourcesMap[src]) sourcesMap[src] = { enquiries: 0, bookings: 0 };
      sourcesMap[src].enquiries++;
    });

    currentBookings.forEach((b: any) => {
      let src = b.booking_source ? b.booking_source.replace("_", " ") : "Website Booking";
      if (!sourcesMap[src]) sourcesMap[src] = { enquiries: 0, bookings: 0 };
      sourcesMap[src].bookings++;
    });

    const leadSources: LeadSourceItem[] = Object.keys(sourcesMap).map((src) => {
      const enq = sourcesMap[src].enquiries;
      const bks = sourcesMap[src].bookings;
      return {
        source: src,
        enquiries: enq,
        bookings: bks,
        conversionRate: enq > 0 ? Math.round((bks / enq) * 100) : null,
      };
    });

    // ─────────────────────────────────────────────────────────────────────────
    // POPULAR SERVICES BREAKDOWN
    // ─────────────────────────────────────────────────────────────────────────

    const servicesMap: Record<string, { title: string; enquiries: number; bookings: number; completed: number }> = {};

    CORE_SERVICES.forEach((s) => {
      servicesMap[s.slug] = { title: s.title, enquiries: 0, bookings: 0, completed: 0 };
    });

    currentEnquiries.forEach((e: any) => {
      if (e.service_slug && servicesMap[e.service_slug]) {
        servicesMap[e.service_slug].enquiries++;
      }
    });

    currentBookings.forEach((b: any) => {
      const match = CORE_SERVICES.find((s) => b.destination?.toLowerCase().includes(s.title.toLowerCase()));
      if (match && servicesMap[match.slug]) {
        servicesMap[match.slug].bookings++;
        if (b.status === "completed") servicesMap[match.slug].completed++;
      }
    });

    const services: ServiceAnalyticsItem[] = Object.keys(servicesMap)
      .map((slug) => {
        const item = servicesMap[slug];
        return {
          serviceSlug: slug,
          serviceTitle: item.title,
          enquiries: item.enquiries,
          bookings: item.bookings,
          completedTrips: item.completed,
          conversionRate: item.enquiries > 0 ? Math.round((item.bookings / item.enquiries) * 100) : null,
        };
      })
      .filter((s) => s.enquiries > 0 || s.bookings > 0);

    // ─────────────────────────────────────────────────────────────────────────
    // POPULAR DESTINATIONS BREAKDOWN
    // ─────────────────────────────────────────────────────────────────────────

    const destinationsMap: Record<string, { enquiries: number; bookings: number; completed: number; cancelled: number }> = {};

    currentEnquiries.forEach((e: any) => {
      const dest = e.destination || e.destination_slug || "Other / Unspecified";
      if (!destinationsMap[dest]) destinationsMap[dest] = { enquiries: 0, bookings: 0, completed: 0, cancelled: 0 };
      destinationsMap[dest].enquiries++;
    });

    currentBookings.forEach((b: any) => {
      const dest = b.destination || "Other";
      if (!destinationsMap[dest]) destinationsMap[dest] = { enquiries: 0, bookings: 0, completed: 0, cancelled: 0 };
      destinationsMap[dest].bookings++;
      if (b.status === "completed") destinationsMap[dest].completed++;
      if (b.status === "cancelled") destinationsMap[dest].cancelled++;
    });

    const destinations: DestinationAnalyticsItem[] = Object.keys(destinationsMap)
      .map((dest) => ({
        destination: dest,
        enquiries: destinationsMap[dest].enquiries,
        bookings: destinationsMap[dest].bookings,
        completedTrips: destinationsMap[dest].completed,
        cancelled: destinationsMap[dest].cancelled,
      }))
      .sort((a, b) => b.bookings + b.enquiries - (a.bookings + a.enquiries))
      .slice(0, 10);

    // ─────────────────────────────────────────────────────────────────────────
    // VEHICLE FLEET ANALYTICS
    // ─────────────────────────────────────────────────────────────────────────

    const vehicles: VehicleAnalyticsItem[] = vehiclesList.map((v: any) => {
      const vBookings = currentBookings.filter((b: any) => b.assigned_vehicle_id === v.id);
      const totalTrips = vBookings.length;
      const completedTrips = vBookings.filter((b: any) => b.status === "completed").length;
      const upcomingTrips = vBookings.filter((b: any) =>
        b.travel_date >= todayStr && ["confirmed", "assigned", "in_progress"].includes(b.status)
      ).length;

      return {
        vehicleId: v.id,
        name: v.display_name || v.name,
        ownerType: v.owner_type || "owned",
        seatingCapacity: Number(v.seating_capacity) || 6,
        totalTrips,
        completedTrips,
        upcomingTrips,
        status: v.status || "available",
      };
    });

    return {
      range,
      kpis,
      funnel,
      trends,
      leadSources,
      services,
      destinations,
      vehicles,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[Get Analytics Dashboard Error]:", err);
    return emptyData;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT GENERATION ACTION
// ─────────────────────────────────────────────────────────────────────────────

export async function getAnalyticsReportDataAction(
  reportType: ReportType,
  rangeKey: AnalyticsDateRangeKey = "last_30_days",
  customStart?: string,
  customEnd?: string
): Promise<ReportResponse> {
  const range = await resolveAnalyticsDateRange(rangeKey, customStart, customEnd);
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      reportType,
      title: "Report Unavailable",
      description: "Database connection could not be established.",
      columns: [],
      rows: [],
      totalCount: 0,
    };
  }

  switch (reportType) {
    case "enquiries": {
      const { data } = await (supabase.from("enquiries") as any)
        .select("*")
        .gte("created_at", `${range.startDate}T00:00:00.000Z`)
        .lte("created_at", `${range.endDate}T23:59:59.999Z`)
        .order("created_at", { ascending: false });

      const rows = (data || []).map((e: any) => ({
        date: e.created_at?.split("T")[0] || "—",
        reference: e.reference_number || e.id.slice(0, 8),
        customer: e.customer_name || "—",
        mobile: e.mobile_number || e.customer_mobile || "—",
        destination: e.destination || e.drop_location || "—",
        passengers: e.passenger_count || 1,
        status: (e.status || "new").toUpperCase(),
        source: e.utm_source ? `Campaign (${e.utm_source})` : e.enquiry_type || "Website",
      }));

      return {
        reportType,
        title: `Enquiries Report (${range.label})`,
        description: `Detailed log of customer travel enquiries received between ${range.startDate} and ${range.endDate}.`,
        columns: [
          { key: "date", label: "Date" },
          { key: "reference", label: "Ref #" },
          { key: "customer", label: "Customer" },
          { key: "mobile", label: "Mobile" },
          { key: "destination", label: "Destination" },
          { key: "passengers", label: "Pax" },
          { key: "status", label: "Status" },
          { key: "source", label: "Lead Source" },
        ],
        rows,
        totalCount: rows.length,
      };
    }

    case "bookings":
    case "trips": {
      const { data } = await (supabase.from("bookings") as any)
        .select("*")
        .gte("travel_date", range.startDate)
        .lte("travel_date", range.endDate)
        .order("travel_date", { ascending: true });

      const rows = (data || []).map((b: any) => ({
        travelDate: b.travel_date || "—",
        reference: b.booking_reference || b.id.slice(0, 8),
        customer: b.customer_name || "—",
        mobile: b.customer_mobile || "—",
        pickup: b.pickup_location || "Shirdi",
        destination: b.destination || "—",
        vehicle: b.assigned_vehicle_name || b.vehicle_category_name || "—",
        driver: b.assigned_driver_name || "—",
        fare: b.final_fare ? `₹${b.final_fare}` : b.quoted_fare ? `₹${b.quoted_fare}` : "—",
        status: (b.status || "confirmed").toUpperCase(),
      }));

      return {
        reportType,
        title: reportType === "trips" ? `Trips & Dispatch Report (${range.label})` : `Bookings Report (${range.label})`,
        description: `Detailed list of booked journeys scheduled between ${range.startDate} and ${range.endDate}.`,
        columns: [
          { key: "travelDate", label: "Travel Date" },
          { key: "reference", label: "Booking Ref" },
          { key: "customer", label: "Customer" },
          { key: "mobile", label: "Mobile" },
          { key: "pickup", label: "Pickup" },
          { key: "destination", label: "Destination" },
          { key: "vehicle", label: "Cab" },
          { key: "driver", label: "Driver" },
          { key: "fare", label: "Fare" },
          { key: "status", label: "Status" },
        ],
        rows,
        totalCount: rows.length,
      };
    }

    case "daily_operations":
    default: {
      const dashboard = await getAnalyticsDashboardAction(rangeKey, customStart, customEnd);
      const rows = dashboard.trends.map((t) => ({
        date: t.date,
        displayDate: t.displayLabel,
        enquiries: t.enquiries,
        bookings: t.bookings,
        completedTrips: t.completedTrips,
      }));

      return {
        reportType: "daily_operations",
        title: `Daily Performance Summary (${range.label})`,
        description: `Day-by-day count of incoming enquiries, confirmed bookings, and completed journeys.`,
        columns: [
          { key: "date", label: "Date" },
          { key: "displayDate", label: "Day" },
          { key: "enquiries", label: "Enquiries" },
          { key: "bookings", label: "Confirmed Bookings" },
          { key: "completedTrips", label: "Completed Trips" },
        ],
        rows,
        totalCount: rows.length,
      };
    }
  }
}
