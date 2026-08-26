import { EnquiryStatus, RequestIntent, TripType } from "./enquiry";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  isActive: boolean;
  createdAt: string;
}

export interface EnquiryNoteItem {
  id: string;
  enquiryId: string;
  authorId?: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface EnquiryStatusHistoryItem {
  id: string;
  enquiryId: string;
  oldStatus: EnquiryStatus;
  newStatus: EnquiryStatus;
  changedBy?: string;
  changedByName: string;
  changedAt: string;
}

export interface AdminEnquiryItem {
  id: string;
  referenceNumber: string;
  customerName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email?: string;
  pickupLocation: string;
  destination: string;
  tripType: TripType;
  travelDate?: string;
  returnDate?: string;
  pickupTime?: string;
  passengerCount: number;
  childrenCount?: number;
  vehicleCategorySlug?: string;
  vehiclePreferenceText?: string;
  additionalRequirements?: string;
  requestIntent: RequestIntent;
  enquiryType: string;
  sourcePage?: string;
  serviceSlug?: string;
  routeSlug?: string;
  destinationSlug?: string;
  packageSlug?: string;
  status: EnquiryStatus;
  internalNotes?: string;
  followUpAt?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  // Module 9 — Source Attribution
  landingPage?: string;
  contextType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  notes?: EnquiryNoteItem[];
  statusHistory?: EnquiryStatusHistoryItem[];
}

export interface DashboardMetrics {
  newEnquiriesCount: number;
  todayEnquiriesCount: number;
  followUpsCount: number;
  confirmedUpcomingCount: number;
  recentEnquiries: AdminEnquiryItem[];
}
