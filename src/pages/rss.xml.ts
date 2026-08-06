import type { APIRoute } from "astro";
import { getAllUpdates } from "../utils/updates";
import { SITE_URL } from "../utils/seo";

/** Convert YYYY-MM-DD to RFC 822 (RSS pubDate). Parse as UTC noon to avoid
 *  timezone boundary shifting the date by ±1 day. */
function toRFC822(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00Z`).toUTCString();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = () => {
  const updates = getAllUpdates();

  const items = updates
    .map((event) => {
      const link = `${SITE_URL}/games/${event.gameId}/`;
      const guid = `${link}${event.date}`;
      return `    <item>
      <title>${escapeXml(event.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(event.description)}</description>
      <pubDate>${toRFC822(event.date)}</pubDate>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Little Bit — Оновлення локалізацій</title>
    <link>${SITE_URL}/</link>
    <description>Усі оновлення проєктів локалізації Little Bit</description>
    <language>uk</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
