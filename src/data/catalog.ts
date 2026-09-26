// ─── Catalog ───────────────────────────────────────────────────
// Список ігор, який використовує весь сайт: дані з games.ts
// + актуальні суми зборів із Donatello (див. lib/fundraising.ts).
// Запит виконується один раз за збірку.
import { games as baseGames } from "./games";
import { syncFundraising } from "../lib/fundraising";

export * from "./games";
export const games = await syncFundraising(baseGames);

export function getOverallProgress(): number {
  if (games.length === 0) return 0;
  return Math.round(games.reduce((sum, g) => sum + g.progress, 0) / games.length);
}
