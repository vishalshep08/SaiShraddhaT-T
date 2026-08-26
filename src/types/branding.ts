export interface BrandingSettings {
  businessName: string;
  tagline: string;
  establishedYear: number;
  logoUrl?: string;
  logoStoragePath?: string;
  logoAltText?: string;
  updatedAt?: string;
}

export const DEFAULT_BRANDING: BrandingSettings = {
  businessName: "Sai Shraddha Tours & Travels",
  tagline: "Sai Ashram (Bhakta Niwas), Shirdi",
  establishedYear: 2014,
  logoAltText: "Sai Shraddha Tours & Travels, Shirdi",
};
