// ─── Catalog ───────────────────────────────────────────────────
// Список ігор, який використовує весь сайт: дані з games.ts
// + прогрес, статуси й версії з LBK Launcher (див. lib/launcher.ts)
// + актуальні суми зборів із Donatello (див. lib/fundraising.ts)
// + описи з LBK Launcher (descriptions.json; щодня оновлює scripts/progress.mjs).
// Запит виконується один раз за збірку.
import { games as baseGames } from "./games";
import { syncFundraising } from "../lib/fundraising";
import { syncLauncher } from "../lib/launcher";
import { translationPercent } from "../utils/status";
import descriptions from "./descriptions.json";

export * from "./games";

// Правило: гра, у якій текст перекладено на 100%, вважається готовою,
// навіть якщо редактура чи малювання ще тривають. Готовий переклад
// все одно можна оновлювати через лаунчер.
const withDoneRule = (list: typeof baseGames) =>
  list.map((g) => (g.status === "early-access" && translationPercent(g) >= 100 ? { ...g, status: "done" as const } : g));

// Опис із лаунчера (розділ «Про гру»), якщо він є; інакше — з games.ts
const DESC = descriptions as Record<string, string>;
const withDescriptions = (list: typeof baseGames) => list.map((g) => (DESC[g.id] ? { ...g, description: DESC[g.id] } : g));

export const games = withDoneRule(await syncFundraising(await syncLauncher(withDescriptions(baseGames))));

export function getOverallProgress(): number {
  if (games.length === 0) return 0;
  return Math.round(games.reduce((sum, g) => sum + g.progress, 0) / games.length);
}
