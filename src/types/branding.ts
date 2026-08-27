export interface BrandingSettings {
  businessName: string;
  tagline: string;
  establishedYear: number;
  logoUrl?: string;
  emblemUrl?: string;
  logoStoragePath?: string;
  logoAltText?: string;
  updatedAt?: string;
}

export const DEFAULT_BRANDING: BrandingSettings = {
  businessName: "Sai Shraddha Tours & Travels",
  tagline: "Safe Journeys • Happy Pilgrims • Sai Ashram, Shirdi",
  establishedYear: 2014,
  logoUrl: "/images/branding/official-logo.png",
  emblemUrl: "/images/branding/logo-emblem.png",
  logoAltText: "Sai Shraddha Tours & Travels - Shirdi (Serving Customers Since 2014)",
};
