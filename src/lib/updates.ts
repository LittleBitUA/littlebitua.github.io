// ─── Стрічка «Що нового» ───────────────────────────────────────
// Лише події зі справжніми датами:
//  • оновлення перекладу в LBK Launcher — дата, версія й поточні відсотки;
//  • зміни з журналу прогресу, якщо для них записано дату оновлення з лаунчера (поле `u`);
//  • виходи перекладів (releaseDate у games.ts);
//  • пости Telegram-каналу про наші ігри.
import type { Game } from "../data/games";
import log from "../data/progress-log.json";
import { stagesOf, translationPercent } from "../utils/status";
import { telegramPosts } from "./telegram";

type Point = { date: string; t: number; e?: number; v?: string; u?: string };

export interface Update {
  date: string;
  game: Game;
  kind: "release" | "version" | "progress" | "telegram";
  /** Що змінилося, коротко: «версія 2.2 · переклад 95%» */
  parts: string[];
  /** Для постів: заголовок і посилання */
  title?: string;
  url?: string;
}

const LOG = log as Record<string, Point[]>;
const editingOf = (g: Game) => stagesOf(g).find((s) => /редакт/i.test(s.label))?.percent ?? null;

let cache: Promise<Update[]> | null = null;

export function getUpdates(games: Game[]): Promise<Update[]> {
  cache ??= (async () => {
    const out: Update[] = [];
    for (const game of games) {
      // Останнє оновлення перекладу в лаунчері
      if (game.translationUpdated) {
        const e = editingOf(game);
        out.push({
          date: game.translationUpdated,
          game,
          kind: game.version ? "version" : "progress",
          parts: [
            ...(game.version ? [`версія ${game.version}`] : []),
            `переклад ${Math.round(translationPercent(game))}%`,
            ...(e != null && e > 0 ? [`редактура ${Math.round(e)}%`] : []),
          ],
        });
      }
      // Попередні оновлення — з журналу, лише ті, де відома дата з лаунчера
      const pts = LOG[game.id] ?? [];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (!b.u || b.u === game.translationUpdated || b.u === a.u) continue;
        const parts: string[] = [];
        if (b.v && b.v !== a.v) parts.push(`версія ${b.v}`);
        if (b.t > a.t) parts.push(`переклад ${a.t} → ${b.t}%`);
        if (b.e != null && b.e > (a.e ?? 0)) parts.push(`редактура ${a.e ?? 0} → ${b.e}%`);
        if (parts.length) out.push({ date: b.u, game, kind: b.v && b.v !== a.v ? "version" : "progress", parts });
      }
      if (game.releaseDate) out.push({ date: game.releaseDate, game, kind: "release", parts: ["вийшов переклад"] });
    }
    for (const p of await telegramPosts(games)) {
      out.push({ date: p.date, game: p.game, kind: "telegram", parts: p.excerpt ? [p.excerpt] : [], title: p.title, url: p.url });
    }
    // Свіжіше — вище; в один день реліз і пост важливіші за відсотки
    const rank = { release: 0, telegram: 1, version: 2, progress: 3 };
    return out.sort((x, y) => y.date.localeCompare(x.date) || rank[x.kind] - rank[y.kind]);
  })();
  return cache;
}

const MONTHS = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
export const dayLabel = (iso: string) => `${+iso.slice(8, 10)} ${MONTHS[+iso.slice(5, 7) - 1]}`;
