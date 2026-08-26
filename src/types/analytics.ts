export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export interface AnalyticsDateRange {
  key: AnalyticsDateRangeKey;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string;
  previousStartDate: string;
  previousEndDate: string;
}

export interface KPICardsData {
  totalEnquiries: number;
  totalEnquiriesChange: number | null; // percentage change vs previous period
  confirmedBookings: number;
  confirmedBookingsChange: number | null;
  completedTrips: number;
  completedTripsChange: number | null;
  upcomingTrips: number; // operational future journeys
  cancelledBookings: number;
  conversionRate: number | null; // null if 0 enquiries
  totalBookingValue?: number; // total confirmed fare
}

export interface FunnelStageItem {
  stage: string;
  label: string;
  count: number;
  percentage: number; // % of total enquiries
}

export interface TrendDataPoint {
  date: string; // YYYY-MM-DD
  displayLabel: string; // "26 Aug"
  enquiries: number;
  bookings: number;
  completedTrips: number;
}

export interface LeadSourceItem {
  source: string;
  enquiries: number;
  bookings: number;
  conversionRate: number | null;
}

export interface ServiceAnalyticsItem {
  serviceSlug: string;
  serviceTitle: string;
  enquiries: number;
  bookings: number;
  completedTrips: number;
  conversionRate: number | null;
}

export interface DestinationAnalyticsItem {
  destination: string;
  enquiries: number;
  bookings: number;
  completedTrips: number;
  cancelled: number;
}

export interface VehicleAnalyticsItem {
  vehicleId: string;
  name: string;
  ownerType: "owned" | "partner_network";
  seatingCapacity: number;
  totalTrips: number;
  completedTrips: number;
  upcomingTrips: number;
  status: string;
}

export interface AnalyticsDashboardData {
  range: AnalyticsDateRange;
  kpis: KPICardsData;
  funnel: FunnelStageItem[];
  trends: TrendDataPoint[];
  leadSources: LeadSourceItem[];
  services: ServiceAnalyticsItem[];
  destinations: DestinationAnalyticsItem[];
  vehicles: VehicleAnalyticsItem[];
  generatedAt: string;
}

export type ReportType =
  | "daily_operations"
  | "enquiries"
  | "bookings"
  | "trips"
  | "vehicles"
  | "sources"
  | "destinations";

export interface ReportRowData {
  [key: string]: any;
}

export interface ReportResponse {
  reportType: ReportType;
  title: string;
  description: string;
  columns: { key: string; label: string }[];
  rows: ReportRowData[];
  totalCount: number;
}
