// ─── LBK Launcher sync ─────────────────────────────────────────
// Під час збірки бере прогрес ігор з публічного API LBK Launcher:
//   https://lbklauncher.com/api/games-list?authors=<автор>&page=N
// Автори: «Little Bit» і «Солов’їна команда» (її проєкти тепер ведемо ми).
// Для кожної гри є translation_progress, editing_progress, status і version.
//
// Гра на сайті прив'язується до гри в лаунчері через `launcherSlug`
// або через адресу в `downloadUrl` (lbklauncher.com/games/<slug>/…).
// Інші етапи (текстури, шрифти) і тексти лишаються з games.ts.
// Якщо лаунчер недоступний, сайт збирається з даними з games.ts.

import type { Game, GameStatus } from "../data/games";

const API = "https://lbklauncher.com/api/games-list";
const AUTHORS = ["Little Bit", "Солов’їна команда"];
const FETCH_TIMEOUT_MS = 20_000;
const MAX_PAGES = 20;

interface LauncherTranslation {
  team: string;
  status: string;
  translation_progress: number;
  editing_progress: number;
  version: string | null;
  updated_at: string | null;
}
interface LauncherGame {
  slug: string;
  name: string;
  updated_at: string | null;
  translations: LauncherTranslation[];
}

async function fetchAuthor(author: string): Promise<LauncherGame[]> {
  const all: LauncherGame[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${API}?authors=${encodeURIComponent(author)}&page=${page}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "littlebit-site-launcher-sync/1.0" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`LBK Launcher (${author}): HTTP ${res.status}`);
    const data = (await res.json()) as { games: LauncherGame[]; hasMore?: boolean };
    all.push(...data.games);
    if (!data.hasMore) break;
  }
  return all;
}

/** Усі ігри наших авторів без повторів (спільні проєкти є в обох списках). */
export async function fetchLauncherGames(): Promise<LauncherGame[]> {
  const lists = await Promise.all(AUTHORS.map(fetchAuthor));
  const bySlug = new Map<string, LauncherGame>();
  for (const g of lists.flat()) if (!bySlug.has(g.slug)) bySlug.set(g.slug, g);
  return [...bySlug.values()];
}

/** Slug гри в лаунчері: явний launcherSlug або шматок адреси з downloadUrl. */
export function launcherSlugOf(g: Game): string | null {
  if (g.launcherSlug) return g.launcherSlug;
  return g.downloadUrl?.match(/lbklauncher\.com\/games\/([^/?#]+)/)?.[1] ?? null;
}

/**
 * Переклад саме нашої команди. Пріоритет: «Little Bit» без співавторів,
 * потім будь-який переклад за участі «Little Bit», потім «Солов’їна команда».
 */
function ourTranslation(game: LauncherGame): LauncherTranslation | null {
  const [main] = AUTHORS;
  const ours = game.translations.filter((t) => AUTHORS.some((a) => t.team.includes(a)));
  return (
    ours.find((t) => t.team.trim() === main) ??
    ours.find((t) => t.team.includes(main)) ??
    ours[0] ??
    null
  );
}

/**
 * Статус лаунчера → статус сайту.
 *   completed         → done
 *   in-progress       → early-access (гра вже доступна в лаунчері)
 *   tech-improvement  → early-access (доступна, триває технічне доопрацювання)
 *   planned           → in-progress, або planned, якщо переклад ще не почато
 * Збір коштів лишається як у games.ts.
 */
function mapStatus(site: Game, t: LauncherTranslation): GameStatus {
  if (site.status === "fundraising") return "fundraising";
  switch (t.status) {
    case "completed":
      return "done";
    case "in-progress":
    case "tech-improvement":
      return "early-access";
    case "planned":
      return t.translation_progress > 0 ? "in-progress" : "planned";
    default:
      return site.status;
  }
}

/** Оновлює відсоток етапу або додає етап, якщо його ще не було. */
function setStage(stages: { label: string; percent: number }[], re: RegExp, label: string, percent: number, addIfMissing: boolean) {
  const i = stages.findIndex((s) => re.test(s.label));
  if (i >= 0) stages[i] = { ...stages[i], percent };
  else if (addIfMissing) stages.splice(Math.min(1, stages.length), 0, { label, percent });
}

const isoDate = (v: string | null | undefined) => (v ? v.slice(0, 10) : undefined);

export function applyLauncherData(site: Game, lg: LauncherGame): Game {
  const t = ourTranslation(lg);
  if (!t) return site;

  const stages = [...(site.stageDetails ?? [{ label: "Переклад", percent: site.progress }])];
  setStage(stages, /переклад/i, "Переклад", t.translation_progress, true);
  const hadEditing = stages.some((s) => /редакт/i.test(s.label));
  setStage(stages, /редакт/i, "Редактура", t.editing_progress, hadEditing || t.editing_progress > 0);

  const launcherDate = isoDate(t.updated_at ?? lg.updated_at);
  const lastUpdate =
    launcherDate && (!site.lastUpdate || launcherDate > site.lastUpdate) ? launcherDate : site.lastUpdate;

  return {
    ...site,
    status: mapStatus(site, t),
    progress: t.translation_progress,
    stageDetails: stages,
    version: t.version?.trim() || site.version,
    lastUpdate,
  };
}

/**
 * Повертає копію списку ігор з даними з лаунчера.
 * Помилки мережі не валять збірку.
 */
export async function syncLauncher(list: Game[]): Promise<Game[]> {
  if (process.env.LAUNCHER_SYNC === "off") return list;

  let launcher: LauncherGame[];
  try {
    launcher = await fetchLauncherGames();
  } catch (err) {
    console.warn(`[launcher] ${(err as Error).message}. Використовую дані з games.ts.`);
    return list;
  }

  const bySlug = new Map(launcher.map((g) => [g.slug, g]));
  let synced = 0;
  const result = list.map((g) => {
    if (g.launcherSync === false) return g;
    const slug = launcherSlugOf(g);
    const lg = slug ? bySlug.get(slug) : undefined;
    if (!lg) return g;
    synced++;
    return applyLauncherData(g, lg);
  });

  const linked = new Set(list.map(launcherSlugOf).filter(Boolean));
  const manual = list.filter((g) => g.launcherSync === false).map((g) => g.id);
  if (manual.length) console.log(`[launcher] вручну (launcherSync: false): ${manual.join(", ")}`);
  const missing = launcher.filter((g) => !linked.has(g.slug)).map((g) => g.slug);
  console.log(`[launcher] оновлено ${synced} з ${list.length} ігор сайту (у лаунчері ${launcher.length}).`);
  if (missing.length) console.log(`[launcher] є в лаунчері, але немає на сайті: ${missing.join(", ")}`);
  return result;
}
