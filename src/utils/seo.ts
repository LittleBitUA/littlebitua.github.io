// ─── SEO Utilities ───────────────────────────────────────────
// Helper functions for generating SEO metadata, structured data, and Open Graph tags

import type { Game } from "../data/games";

export const SITE_URL = "https://littlebitua.github.io";
export const SITE_NAME = "«Little Bit» — Українська локалізація відеоігор";

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${SITE_URL}/${cleanPath}`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate OG description with character limit
 */
export function generateOGDescription(text: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const cleanText = text
    .replace(/[#*_`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  return truncateText(cleanText, maxLength);
}

/**
 * Generate Product structured data for a game (JSON-LD)
 */
export function generateGameStructuredData(game: Game): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": game.title,
    "description": game.description,
    "image": `${SITE_URL}${game.cover}`,
    "applicationCategory": "Game",
    "operatingSystem": "Windows, PlayStation, Xbox",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "UAH",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": game.progress / 20, // Convert 0-100 to 0-5 scale
      "ratingCount": "1",
      "bestRating": "5",
      "worstRating": "0"
    }
  };

  // Add URL if steam link exists
  if (game.steamUrl) {
    structuredData["url"] = game.steamUrl;
  }

  // Add genre if exists
  if (game.genre && game.genre.length > 0) {
    structuredData["genre"] = game.genre.join(", ");
  }

  // Add release date if available
  if (game.releaseDate) {
    structuredData["datePublished"] = game.releaseDate;
  }

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate BreadcrumbList structured data (JSON-LD)
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbs(items: BreadcrumbItem[]): string {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }));

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  return JSON.stringify(breadcrumbs, null, 2);
}

/**
 * Generate WebPage structured data (JSON-LD)
 */
export function generateWebPageData(
  title: string,
  description: string,
  url: string,
  image?: string
): string {
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": "uk-UA",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  };

  if (image) {
    webPage["image"] = image;
  }

  return JSON.stringify(webPage, null, 2);
}

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationData(): string {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Little Bit",
    "alternateName": "«Little Bit»",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/og.png`,
    "description": "Команда ентузіастів, що локалізує відеоігри українською мовою",
    "foundingDate": "2020",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://t.me/LittleBitUA"
    },
    "sameAs": [
      "https://t.me/LittleBitUA",
      "https://lbklauncher.com",
      "https://donatello.to/LittleBitUA"
    ]
  };

  return JSON.stringify(organization, null, 2);
}

/**
 * Get OG type based on page type
 */
export function getOGType(pageType: "website" | "article" | "game" = "website"): string {
  switch (pageType) {
    case "article":
      return "article";
    case "game":
      return "product"; // Custom type for games
    default:
      return "website";
  }
}

/**
 * Generate meta keywords from game data
 */
export function generateKeywords(game?: Game): string {
  const baseKeywords = [
    "українська локалізація",
    "переклад ігор",
    "ukrainian translation",
    "ігри українською",
    "Little Bit"
  ];

  if (game) {
    const gameKeywords = [
      game.title,
      ...(game.tags || []),
      ...(game.genre || []),
      game.series
    ].filter(Boolean);

    return [...baseKeywords, ...gameKeywords].join(", ");
  }

  return baseKeywords.join(", ");
}
