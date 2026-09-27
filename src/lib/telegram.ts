// ─── Telegram news ─────────────────────────────────────────────
// Під час збірки бере останні пости з публічної сторінки t.me/s/LittleBitUA.
// Канал ділиться й чужими анонсами для лаунчера та особистими заявами,
// тому на сайт потрапляють лише пости, де згадано гру з нашого каталогу.
// Якщо Telegram недоступний, блок новин просто не показується.

import { games } from "../data/catalog";

const CHANNEL = "LittleBitUA";
const FETCH_TIMEOUT_MS = 15_000;

export interface TelegramPost {
  url: string;
  date: string; // ISO
  kicker: string; // перший рядок посту («⚡️ Переклад вийшов у ранній доступ!»)
  excerpt: string;
  game: (typeof games)[number];
}

const decode = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, " ").trim();

// Найдовші назви першими, щоб «Dead Rising Deluxe Remaster» мав пріоритет над «Dead Rising»
const titles = games
  .map((g) => ({ game: g, key: norm(g.title.replace(/[™®]/g, "")) }))
  .filter((t) => t.key.length >= 4)
  .sort((a, b) => b.key.length - a.key.length);

function findGame(text: string) {
  const hay = ` ${norm(text)} `;
  return titles.find((t) => hay.includes(` ${t.key} `))?.game;
}

export async function fetchTelegramPosts(limit = 3): Promise<TelegramPost[]> {
  if (process.env.TELEGRAM_SYNC === "off") return [];
  try {
    const res = await fetch(`https://t.me/s/${CHANNEL}`, {
      headers: { "User-Agent": "Mozilla/5.0 (littlebit-site)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const posts: TelegramPost[] = [];
    for (const block of html.split('<div class="tgme_widget_message_wrap').slice(1).reverse()) {
      const id = block.match(/data-post="([^"]+)"/)?.[1];
      const date = block.match(/<time datetime="([^"]+)"/)?.[1];
      const body = block.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
      if (!id || !date || !body) continue;
      const text = decode(body).trim();
      const game = findGame(text);
      if (!game) continue;
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      // Назву гри в уривок не беремо (вона вже є заголовком)
      const gameKey = norm(game.title.replace(/[™®]/g, ""));
      const rest = lines
        .slice(1)
        .filter((l) => norm(l) !== gameKey)
        .join(" ")
        .replace(/\s+/g, " ");
      const clip = (t: string, n: number) => (t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t);
      posts.push({
        url: `https://t.me/${id}`,
        date,
        kicker: clip(lines[0] ?? "", 90),
        excerpt: clip(rest, 170),
        game,
      });
      if (posts.length >= limit) break;
    }
    console.log(`[telegram] постів про наші ігри: ${posts.length}`);
    return posts;
  } catch (err) {
    console.warn(`[telegram] ${(err as Error).message}. Блок новин не показуємо.`);
    return [];
  }
}
