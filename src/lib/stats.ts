// ─── Цифри студії ──────────────────────────────────────────────
// Усі показники для сторінки /stats/ і блоку «У цифрах» на головній.
// Рахуються під час збірки з тих самих даних, що й решта сайту:
// каталог (games.ts + LBK Launcher), хронологія, журнал прогресу, титри.
import { games } from "../data/catalog";
import { PEOPLE, type Person } from "../data/people";
import { latestReport } from "./chronology";
import { getUpdates } from "./updates";
import { getSeriesGroups } from "../utils/series";
import { isPlayable, isFundraising, translationPercent, stagesOf, statusMeta } from "../utils/status";
import type { Game, GameStatus } from "../data/games";
import log from "../data/progress-log.json";

export const MONTHS_GEN = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
export const MONTHS_SHORT = ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"];
const ym = (iso: string) => iso.slice(0, 7);
const monthLabel = (key: string) => `${MONTHS_SHORT[+key.slice(5, 7) - 1]}${key.slice(5, 7) === "01" ? ` ${key.slice(2, 4)}` : ""}`;
const today = new Date().toISOString().slice(0, 10);

/** Список місяців від `from` до `to` включно, «РРРР-ММ» */
function monthRange(from: string, to: string): string[] {
  const out: string[] = [];
  let [y, m] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    if (++m > 12) { m = 1; y++; }
  }
  return out;
}

// ── Головні числа ──
const playable = games.filter(isPlayable);
const inWork = games.filter((g) => !isPlayable(g));
const members = PEOPLE.filter((p) => !p.guest && !p.team);
const helpers = PEOPLE.filter((p) => p.guest || p.team);
// Обсяг тексту — загальна кількість рядків (записів) у проєктах, де її пораховано
const counted = games.filter((g) => g.stats?.totalLines);
const lines = counted.reduce((sum, g) => sum + (g.stats!.totalLines ?? 0), 0);

// ── Виходи з хронології (розділ «Виходи…» останнього звіту) ──
interface Release { year: string; month: number | null; title: string }
const releases: Release[] = [];
{
  let year = "";
  for (const item of latestReport?.sections[0]?.items ?? []) {
    if (item.kind === "node" && item.level === 1) year = item.text.match(/\d{4}/)?.[0] ?? year;
    if (item.kind !== "entry" || !year) continue;
    const m = item.entry.date ? MONTHS_GEN.findIndex((name) => item.entry.date!.endsWith(name)) : -1;
    releases.push({ year, month: m >= 0 ? m : null, title: item.entry.title });
  }
}
const years = [...new Set(releases.map((r) => r.year))].sort();
const thisYear = years.at(-1) ?? today.slice(0, 4);
const releasesThisYear = releases.filter((r) => r.year === thisYear);
const releasesByMonth = MONTHS_SHORT.map((label, i) => ({ label, count: releasesThisYear.filter((r) => r.month === i).length }));

// Зростання бібліотеки: скільки виходів накопичилося на кінець кожного місяця
const dated = releases.filter((r) => r.month != null).map((r) => `${r.year}-${String(r.month! + 1).padStart(2, "0")}`);
const firstMonth = dated.length ? dated.reduce((a, b) => (a < b ? a : b)) : ym(today);
const growth = monthRange(firstMonth, ym(today)).map((key) => ({
  key,
  label: monthLabel(key),
  // Лише виходи з точною датою
  total: dated.filter((d) => d <= key).length,
}));

// ── Темп: відсоткові пункти перекладу й редактури за місяць (журнал прогресу) ──
type Point = { date: string; t: number; e?: number };
const LOG = log as Record<string, Point[]>;
const tempoMap = new Map<string, { t: number; e: number }>();
for (const pts of Object.values(LOG)) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const cur = tempoMap.get(ym(b.date)) ?? { t: 0, e: 0 };
    // Падіння й стрибки на всі 100 п. — це виправлення даних, а не робота
    if (b.t > a.t && b.t - a.t < 100) cur.t += b.t - a.t;
    if (b.e != null && b.e > (a.e ?? 0) && b.e - (a.e ?? 0) < 100) cur.e += b.e - (a.e ?? 0);
    tempoMap.set(ym(b.date), cur);
  }
}
const tempoKeys = [...tempoMap.keys()].sort();
const tempo = tempoKeys.length
  ? monthRange(tempoKeys[0], ym(today)).map((key) => ({ key, label: monthLabel(key), ...(tempoMap.get(key) ?? { t: 0, e: 0 }) }))
  : [];
