export type EnquiryType =
  | "general"
  | "service"
  | "route"
  | "destination"
  | "tour"
  | "vehicle"
  | "custom_trip";

export type RequestIntent = "quote" | "booking_request" | "general_enquiry";

export type TripType =
  | "one_way"
  | "round_trip"
  | "local"
  | "multi_day"
  | "airport_transfer"
  | "sightseeing"
  | "custom_trip";

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "quote_discussed"
  | "follow_up"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "lost";

export interface EnquiryContextData {
  enquiryType?: EnquiryType;
  requestIntent?: RequestIntent;
  sourcePage?: string;
  serviceId?: string;
  serviceSlug?: string;
  serviceName?: string;
  routeId?: string;
  routeSlug?: string;
  origin?: string;
  destination?: string;
  destinationId?: string;
  destinationSlug?: string;
  packageId?: string;
  packageSlug?: string;
  packageName?: string;
  vehicleCategoryId?: string;
  vehicleCategorySlug?: string;
  vehicleName?: string;
  tripType?: TripType;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface EnquiryFormData {
  // Honeypot for spam bot detection
  website_field_hp?: string;

  // Intent & Context
  requestIntent: RequestIntent;
  enquiryType: EnquiryType;
  sourcePage: string;

  // Customer Contact
  customerName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  sameAsMobile: boolean;
  email?: string;

  // Journey Details
  pickupLocation: string;
  destination: string;
  tripType: TripType;
  travelDate?: string;
  returnDate?: string;
  pickupTime?: string;
  passengerCount: number;
  childrenCount?: number;
  vehicleCategorySlug?: string;
  additionalRequirements?: string;

  // Relational Snapshots / Slugs
  serviceSlug?: string;
  routeSlug?: string;
  destinationSlug?: string;
  packageSlug?: string;

  // Marketing attribution
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface EnquirySubmissionResult {
  success: boolean;
  referenceNumber?: string;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  submittedData?: {
    referenceNumber: string;
    customerName: string;
    pickupLocation: string;
    destination: string;
    travelDate?: string;
    passengerCount: number;
    vehiclePreference?: string;
    requestIntent: RequestIntent;
  };
}
