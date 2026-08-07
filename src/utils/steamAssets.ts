// ─── Steam Store Assets ──────────────────────────────────────
// Обкладинки в games.ts — вертикальні постери 2:3. Вітрині магазину
// потрібні широкі формати. Steam роздає їх безкоштовно за appid,
// який уже є всередині steamUrl — 28 із 34 ігор.
//
// Перевірено (2026-08-08):
//   library_hero.jpg — 28/28
//   header.jpg       — 25/28 (немає в невиданих ігор)
// Тому в шаблоні обов'язковий onerror-фолбек на game.cover.

import type { Game } from "../data/games";

const STEAM_CDN = "https://shared.steamstatic.com/store_item_assets/steam/apps";

/** "https://store.steampowered.com/app/2582320/Mixtape/" → "2582320" */
export function steamAppId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/\/app\/(\d+)/);
  return m ? m[1] : null;
}

/** Широка капсула 460×215 — формат картки в Steam */
export function steamCapsule(game: Game): string | null {
  const id = steamAppId(game.steamUrl);
  return id ? `${STEAM_CDN}/${id}/header.jpg` : null;
}

/** Великий банер для шапки сторінки товару */
export function steamHero(game: Game): string | null {
  const id = steamAppId(game.steamUrl);
  return id ? `${STEAM_CDN}/${id}/library_hero.jpg` : null;
}

/** Чи є в гри широкий арт узагалі */
export function hasWideArt(game: Game): boolean {
  return steamAppId(game.steamUrl) !== null;
}
