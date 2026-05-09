// ─── Status Color Helper ───────────────────────────────────────
// Кольори прогрес-барів і акцентів за статусом гри. Повертає трійку
// для inline-style (background-image, glow, solid fill для кубиків).
//
// Палітра підібрана так, щоб збігатися з кольорами status-pills,
// які вже є на картках. При 100% — завжди emerald (done feel),
// незалежно від поточного статусу — це інтуїтивно.

import type { GameStatus } from "../data/games";

export interface StatusPalette {
  /** Linear-gradient для CSS background при показі прогресу */
  gradient: string;
  /** Однотонний акцентний колір (для маленьких сегментів/кубиків) */
  solid: string;
  /** Box-shadow glow для світлого акценту */
  glow: string;
  /** Solid колір для трекової підсвітки (rgba) */
  track: string;
}

const PALETTES: Record<GameStatus, StatusPalette> = {
  "in-progress": {
    gradient: "linear-gradient(90deg, #8b5cf6, #6366f1)",
    solid: "#8b5cf6",
    glow: "0 0 14px -2px rgba(139,92,246,0.55), 0 0 4px rgba(99,102,241,0.40)",
    track: "rgba(139, 92, 246, 0.10)",
  },
  "early-access": {
    gradient: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
    solid: "#0ea5e9",
    glow: "0 0 14px -2px rgba(14,165,233,0.55), 0 0 4px rgba(56,189,248,0.40)",
    track: "rgba(14, 165, 233, 0.10)",
  },
  fundraising: {
    gradient: "linear-gradient(90deg, #fbbf24, #f59e0b)",
    solid: "#f59e0b",
    glow: "0 0 14px -2px rgba(245,158,11,0.55), 0 0 4px rgba(251,191,36,0.40)",
    track: "rgba(245, 158, 11, 0.10)",
  },
  done: {
    gradient: "linear-gradient(90deg, #10b981, #14b8a6)",
    solid: "#10b981",
    glow: "0 0 14px -2px rgba(16,185,129,0.55), 0 0 4px rgba(20,184,166,0.45)",
    track: "rgba(16, 185, 129, 0.10)",
  },
  planned: {
    gradient: "linear-gradient(90deg, #94a3b8, #64748b)",
    solid: "#64748b",
    glow: "0 0 12px -2px rgba(100,116,139,0.40)",
    track: "rgba(100, 116, 139, 0.10)",
  },
};

const DONE_PALETTE: StatusPalette = PALETTES.done;

/**
 * Палітра для прогрес-бара з урахуванням значення:
 * 100% — завжди емералд (done), нижче — палітра за статусом.
 */
export function getProgressPalette(status: GameStatus, percent: number): StatusPalette {
  if (percent >= 100) return DONE_PALETTE;
  return PALETTES[status];
}
