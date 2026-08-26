export type ContentStatus = "draft" | "published" | "archived";

export interface CMSServiceItem {
  id: string;
  title: string;
  slug: string;
  serviceCategory: string;
  shortDescription: string;
  fullDescription?: string;
  iconName?: string;
  featuredImageUrl?: string;
  imageAltText?: string;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSDestinationItem {
  id: string;
  name: string;
  slug: string;
  origin: string;
  approxDistanceKm?: number;
  approxTravelTime?: string;
  shortDescription: string;
  fullDescription?: string;
  highlights?: string[];
  primaryImageUrl?: string;
  imageAltText?: string;
  isPopular: boolean;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSRouteItem {
  id: string;
  title: string;
  slug: string;
  origin: string;
  destination: string;
  shortDescription: string;
  fullDescription?: string;
  approxDistanceKm?: number;
  approxTravelTime?: string;
  startingFare?: number;
  tripType: string;
  vehicleCategories?: string[];
  primaryImageUrl?: string;
  imageAltText?: string;
  isPopular: boolean;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  stops?: string[];
}

export interface CMSTourPackageItem {
  id: string;
  title: string;
  slug: string;
  duration: string;
  startingLocation: string;
  destinationsIncluded?: string[];
  vehicleCategoryOptions?: string[];
  startingFare?: number;
  shortDescription: string;
  fullDescription?: string;
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  primaryImageUrl?: string;
  imageAltText?: string;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSVehicleCategoryItem {
  id: string;
  name: string;
  slug: string;
  seatingCapacity: string;
  minPassengers: number;
  maxPassengers: number;
  luggageCapacity?: string;
  idealFor?: string;
  description?: string;
  availabilityNote?: string;
  imageUrl?: string;
  imageAltText?: string;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSVehicleItem {
  id: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  seatingCapacity: number;
  ownerType: "owned" | "partner_network";
  status: "available" | "assigned" | "on_trip" | "maintenance" | "inactive";
  fuelType?: string;
  acType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
