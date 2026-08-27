/**
 * Centralized SEO & Business Identity Configuration
 * Sai Shraddha Tours & Travels (Trade Name: Sai Shraddha Rent A Car)
 * Shirdi, Maharashtra, India • Established 2014
 */

export const SITE_CONFIG = {
  name: "Sai Shraddha Tours & Travels",
  tradeName: "Sai Shraddha Rent A Car",
  tagline: "Trusted Shirdi Taxi, Outstation Cabs & Pilgrimage Darshan Tours Since 2014",
  establishedYear: 2014,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://saishraddhatravels.com",
  defaultOgImage: "/images/branding/og-image.png",
  locale: "en_IN",
  language: "en",

  // Physical Location & Contact (NAP Consistency)
  contact: {
    address: {
      streetAddress: "Near Sai Ashram (Bhakta Niwas 1000 Rooms), Pimpalwadi Road",
      addressLocality: "Shirdi",
      addressRegion: "Maharashtra",
      postalCode: "423109",
      addressCountry: "IN",
    },
    geo: {
      latitude: "19.7668",
      longitude: "74.4762",
    },
    telephones: [
      { name: "Ramesh Shep (Owner)", number: "+919890073081", display: "+91 98900 73081" },
    ],
    whatsapp: "+919890073081",
    email: "contact@saishraddhatravels.com",
    openingHours: "Mo-Su 00:00-23:59", // 24/7 Shirdi Cab Desk
    priceRange: "₹₹ (Affordable & Transparent)",
  },

  // Primary Business Focus
  serviceAreas: [
    "Shirdi",
    "Nashik",
    "Trimbakeshwar",
    "Shani Shingnapur",
    "Aurangabad (Chhatrapati Sambhajinagar)",
    "Ellora Caves & Grishneshwar",
    "Pune",
    "Mumbai",
    "Shirdi International Airport (SAG)",
  ],
};

/**
 * Builds clean, consistent page titles without duplicate branding
 */
export function buildPageTitle(pageTitle?: string): string {
  if (!pageTitle || !pageTitle.trim()) {
    return `${SITE_CONFIG.name} | Shirdi Taxi & Pilgrimage Cab Service`;
  }
  const cleanTitle = pageTitle.trim();
  if (
    cleanTitle.toLowerCase().includes("sai shraddha") ||
    cleanTitle.toLowerCase().includes("shirdi tours & travels")
  ) {
    return cleanTitle;
  }
  return `${cleanTitle} | ${SITE_CONFIG.name}`;
}

/**
 * Generates absolute canonical URL with consistent trailing slash handling
 */
export function buildCanonicalUrl(path: string = ""): string {
  const base = SITE_CONFIG.url.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`.replace(/\/+$/, "");
}
