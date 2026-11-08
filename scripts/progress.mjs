// Щоденна робота з прогресом (npm run progress):
//
// 1) Історія. Дописує в src/data/progress-log.json сьогоднішні відсотки перекладу
//    й редактури кожної гри — лише якщо вони змінилися. З цього журналу будується
//    графік прогресу на сторінці гри. Записи до листопада 2026 відновлено з історії
//    правок games.ts у git.
//
// 2) Перевірка. Порівнює з LBK Launcher ігри, які ведуться вручну (launcherSync: false),
//    і шукає розбіжності: інші відсотки, посилання на неіснуючу гру в лаунчері,
//    наші ігри в лаунчері, яких немає на сайті. Звіт пише в консоль, у підсумок
//    GitHub Actions і у файл, з якого CI створює або оновлює issue.
//
// Якщо лаунчер недоступний — нічого не змінює.

import { build } from "esbuild";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(".");
const LOG = join(ROOT, "src/data/progress-log.json");
const CACHE = join(ROOT, "node_modules/.cache/lb-progress");
mkdirSync(CACHE, { recursive: true });

const bundle = join(CACHE, "data.mjs");
await build({
  stdin: {
    contents: `export { games } from "./src/data/games.ts"; export { fetchLauncherGames, launcherSlugOf, applyLauncherData } from "./src/lib/launcher.ts";`,
    resolveDir: ROOT,
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: bundle,
  packages: "external",
  logLevel: "error",
});
const { games, fetchLauncherGames, launcherSlugOf, applyLauncherData } = await import(pathToFileURL(bundle).href);

let launcher;
try {
  launcher = await fetchLauncherGames();
} catch (err) {
  console.warn(`[progress] LBK Launcher недоступний (${err.message}) — нічого не змінюю.`);
  process.exit(0);
}
const bySlug = new Map(launcher.map((g) => [g.slug, g]));

const editingOf = (g) => g.stageDetails?.find((s) => /редакт/i.test(s.label))?.percent;
const round = (n) => (typeof n === "number" ? Math.round(n) : undefined);
// Дата за Києвом, щоб нічний запуск не записувався вчорашнім днем
const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Kyiv" }).format(new Date());

// ── 1) Історія ──
const log = JSON.parse(readFileSync(LOG, "utf8"));
let changed = 0;
for (const site of games) {
  const lg = bySlug.get(launcherSlugOf(site) ?? "");
  const g = lg && site.launcherSync !== false ? applyLauncherData(site, lg) : site;
  const point = { date: today, t: round(g.progress), ...(editingOf(g) != null ? { e: round(editingOf(g)) } : {}) };
  if (point.t == null) continue;
  const list = (log[site.id] ??= []);
  const last = list.at(-1);
  if (last && last.t === point.t && last.e === point.e) continue;
  if (last?.date === today) list.pop();
  list.push(point);
  changed++;
}
if (changed) {
  const body = Object.entries(log)
    .map(([id, pts]) => `  ${JSON.stringify(id)}: [\n${pts.map((p) => "    " + JSON.stringify(p)).join(",\n")}\n  ]`)
    .join(",\n");
  writeFileSync(LOG, `{\n${body}\n}\n`);
}
console.log(`[progress] історія: ${changed ? `оновлено ${changed} ігор` : "без змін"} (${today})`);

// ── 2) Перевірка ──
const ourTeam = (lg) => lg.translations.find((t) => /little bit|солов/i.test(t.team));
const problems = [];

for (const site of games) {
  const slug = launcherSlugOf(site);
  if (!slug) continue;
  const lg = bySlug.get(slug);
  if (!lg) {
    problems.push(`- **${site.title}** — у лаунчері немає гри \`${slug}\` (перевірте \`launcherSlug\` / \`downloadUrl\`).`);
    continue;
  }
  if (site.launcherSync !== false) continue;
  const t = ourTeam(lg);
  if (!t) continue;
  const diffs = [];
  if (round(site.progress) !== round(t.translation_progress))
    diffs.push(`переклад: сайт ${round(site.progress)}% · лаунчер ${round(t.translation_progress)}%`);
  const ed = editingOf(site);
  if (ed != null && round(ed) !== round(t.editing_progress))
    diffs.push(`редактура: сайт ${round(ed)}% · лаунчер ${round(t.editing_progress)}%`);
  if (diffs.length) problems.push(`- **${site.title}** (вручну, \`launcherSync: false\`) — ${diffs.join("; ")}.`);
}

const linked = new Set(games.map(launcherSlugOf).filter(Boolean));
const missing = launcher.filter((g) => !linked.has(g.slug));
for (const g of missing) problems.push(`- **${g.name}** — є в LBK Launcher (\`${g.slug}\`), але немає на сайті.`);

const report = problems.length
  ? `Знайдено розбіжностей між сайтом і LBK Launcher: **${problems.length}**.\n\n${problems.join("\n")}\n\n` +
    `Ігри з \`launcherSync: false\` сайт не оновлює автоматично. Якщо в лаунчері правильні цифри — приберіть \`launcherSync: false\` у \`src/data/games.ts\`; якщо правильні на сайті — оновіть лаунчер.\n\n` +
    `_Перевірка ${today}. Issue оновлюється автоматично і закриється сам, коли розбіжностей не залишиться._`
  : "";

writeFileSync(join(CACHE, "report.md"), report);
console.log(report ? `[progress] розбіжності:\n${problems.join("\n")}` : "[progress] розбіжностей немає");
for (const p of problems) console.log(`::warning title=LBK Launcher::${p.replace(/[*`]/g, "").replace(/^- /, "")}`);
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Перевірка прогресу\n\n${report || "Розбіжностей із LBK Launcher немає."}\n`);
