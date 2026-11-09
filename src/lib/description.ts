// ─── Опис гри ──────────────────────────────────────────────────
// Описи взято з LBK Launcher (розділ «Про гру») і бувають у кілька абзаців,
// розділених порожнім рядком. У шапці й каруселі показуємо лише перший
// змістовний абзац, повний текст — окремим розділом на сторінці гри.
import type { Game } from "../data/games";

export const paragraphs = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Перший змістовний абзац: пропускаємо короткі рядки-заголовки на кшталт назви гри. */
export function leadOf(game: Game): string {
  const list = paragraphs(game.description);
  return list.find((p) => p.length >= 80) ?? list[0] ?? "";
}

/** Повний опис має сенс показувати окремо, лише якщо він довший за вступ. */
export const hasMore = (game: Game) => paragraphs(game.description).length > 1;
