// ─── Пости з Telegram-каналу ───────────────────────────────────
// Публічна сторінка каналу t.me/s/LittleBitUA віддає останні пости в HTML.
// Під час збірки забираємо кілька сторінок і залишаємо лише пости про наші ігри
// (у каналі також виходять новини лаунчера про переклади інших команд).
// Якщо Telegram недоступний — просто повертаємо порожній список.
import type { Game } from "../data/games";

const CHANNEL = "LittleBitUA";
const PAGES = 4; // ~20 постів на сторінку
const TIMEOUT_MS = 15_000;

export interface TgPost {
  id: number;
  url: string;
  date: string; // РРРР-ММ-ДД (за Києвом)
  title: string;
  excerpt: string;
  game: Game;
}

const decode = (t: string) =>
  t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#0?39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const kyivDate = (iso: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Kyiv" }).format(new Date(iso));
const norm = (t: string) => t.toLowerCase().replace(/[™®©]/g, "").replace(/[«»"'’.,!?:;—–-]/g, " ").replace(/\s+/g, " ").trim();

// Назви, під якими гру згадують у постах, якщо вони не збігаються з назвою на сайті
const ALIASES: Record<string, string[]> = {
  "lad-ishin": ["ішін"],
  "lad-infinite-wealth": ["infinite wealth"],
  "yakuza-lad": ["yakuza like a dragon"],
  "kingdom-hearts-3": ["kingdom hearts iii", "kingdom hearts 3"],
};

/** Ключі для пошуку гри в тексті: назва, її частина до двокрапки (якщо вона однозначна), псевдоніми */
function keysOf(games: Game[]): { key: string; game: Game }[] {
  const prefix = (g: Game) => norm(g.title.split(":")[0]);
  const prefixCount = new Map<string, number>();
  for (const g of games) prefixCount.set(prefix(g), (prefixCount.get(prefix(g)) ?? 0) + 1);
  const out: { key: string; game: Game }[] = [];
  for (const g of games) {
    out.push({ key: norm(g.title), game: g });
    const p = prefix(g);
    if (p !== norm(g.title) && p.split(" ").length >= 2 && p.length >= 8 && prefixCount.get(p) === 1) out.push({ key: p, game: g });
    for (const a of ALIASES[g.id] ?? []) out.push({ key: norm(a), game: g });
  }
  // Довші ключі першими: «metal gear solid 4» раніше за «metal gear»
  return out.sort((a, b) => b.key.length - a.key.length);
}

async function page(before?: number): Promise<string | null> {
  try {
    const res = await fetch(`https://t.me/s/${CHANNEL}${before ? `?before=${before}` : ""}`, {
      headers: { "User-Agent": "littlebit-site/1.0" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

let cache: Promise<TgPost[]> | null = null;

export function telegramPosts(games: Game[]): Promise<TgPost[]> {
  cache ??= (async () => {
    if (process.env.TELEGRAM_SYNC === "off") return [];
    const keys = keysOf(games);
    const raw: { id: number; date: string; text: string }[] = [];
    let before: number | undefined;
    for (let i = 0; i < PAGES; i++) {
      const html = await page(before);
      if (!html) break;
      const chunks = html.split('data-post="').slice(1);
      const ids: number[] = [];
      for (const chunk of chunks) {
        const id = Number(chunk.match(/^[^/]+\/(\d+)"/)?.[1]);
        const date = chunk.match(/<time datetime="([^"]+)"/)?.[1];
        const body = chunk.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
        if (!id || !date) continue;
        ids.push(id);
        if (body) raw.push({ id, date, text: decode(body.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "")).trim() });
      }
      if (!ids.length) break;
      before = Math.min(...ids);
    }

    const posts: TgPost[] = [];
    const seen = new Set<number>();
    for (const p of raw.sort((a, b) => b.id - a.id)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      // Підсумки тижня й анонси перекладів інших команд — не про нас
      if (/^\W*Підсумки тижня/i.test(p.text)) continue;
      const team = p.text.match(/Команда:\s*([^\n]+)/)?.[1];
      if (team && !/little bit|солов/i.test(team)) continue;
      const text = ` ${norm(p.text)} `;
      const hit = keys.find((k) => text.includes(` ${k.key} `));
      if (!hit) continue;
      const lines = p.text.split("\n").map((l) => l.trim()).filter(Boolean);
      const title = lines[0].replace(/^[^\p{L}\p{N}«"]+/u, "").trim();
      const excerpt = lines.slice(1).join(" ").replace(/\s+/g, " ");
      posts.push({
        id: p.id,
        url: `https://t.me/${CHANNEL}/${p.id}`,
        date: kyivDate(p.date),
        title: title.length > 110 ? title.slice(0, 108) + "…" : title,
        excerpt: excerpt.length > 180 ? excerpt.slice(0, 178).replace(/\s+\S*$/, "") + "…" : excerpt,
        game: hit.game,
      });
    }
    return posts;
  })();
  return cache;
}
