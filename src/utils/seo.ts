// ─── SEO Utilities ───────────────────────────────────────────

import type { Game } from "../data/games";

export const SITE_URL = "https://littlebitua.github.io";
export const SITE_NAME = "«Little Bit» — Українська локалізація відеоігор";

export function generateGameStructuredData(game: Game): string {
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.description,
    "image": game.cover.startsWith("http") ? game.cover : `${SITE_URL}${game.cover}`,
    "inLanguage": "uk-UA",
    "gamePlatform": game.platform ?? ["PC", "PlayStation", "Xbox"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "UAH",
      "availability": "https://schema.org/InStock"
    },
  };

  if (game.steamUrl) structuredData["url"] = game.steamUrl;
  if (game.genre?.length) structuredData["genre"] = game.genre.join(", ");
  if (game.releaseDate) structuredData["datePublished"] = game.releaseDate;

  return JSON.stringify(structuredData, null, 2);
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbs(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  }, null, 2);
}

export function generateOrganizationData(): string {
  return JSON.stringify({
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
      "url": "https://t.me/LittleBitUA",
    },
    "sameAs": [
      "https://t.me/LittleBitUA",
      "https://lbklauncher.com",
      "https://donatello.to/LittleBitUA",
    ],
  }, null, 2);
}

export function generateKeywords(game?: Game): string {
  const base = ["українська локалізація", "переклад ігор", "ukrainian translation", "ігри українською", "Little Bit"];
  if (!game) return base.join(", ");
  const extras = [game.title, ...(game.tags ?? []), ...(game.genre ?? []), game.series].filter(Boolean);
  return [...base, ...extras].join(", ");
}
