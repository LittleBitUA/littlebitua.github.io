// ─── RSS ───────────────────────────────────────────────────────
// Один запис на кожен звіт хронології: новий звіт — одне сповіщення
// в RSS-читалці з переліком того, що вийшло, оновилося й готується.
import type { APIRoute } from "astro";
import { reports } from "../lib/chronology";
import { SITE_URL } from "../utils/seo";

const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const GROUPS = [
  { kind: "released", label: "Вийшли" },
  { kind: "updated", label: "Оновлюються" },
  { kind: "upcoming", label: "Ще не вийшли" },
] as const;

export const GET: APIRoute = () => {
  const items = reports
    .map((r, i) => {
      const link = i === 0 ? `${SITE_URL}/chronology/` : `${SITE_URL}/chronology/${r.date}/`;
      const body = GROUPS.map((g) => {
        const list = r.entries.filter((e) => e.kind === g.kind);
        if (!list.length) return "";
        const li = list
          .map((e) => `<li>${e.date ? `${e.date} — ` : ""}${e.title}${e.note ? ` (${e.note})` : ""}</li>`)
          .join("");
        return `<h3>${g.label}</h3><ul>${li}</ul>`;
      }).join("");
      return `    <item>
      <title>${escapeXml(`Звіт про переклади станом на ${r.dateLabel}`)}</title>
      <link>${link}</link>
      <description>${escapeXml(body)}</description>
      <pubDate>${new Date(`${r.date}T12:00:00Z`).toUTCString()}</pubDate>
      <guid isPermaLink="false">${SITE_URL}/chronology/${r.date}/</guid>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>«Little Bit» — Хронологія перекладів</title>
    <link>${SITE_URL}/chronology/</link>
    <description>Звіти «Little Bit» про українські переклади: що вийшло, що оновлюється, що готується</description>
    <language>uk</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
