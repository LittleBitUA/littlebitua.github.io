// ─── Updates Aggregator ────────────────────────────────────────
// Збирає всі події з даних ігор (progressHistory + lastUpdate +
// релізи) у єдиний хронологічний потік. Використовується сторінкою
// /updates і RSS-стрічкою /feed.xml.

import { games, STATUS_LABELS } from "../data/games";
import type { Game } from "../data/games";

export type UpdateEventKind =
  | "milestone"     // запис із progressHistory
  | "release"       // status === "done" + releaseDate
  | "early-access"  // отримано downloadUrl (status early-access)
  | "update";       // загальне "lastUpdate"

export interface UpdateEvent {
  /** ISO-дата (YYYY-MM-DD) */
  date: string;
  kind: UpdateEventKind;
  gameId: string;
  gameTitle: string;
  gameCover: string;
  /** Готовий заголовок (укр) */
  title: string;
  /** Опис (укр) */
  description: string;
  /** Прогрес у момент події (0-100) — лише якщо доречно */
  progress?: number;
  /** Деталь milestone, якщо є */
  milestone?: string;
}

function buildEventsForGame(game: Game): UpdateEvent[] {
  const events: UpdateEvent[] = [];

  // 1) Milestones з progressHistory
  if (game.progressHistory && game.progressHistory.length > 0) {
    for (const entry of game.progressHistory) {
      events.push({
        date: entry.date,
        kind: "milestone",
        gameId: game.id,
        gameTitle: game.title,
        gameCover: game.cover,
        title: entry.milestone
          ? `${game.title} — ${entry.milestone}`
          : `${game.title} — ${entry.progress}%`,
        description: entry.milestone
          ? `Прогрес локалізації: ${entry.progress}%.`
          : `Прогрес локалізації досяг ${entry.progress}%.`,
        progress: entry.progress,
        milestone: entry.milestone,
      });
    }
  }

  // 2) Реліз — для status "done"
  if (game.status === "done" && game.releaseDate) {
    events.push({
      date: game.releaseDate,
      kind: "release",
      gameId: game.id,
      gameTitle: game.title,
      gameCover: game.cover,
      title: `${game.title} — реліз локалізації`,
      description: "Українська локалізація доступна для завантаження.",
      progress: 100,
    });
  }

  // 3) Якщо запис не додає окремого milestone, але є `lastUpdate` —
  //    і нічого ще немає на цю дату — авто-генеруємо подію.
  //    Завдяки цьому достатньо просто змінити `progress` + `lastUpdate`
  //    у games.ts, і запис у Хроніці з'явиться сам.
  if (game.lastUpdate) {
    const hasSameDate = events.some((e) => e.date === game.lastUpdate);
    if (!hasSameDate) {
      const statusLabel = STATUS_LABELS[game.status];
      const isEarlyAccess = game.status === "early-access";
      events.push({
        date: game.lastUpdate,
        kind: isEarlyAccess ? "early-access" : "update",
        gameId: game.id,
        gameTitle: game.title,
        gameCover: game.cover,
        title: `${game.title} — ${game.progress}% перекладено`,
        description: isEarlyAccess
          ? `Доступно в ранньому доступі. Поточний прогрес локалізації — ${game.progress}%.`
          : `Поточний прогрес локалізації — ${game.progress}% (${statusLabel.toLowerCase()}).`,
        progress: game.progress,
      });
    }
  }

  return events;
}

/** Усі події, відсортовані від найновіших до найстаріших. */
export function getAllUpdates(limit?: number): UpdateEvent[] {
  const all = games.flatMap(buildEventsForGame);
  all.sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? all.slice(0, limit) : all;
}

/** Forматування дати у відображувану форму (укр). */
export function formatUpdateDate(d: string): string {
  return new Date(d).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Колір-токен для маркера події (для UI). */
export function eventTone(kind: UpdateEventKind): {
  dot: string;
  badge: string;
  label: string;
} {
  switch (kind) {
    case "release":
      return {
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Реліз",
      };
    case "early-access":
      return {
        dot: "bg-sky-500",
        badge: "bg-sky-50 text-sky-700 border-sky-200",
        label: "Ранній доступ",
      };
    case "milestone":
      return {
        dot: "bg-violet-500",
        badge: "bg-violet-50 text-violet-700 border-violet-200",
        label: "Milestone",
      };
    default:
      return {
        dot: "bg-indigo-500",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        label: "Оновлення",
      };
  }
}
