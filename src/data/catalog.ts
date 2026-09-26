// ─── Catalog ───────────────────────────────────────────────────
// Список ігор, який використовує весь сайт: дані з games.ts
// + прогрес, статуси й версії з LBK Launcher (див. lib/launcher.ts)
// + актуальні суми зборів із Donatello (див. lib/fundraising.ts).
// Запит виконується один раз за збірку.
import { games as baseGames } from "./games";
import { syncFundraising } from "../lib/fundraising";
import { syncLauncher } from "../lib/launcher";
import { translationPercent } from "../utils/status";

export * from "./games";

// Правило: гра, у якій текст перекладено на 100%, вважається готовою,
// навіть якщо редактура чи малювання ще тривають. Готовий переклад
// все одно можна оновлювати через лаунчер.
const withDoneRule = (list: typeof baseGames) =>
  list.map((g) => (g.status === "early-access" && translationPercent(g) >= 100 ? { ...g, status: "done" as const } : g));

export const games = withDoneRule(await syncFundraising(await syncLauncher(baseGames)));

export function getOverallProgress(): number {
  if (games.length === 0) return 0;
  return Math.round(games.reduce((sum, g) => sum + g.progress, 0) / games.length);
}
