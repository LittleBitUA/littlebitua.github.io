// ─── Game Status Badges Config ────────────────────────────────
// Окремий файл для редагування статусних плашок під картками ігор.
//
// Як редагувати:
//  1. Знайди gameId потрібної гри (id з src/data/games.ts).
//  2. Виправ або додай запис у GAME_BADGES.
//  3. Якщо плашка не потрібна — постав enabled: false або прибери запис.
//
// Усі поля кольорів приймають будь-які CSS-значення (#hex, rgb, rgba, hsl).
// Колір тексту автоматично рахується з основного, якщо не заданий явно.

export interface GameBadge {
  /** Чи показувати плашку. Якщо false або текст порожній — плашка не рендериться. */
  enabled?: boolean;
  /** Текст плашки */
  text?: string;
  /** Коротка мітка / акцент перед текстом (опціонально) */
  label?: string;
  /** Іконка: emoji або коротке текстове позначення (опціонально) */
  icon?: string;
  /** Колір тексту */
  textColor?: string;
  /** Основний акцентний колір (використовується для рамки/підсвічення, якщо інші не задані) */
  color?: string;
  /** Фон плашки (rgba/hex). Якщо заданий gradient, перекриває background. */
  background?: string;
  /** CSS-градієнт для фону. Перекриває background. */
  gradient?: string;
  /** Колір рамки */
  borderColor?: string;
  /** Прозорість усієї плашки (0..1) */
  opacity?: number;
  /** Колір/інтенсивність зовнішнього свічення (наприклад, "rgba(124,255,107,0.28)") */
  glow?: string;
  /** Підсвітка тексту/інтерактивний hover */
  interactive?: boolean;
  /** URL — якщо вказано, плашка стає посиланням */
  href?: string;
}

/** Дефолти кольорів для типових станів. Використовуються, якщо не задано вручну. */
export const BADGE_PRESETS = {
  available: {
    color: "#16a34a",
    textColor: "#15803d",
    background: "rgba(22, 163, 74, 0.10)",
    borderColor: "rgba(22, 163, 74, 0.35)",
    glow: "rgba(22, 163, 74, 0.22)",
  },
  earlyAccess: {
    color: "#0ea5e9",
    textColor: "#0369a1",
    background: "rgba(14, 165, 233, 0.10)",
    borderColor: "rgba(14, 165, 233, 0.35)",
    glow: "rgba(14, 165, 233, 0.22)",
  },
  inProgress: {
    color: "#7c3aed",
    textColor: "#6d28d9",
    background: "rgba(124, 58, 237, 0.10)",
    borderColor: "rgba(124, 58, 237, 0.32)",
    glow: "rgba(124, 58, 237, 0.20)",
  },
  fundraising: {
    color: "#ea580c",
    textColor: "#c2410c",
    background: "rgba(234, 88, 12, 0.10)",
    borderColor: "rgba(234, 88, 12, 0.32)",
    glow: "rgba(234, 88, 12, 0.22)",
  },
  demo: {
    color: "#f59e0b",
    textColor: "#b45309",
    background: "rgba(245, 158, 11, 0.10)",
    borderColor: "rgba(245, 158, 11, 0.32)",
    glow: "rgba(245, 158, 11, 0.22)",
  },
  updated: {
    color: "#0891b2",
    textColor: "#0e7490",
    background: "rgba(8, 145, 178, 0.10)",
    borderColor: "rgba(8, 145, 178, 0.32)",
    glow: "rgba(8, 145, 178, 0.22)",
  },
} as const;

/**
 * Конфігурація плашок під картками ігор.
 * Ключ — gameId з src/data/games.ts.
 *
 * Приклад порожньої плашки:
 *   "my-game": { enabled: false }
 *
 * Приклад мінімальної (preset кольорів, текст від руки):
 *   "my-game": { text: "Доступно", ...BADGE_PRESETS.available }
 *
 * Приклад повної кастомізації:
 *   "my-game": {
 *     text: "Ранній доступ (1.0.7)",
 *     textColor: "#15803d",
 *     color: "#7CFF6B",
 *     background: "rgba(124,255,107,0.08)",
 *     borderColor: "rgba(124,255,107,0.35)",
 *     gradient: "linear-gradient(90deg, rgba(124,255,107,0.14), rgba(124,255,107,0.04))",
 *     glow: "rgba(124,255,107,0.28)"
 *   }
 */
export const GAME_BADGES: Record<string, GameBadge> = {
  "mgs-snake-eater": {
    text: "Ранній доступ (1.1.3) • Збір коштів",
    ...BADGE_PRESETS.earlyAccess,
    glow: "rgba(234, 88, 12, 0.35)",
  },
  "nmh1": {
    text: "Доступно",
    ...BADGE_PRESETS.available,
  },
  "nmh3": {
    text: "Доступно",
    ...BADGE_PRESETS.available,
  },
  "dispatch": {
    text: "Ранній доступ — усі епізоди",
    ...BADGE_PRESETS.earlyAccess,
  },
  "judgment": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
  "uncharted1": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
  "digging-a-hole": {
    text: "Ранній доступ без текстур",
    ...BADGE_PRESETS.earlyAccess,
  },
  "as-dusk-falls": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
  "yakuza-kiwami2": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "yakuza-lad": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "yakuza-kiwami3": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
  "nmh2": {
    text: "Редактура",
    ...BADGE_PRESETS.inProgress,
  },
  "mgs2": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
  "nier-replicant": {
    text: "Збір коштів",
    ...BADGE_PRESETS.fundraising,
  },
  "hotel-barcelona": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "deadly-premonition-dc": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "deadly-premonition-2": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "travis-strikes-again": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "lad-ishin": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "yakuza3": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "uncharted2": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "shenmue": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "jojo-asbr": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "lost-judgment": {
    text: "Переклад",
    ...BADGE_PRESETS.inProgress,
  },
  "dave-the-diver": {
    text: "Доступно",
    ...BADGE_PRESETS.available,
  },
  "persona-5-royal": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
  "kingdom-hearts-3": {
    text: "Ранній доступ",
    ...BADGE_PRESETS.earlyAccess,
  },
};

/**
 * Повертає підготовлений запис плашки для гри.
 * Якщо запису немає, або enabled === false, або text порожній — повертає null.
 */
export function getBadge(gameId: string): GameBadge | null {
  const raw = GAME_BADGES[gameId];
  if (!raw) return null;
  if (raw.enabled === false) return null;
  if (!raw.text || raw.text.trim() === "") return null;
  return raw;
}
