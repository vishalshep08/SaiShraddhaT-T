import React from "react";
import { SITE_CONFIG, buildCanonicalUrl } from "@/config/seo";

/**
 * 1. LocalBusiness / TaxiService Structured Data Schema
 */
export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.tradeName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`,
    description:
      "Trusted local taxi, outstation cab, and pilgrimage darshan tour service operating from Sai Ashram, Shirdi since 2014. Owned Maruti Suzuki Ertiga & Chevrolet Tavera fleet with professional drivers.",
    foundingDate: `${SITE_CONFIG.establishedYear}`,
    telephone: SITE_CONFIG.contact.telephones.map((t) => t.number),
    priceRange: SITE_CONFIG.contact.priceRange,
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Direct Bank Transfer",
    openingHours: SITE_CONFIG.contact.openingHours,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.contact.address.streetAddress,
      addressLocality: SITE_CONFIG.contact.address.addressLocality,
      addressRegion: SITE_CONFIG.contact.address.addressRegion,
      postalCode: SITE_CONFIG.contact.address.postalCode,
      addressCountry: SITE_CONFIG.contact.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.contact.geo.latitude,
      longitude: SITE_CONFIG.contact.geo.longitude,
    },
    areaServed: SITE_CONFIG.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Sai Shraddha Cab & Tour Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Shirdi Local Taxi & Temple Transfers",
            description: "Pickups from Sai Ashram 1000 Rooms, hotel transfers, and temple darshan drops.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Shirdi to Nashik & Trimbakeshwar Jyotirlinga Cabs",
            description: "One-way drops and same-day darshan roundtrips in AC Ertiga and Tavera.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Shani Shingnapur Day Tour Cab Service",
            description: "Door-to-door temple darshan cab service with waiting allowance.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Shirdi Airport (SAG) Taxi Transfers",
            description: "Punctual airport pickup and drops with flight delay tracking.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * 2. BreadcrumbList Structured Data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbsJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.url),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * 3. FAQPage Structured Data
 */
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * 4. Service / Travel Route Structured Data
 */
export function ServiceJsonLd({
  name,
  description,
  serviceType,
  url,
}: {
  name: string;
  description: string;
  serviceType?: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType || "Taxi & Passenger Transportation",
    provider: {
      "@type": "TaxiService",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      telephone: SITE_CONFIG.contact.telephones[0]?.number,
    },
    url: buildCanonicalUrl(url),
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Maharashtra, India",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
