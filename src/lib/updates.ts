// ─── Стрічка «Що нового» ───────────────────────────────────────
// Події збираються з журналу прогресу (src/data/progress-log.json, щодня
// поповнює scripts/progress.mjs) і дат релізів з games.ts:
// зріс відсоток перекладу чи редактури, вийшла нова версія, вийшов переклад.
import type { Game } from "../data/games";
import log from "../data/progress-log.json";

type Point = { date: string; t: number; e?: number; v?: string };

export interface Update {
  date: string;
  game: Game;
  kind: "release" | "version" | "progress";
  /** Що змінилося, коротко: «переклад 60 → 68%», «версія 2.2» */
  parts: string[];
}

const LOG = log as Record<string, Point[]>;

export function updatesOf(games: Game[]): Update[] {
  const out: Update[] = [];
  for (const game of games) {
    const pts = LOG[game.id] ?? [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const parts: string[] = [];
      let kind: Update["kind"] = "progress";
      // Різке падіння — це виправлення даних, а не подія
      if (b.t > a.t && b.t - a.t < 100) parts.push(b.t >= 100 ? "текст перекладено повністю" : `переклад ${a.t} → ${b.t}%`);
      if (b.e != null && b.e > (a.e ?? 0)) parts.push(b.e >= 100 ? "редактуру завершено" : `редактура ${a.e ?? 0} → ${b.e}%`);
      if (b.v && a.v && b.v !== a.v) { parts.unshift(`версія ${b.v}`); kind = "version"; }
      if (parts.length) out.push({ date: b.date, game, kind, parts });
    }
    if (game.releaseDate) out.push({ date: game.releaseDate, game, kind: "release", parts: ["вийшов переклад"] });
  }
  // Свіжіше — вище; в один день реліз важливіший за відсотки
  const rank = { release: 0, version: 1, progress: 2 };
  return out.sort((x, y) => y.date.localeCompare(x.date) || rank[x.kind] - rank[y.kind]);
}

const MONTHS = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
export const dayLabel = (iso: string) => `${+iso.slice(8, 10)} ${MONTHS[+iso.slice(5, 7) - 1]}`;
