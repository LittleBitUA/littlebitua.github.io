// ─── Series Utilities ────────────────────────────────────────
// Групування ігор за серіями для сторінок /games/series/[slug]/

import { games, type Game } from "../data/catalog";
import { sortByStatus } from "./status";

/** "No More Heroes" → "no-more-heroes" */
export function seriesSlug(series: string): string {
  return series
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Серії, для яких є сенс робити окрему сторінку.
 * Одна гра в серії — тонкий контент, такі сторінки не генеруємо.
 */
export function getSeriesGroups(minCount = 2): { name: string; slug: string; games: Game[] }[] {
  const map = new Map<string, Game[]>();

  for (const game of games) {
    if (!game.series) continue;
    const list = map.get(game.series);
    if (list) list.push(game);
    else map.set(game.series, [game]);
  }

  return Array.from(map.entries())
    .filter(([, list]) => list.length >= minCount)
    .map(([name, list]) => ({
      name,
      slug: seriesSlug(name),
      games: sortByStatus(list),
    }))
    .sort((a, b) => b.games.length - a.games.length);
}

/** Чи має ця серія власну сторінку */
export function hasSeriesPage(series: string | undefined): boolean {
  if (!series) return false;
  return getSeriesGroups().some((g) => g.name === series);
}
