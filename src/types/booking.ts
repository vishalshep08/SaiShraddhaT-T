import { TripType } from "./enquiry";

export type BookingStatus =
  | "draft"
  | "confirmed"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type BookingPaymentStatus = "not_recorded" | "pending" | "partially_paid" | "paid";
export type BookingPaymentMethod = "cash" | "upi" | "bank_transfer" | "other";
export type BookingSource = "website" | "phone" | "whatsapp" | "walk_in" | "referral" | "existing_customer" | "other";
export type VehicleOwnerType = "owned" | "partner_network";
export type VehicleStatus = "available" | "assigned" | "on_trip" | "maintenance" | "inactive";
export type DriverStatus = "available" | "active" | "assigned" | "on_trip" | "inactive";

export interface VehicleImageItem {
  id: string;
  url: string;
  altText?: string;
  order: number;
}

export interface VehicleItem {
  id: string;
  name: string;
  displayName?: string;
  registrationNumber?: string;
  categoryId?: string;
  categoryName?: string;
  seatingCapacity: number;
  ownerType: VehicleOwnerType;
  status: VehicleStatus;
  fuelType?: string;
  acType?: string;
  notes?: string;
  description?: string;
  imageUrl?: string;
  images?: VehicleImageItem[];
  altText?: string;
  showInHero?: boolean;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverItem {
  id: string;
  name: string;
  mobileNumber: string;
  alternateMobile?: string;
  email?: string;
  status: DriverStatus;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStopItem {
  id: string;
  bookingId: string;
  stopOrder: number;
  location: string;
  landmark?: string;
  notes?: string;
}

export interface BookingNoteItem {
  id: string;
  bookingId: string;
  authorId?: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface BookingActivityItem {
  id: string;
  bookingId: string;
  actorName: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface BookingItem {
  id: string;
  bookingReference: string; // e.g. SSB-2026-0042
  enquiryId?: string;
  enquiryReference?: string;
  customerName: string;
  customerMobile: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  pickupLocation: string;
  pickupLandmark?: string;
  pickupNotes?: string;
  destination: string;
  destinationLandmark?: string;
  dropNotes?: string;
  travelDate: string;
  pickupTime?: string;
  returnDate?: string;
  returnPickupTime?: string;
  tripType: TripType;
  passengerCount: number;
  childrenCount?: number;
  vehicleCategoryId?: string;
  vehicleCategoryName?: string;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverMobile?: string;
  quotedFare?: number;
  finalFare?: number;
  advanceReceived?: number;
  balanceAmount?: number;
  paymentStatus: BookingPaymentStatus;
  paymentMethod?: BookingPaymentMethod;
  status: BookingStatus;
  journeyNotes?: string;
  journeyDescription?: string;
  customerRequirements?: string;
  internalAdminNotes?: string;
  cancellationReason?: string;
  bookingSource: BookingSource;
  createdAt: string;
  updatedAt: string;
  stops?: BookingStopItem[];
  notes?: BookingNoteItem[];
  activities?: BookingActivityItem[];
}
