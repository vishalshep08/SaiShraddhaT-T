import { Metadata } from "next";
import { BUSINESS_CONFIG } from "./constants";

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  canonicalPath = "/",
  ogImage = "/images/branding/og-image.png",
  noIndex = false,
}: SEOProps = {}): Metadata {
  let pageTitle = `${BUSINESS_CONFIG.name} — Trusted Shirdi Taxi & Tour Service Since ${BUSINESS_CONFIG.establishedYear}`;

  if (title) {
    if (title.includes(BUSINESS_CONFIG.name)) {
      pageTitle = title;
    } else {
      pageTitle = `${title} | ${BUSINESS_CONFIG.name}`;
    }
  }

  const pageDescription =
    description ||
    "Sai Shraddha Tours & Travels — Shirdi's trusted taxi, pilgrimage and outstation cab service operating since 2014 from Sai Ashram. Owned Ertiga & Tavera fleet, airport transfers, Nashik, Shani Shingnapur & Ellora darshan tours.";

  const canonicalUrl = `${BUSINESS_CONFIG.siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: "/icon.png", sizes: "64x64", type: "image/png" },
        { url: "/images/branding/logo-emblem.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/icon.png"],
    },
    manifest: "/manifest.json",
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: BUSINESS_CONFIG.name,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${BUSINESS_CONFIG.siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${BUSINESS_CONFIG.name} — Shirdi (Serving Since ${BUSINESS_CONFIG.establishedYear})`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage.startsWith("http") ? ogImage : `${BUSINESS_CONFIG.siteUrl}${ogImage}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generates Schema.org JSON-LD structured data for Shirdi LocalBusiness / TaxiService
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: BUSINESS_CONFIG.name,
    legalName: BUSINESS_CONFIG.tradeName,
    description: "Reliable Shirdi taxi, pilgrimage tour and airport transfer services serving customers since 2014 from Sai Ashram.",
    url: BUSINESS_CONFIG.siteUrl,
    telephone: BUSINESS_CONFIG.primaryPhone,
    email: BUSINESS_CONFIG.email,
    foundingDate: "2014",
    priceRange: "₹₹",
    logo: `${BUSINESS_CONFIG.siteUrl}/images/branding/official-logo.png`,
    image: `${BUSINESS_CONFIG.siteUrl}/images/branding/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sai Ashram (Bhakta Niwas 1000 Rooms)",
      addressLocality: "Shirdi",
      addressRegion: "Maharashtra",
      postalCode: "423109",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "19.7667",
      longitude: "74.4767",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };
}
