// ─── Fundraising sync ──────────────────────────────────────────
// Під час збірки сайту бере актуальні суми зборів із Donatello.
// Та сама ідея, що й у lbk-admin (workers/fundraising-sync):
// сторінка автора donatello.to/<slug> містить JSON усіх цілей,
// а donatedAmount там накопичувальний — не зменшується після виведення коштів.
//
// Ціль гри задається полем `fundraisingUrl` у games.ts, наприклад:
//   https://donatello.to/LittleBitUA?g=tekstova-lokalizatsiya-...
// Параметр `g` збігається з полем `urlName` цілі на сторінці.
//
// Якщо Donatello недоступний, сайт збирається зі значеннями з games.ts.

import type { Game } from "../data/games";

export interface DonatelloGoal {
  id: string;
  urlName: string;
  name: string;
  status: string;
  donatedAmount: number;
  goalAmount: number;
  currency: string;
}

const FETCH_TIMEOUT_MS = 20_000;

/** Розбирає посилання на ціль Donatello: slug автора + urlName цілі. */
export function parseDonatelloUrl(url: string | undefined): { slug: string; goal: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!/(^|\.)donatello\.to$/.test(u.hostname)) return null;
    const slug = u.pathname.split("/").filter(Boolean)[0];
    const goal = u.searchParams.get("g");
    return slug && goal ? { slug, goal } : null;
  } catch {
    return null;
  }
}

/**
 * Витягує цілі з HTML сторінки автора. Бандл мінімізований, тож JSON.parse
 * не спрацює: ділимо HTML на шматки по кожній цілі й читаємо поля окремо.
 */
export function parseGoalsFromHtml(html: string): DonatelloGoal[] {
  const starts = [...html.matchAll(/"_id":"([^"]+)","widgetType":"goal"/g)];
  return starts.flatMap((m, i) => {
    const chunk = html.slice(m.index, starts[i + 1]?.index ?? m.index + 20_000);
    // Рядкові поля — до лапки, числові можуть бути як у лапках, так і без
    const field = (name: string) =>
      chunk.match(new RegExp(`"${name}":"([^"]*)"`))?.[1] ?? chunk.match(new RegExp(`"${name}":([-\d.]+)`))?.[1];
    const urlName = field("urlName");
    const donated = Number(field("donatedAmount"));
    const goal = Number(field("goalAmount"));
    if (!urlName || !Number.isFinite(donated) || !Number.isFinite(goal)) return [];
    return [{
      id: m[1],
      urlName,
      name: field("widgetName") ?? "",
      status: field("widgetStatus") ?? "",
      donatedAmount: donated,
      goalAmount: goal,
      currency: field("widgetCurrency") ?? "UAH",
    }];
  });
}

export async function fetchDonatelloGoals(slug: string): Promise<DonatelloGoal[]> {
  const res = await fetch(`https://donatello.to/${encodeURIComponent(slug)}`, {
    headers: { "User-Agent": "littlebit-site-fundraising-sync/1.0" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Donatello ${slug}: HTTP ${res.status}`);
  return parseGoalsFromHtml(await res.text());
}

/**
 * Повертає копію списку ігор з актуальними сумами зборів.
 * Кожного автора запитує один раз. Помилки не валять збірку.
 */
export async function syncFundraising(list: Game[]): Promise<Game[]> {
  if (process.env.FUNDRAISING_SYNC === "off") return list;

  const targets = list
    .filter((g) => !g.fundraisingPaused) // призупинений збір: суми з games.ts
    .map((g) => ({ game: g, ref: parseDonatelloUrl(g.fundraisingUrl) }))
    .filter((t): t is { game: Game; ref: { slug: string; goal: string } } => !!t.ref);
  if (targets.length === 0) return list;

  const slugs = [...new Set(targets.map((t) => t.ref.slug))];
  const goalsBySlug = new Map<string, DonatelloGoal[]>();
  await Promise.all(
    slugs.map(async (slug) => {
      try {
        goalsBySlug.set(slug, await fetchDonatelloGoals(slug));
      } catch (err) {
        console.warn(`[fundraising] ${(err as Error).message}. Використовую значення з games.ts.`);
      }
    }),
  );

  const updates = new Map<string, Partial<Game>>();
  for (const { game, ref } of targets) {
    const goal = goalsBySlug.get(ref.slug)?.find((g) => g.urlName === ref.goal);
    if (!goal) {
      if (goalsBySlug.has(ref.slug)) console.warn(`[fundraising] ${game.id}: ціль «${ref.goal}» не знайдена на Donatello.`);
      continue;
    }
    updates.set(game.id, {
      fundraisingRaised: Math.round(goal.donatedAmount),
      fundraisingGoal: Math.round(goal.goalAmount),
    });
    console.log(`[fundraising] ${game.id}: ${goal.donatedAmount} / ${goal.goalAmount} ${goal.currency}`);
  }

  return list.map((g) => (updates.has(g.id) ? { ...g, ...updates.get(g.id) } : g));
}
