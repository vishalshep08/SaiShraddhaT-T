export type ReviewSource = "google" | "direct" | "whatsapp" | "website" | "other";
export type ReviewStatus = "draft" | "published" | "archived";

export interface ReviewItem {
  id: string;
  customerDisplayName: string;
  reviewText: string;
  rating: number; // 1 to 5
  source: ReviewSource;
  reviewDate: string; // YYYY-MM-DD
  serviceName?: string;
  destinationName?: string;
  isVerified: boolean;
  isFeatured: boolean;
  displayOrder: number;
  status: ReviewStatus;
  originalUrl?: string;
  imageUrl?: string;
  imageAltText?: string;
  hasPhotoConsent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FAQCategory =
  | "general"
  | "shirdi_travel"
  | "vehicle"
  | "booking"
  | "pilgrimage"
  | "airport_transfer"
  | "outstation"
  | "group_travel";

export type FAQStatus = "draft" | "published" | "archived";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  contextType?: "service" | "destination" | "package" | "route" | "general";
  contextSlug?: string;
  displayOrder: number;
  status: FAQStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  googleReviewUrl?: string;
  googleBusinessProfileUrl?: string;
  trustHeadline?: string;
}