const since30 = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
const recent = (await getUpdates(games)).filter((u) => u.date >= since30 && u.kind !== "telegram");
let points30 = 0;
for (const pts of Object.values(LOG))
  for (let i = 1; i < pts.length; i++)
    if (pts[i].date >= since30 && pts[i].t > pts[i - 1].t && pts[i].t - pts[i - 1].t < 100) points30 += pts[i].t - pts[i - 1].t;

// ── Конвеєр: стан кожного етапу в усіх іграх, де цей етап є ──
const STAGES: [string, RegExp][] = [
  ["Переклад", /переклад/i],
  ["Редактура", /редакт/i],
  ["Шрифти", /шрифт/i],
  ["Текстури", /текстур/i],
];
const pipeline = STAGES.map(([label, re]) => {
  const values = games.map((g) => stagesOf(g).find((s) => re.test(s.label))?.percent).filter((v): v is number => v != null);
  return {
    label,
    total: values.length,
    done: values.filter((v) => v >= 100).length,
    active: values.filter((v) => v > 0 && v < 100).length,
    todo: values.filter((v) => v <= 0).length,
  };
}).filter((s) => s.total > 0);

// ── Найближчі релізи: проєкти в роботі з найбільшим прогресом ──
const editingOf = (g: Game) => stagesOf(g).find((s) => /редакт/i.test(s.label))?.percent ?? null;
const nearest = inWork
  .map((g) => ({ g, t: translationPercent(g), e: editingOf(g) }))
  .sort((a, b) => b.t - a.t || (b.e ?? 0) - (a.e ?? 0))
  .slice(0, 6);

// ── Каталог ──
const ORDER: GameStatus[] = ["done", "early-access", "in-progress", "fundraising", "planned"];
const byStatus = ORDER.map((s) => ({ s, count: games.filter((g) => g.status === s).length, ...statusMeta(s) })).filter((x) => x.count);
const tagCount = new Map<string, number>();
for (const g of games) for (const t of g.tags ?? []) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
const genres = [...tagCount].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, count]) => ({ label, count }));
const gameYears = games.map((g) => g.gameYear).filter((y): y is number => !!y);
const minYear = Math.min(...gameYears), maxYear = Math.max(...gameYears);
const byGameYear = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
  year: minYear + i,
  count: gameYears.filter((y) => y === minYear + i).length,
}));
const sortedYears = [...gameYears].sort((a, b) => a - b);
const medianYear = sortedYears[Math.floor(sortedYears.length / 2)];
const series = getSeriesGroups(2).sort((a, b) => b.games.length - a.games.length).slice(0, 6);

// ── Команда ──
const ROLES: [string, RegExp][] = [
  ["Переклад", /переклад/i],
  ["Редактура", /редакт|редагув|звірка/i],
  ["Технічна частина", /технічн|рекомпіляц|інтеграц/i],
  ["Текстури й графіка", /текстур|графік/i],
  ["Шрифти", /шрифт/i],
  ["Тестування", /тестув/i],
  ["Керівництво", /керівниц|ініціатив/i],
];
const credits = PEOPLE.flatMap((p) => p.credits);
const roles = ROLES.map(([label, re]) => ({ label, count: credits.filter((c) => re.test(c.role)).length }))
  .filter((r) => r.count)
  .sort((a, b) => b.count - a.count);
const projectsOf = (p: Person) => new Set(p.credits.map((c) => c.game)).size;
const leaders = PEOPLE.filter((p) => !p.team)
  .map((p) => ({ p, projects: projectsOf(p) }))
  .sort((a, b) => b.projects - a.projects)
  .slice(0, 8);

// ── Збори ──
const fundsActive = games.filter(isFundraising);
const fundsDone = games.filter((g) => g.fundraisingCompleted);

export const stats = {
  total: games.length,
  playable: playable.length,
  inWork: inWork.length,
  members: members.length,
  helpers: helpers.length,
  lines,
  linesProjects: counted.length,
  thisYear,
  years: years.map((y) => ({ year: y, count: releases.filter((r) => r.year === y).length })),
  releasesThisYear: releasesThisYear.length,
  undatedThisYear: releasesThisYear.filter((r) => r.month == null).length,
  releasesByMonth,
  growth,
  tempo,
  recent: recent.length,
  recentGames: new Set(recent.map((u) => u.game.id)).size,
  points30,
  pipeline,
  nearest,
  byStatus,
  genres,
  byGameYear,
  minYear,
  maxYear,
  medianYear,
  series,
  roles,
  credits: credits.length,
  leaders,
  fundsActive: fundsActive.length,
  fundsDone: fundsDone.length,
  avgInWork: Math.round(inWork.reduce((s, g) => s + translationPercent(g), 0) / Math.max(1, inWork.length)),
};
