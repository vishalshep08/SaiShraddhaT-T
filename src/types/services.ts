export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullOverview: string;
  category: "local" | "outstation" | "pilgrimage" | "group" | "airport" | "event" | "custom";
  iconName: string;
  suitableFor: string[];
  recommendedVehicleCategorySlugs: string[];
  keyHighlights: string[];
  coverageAreas: string[];
  howItWorks: ServiceStep[];
  faqs: ServiceFAQ[];
  seoTitle: string;
  seoDescription: string;
  ctaLabel: string;
}

export interface VehicleCategoryItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  typicalCapacity: string;
  maxPassengers: number;
  luggageCapacity: string;
  acType: string;
  bestFor: string;
  description: string;
  isOwned: boolean;
  ownershipLabel: "Owned Fleet" | "Available On Request";
  ownedCountText?: string;
  features: string[];
  displayOrder: number;
}
