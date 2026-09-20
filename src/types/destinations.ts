export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  state: string;
  district: string;
  destinationType: "pilgrimage" | "heritage" | "city" | "hill_station" | "local_shirdi";
  shortDescription: string;
  fullOverview: string;
  whyVisitFromShirdi: string;
  keyAttractions: string[];
  approxDistanceKmText?: string;
  approxDurationText?: string;
  routeSlug: string;
  recommendedVehicleSlugs: string[];
  relatedPackageSlugs: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  startingFare?: number;
  placesCovered?: {
    name: string;
    description: string;
    image?: string;
  }[];
  galleryImages?: {
    url: string;
    alt: string;
    title?: string;
  }[];
}

export interface RouteItem {
  id: string;
  slug: string; // e.g. "shirdi-to-nashik"
  origin: string; // "Shirdi"
  destinationName: string; // "Nashik"
  destinationSlug: string; // "nashik"
  headline: string; // "Shirdi to Nashik Taxi & Cab Service"
  shortDescription: string;
  routeOverview: string;
  approxDistanceKmText: string;
  approxDurationText: string;
  highwayRoute: string; // e.g. "NH-160 / State Highway"
  tripTypesAvailable: string[]; // ["One-Way Drop", "Round Trip / Same-Day Return", "Multi-Day Tour"]
  recommendedVehicles: {
    groupSizeText: string;
    vehicleCategorySlug: string;
    vehicleName: string;
    capacityText: string;
  }[];
  keyStopsAlongRoute: string[];
  faqs: { question: string; answer: string }[];
  relatedRouteSlugs: string[];
  relatedPackageSlugs: string[];
  relatedServiceSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  startingFare?: number;
}

export interface TourPackageItem {
  id: string;
  slug: string; // e.g. "nashik-trimbakeshwar-darshan"
  title: string;
  shortDescription: string;
  fullOverview: string;
  packageType: "day_darshan" | "multi_day_yatra" | "jyotirlinga_circuit" | "custom_tour";
  durationText: string;
  destinationsCovered: string[];
  placesCoveredDetails: {
    placeName: string;
    significance: string;
  }[];
  recommendedVehicleSlugs: string[];
  suitableFor: string[];
  customizationNotes: string;
  faqs: { question: string; answer: string }[];
  relatedRouteSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}
