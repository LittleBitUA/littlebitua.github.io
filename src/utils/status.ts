// ─── Status helpers ────────────────────────────────────────────
// Єдине місце, де визначено підписи й кольори статусів для UI.
// Кольори посилаються на CSS-токени з global.css.

import type { Game, GameStatus } from "../data/games";

export const STATUS_META: Record<GameStatus, { label: string; color: string }> = {
  done: { label: "Готово", color: "var(--st-done)" },
  "early-access": { label: "Ранній доступ", color: "var(--st-early)" },
  "in-progress": { label: "У роботі", color: "var(--st-progress)" },
  fundraising: { label: "Збір коштів", color: "var(--st-fund)" },
  planned: { label: "Заплановано", color: "var(--st-planned)" },
};

export const statusMeta = (status: GameStatus) => STATUS_META[status] ?? STATUS_META.planned;

/** Порядок показу: спочатку те, у що можна грати. */
const STATUS_PRIORITY: Record<GameStatus, number> = {
  done: 0,
  "early-access": 1,
  "in-progress": 2,
  fundraising: 3,
  planned: 4,
};

export function sortByStatus(list: Game[]): Game[] {
  return [...list].sort((a, b) => {
    const diff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
    return diff !== 0 ? diff : (b.lastUpdate ?? "").localeCompare(a.lastUpdate ?? "");
  });
}

export const isPlayable = (g: Game) => g.status === "done" || g.status === "early-access";

export const isFundraising = (g: Game) => !!g.fundraisingGoal && !g.fundraisingCompleted;

export function fundraisingPercent(g: Game): number {
  if (!g.fundraisingGoal) return 0;
  return Math.min(100, Math.round(((g.fundraisingRaised ?? 0) / g.fundraisingGoal) * 100));
}

/** Відсоток перекладу: етап «Переклад», якщо він є, інакше загальний прогрес. */
export function translationPercent(g: Game): number {
  return g.stageDetails?.find((d) => /переклад/i.test(d.label))?.percent ?? g.progress;
}

export const formatMoney = (value: number) => value.toLocaleString("uk-UA") + " ₴";

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

/** Етапи локалізації гри. Якщо розбивки немає — один етап із загальним прогресом. */
export function stagesOf(g: Game): { label: string; percent: number }[] {
  if (g.stageDetails?.length) return g.stageDetails;
  return [{ label: g.stage && g.stage !== "Готово" ? g.stage : "Переклад", percent: g.progress }];
}

/**
 * Пояснення, чому гра в ранньому доступі: що вже готово і що ще триває.
 * Повертає null для інших статусів.
 */
export function earlyAccessReason(g: Game): { done: string[]; pending: string[]; textComplete: boolean } | null {
  if (g.status !== "early-access") return null;
  const stages = stagesOf(g);
  return {
    done: stages.filter((s) => s.percent >= 100).map((s) => s.label),
    pending: stages.filter((s) => s.percent < 100).map((s) => s.label),
    textComplete: translationPercent(g) >= 100,
  };
}

/** Назва етапу для відвідувачів: «Текстури» → «Малювання». */
export const stageName = (label: string) => (/текстур/i.test(label) ? "Малювання" : label);
