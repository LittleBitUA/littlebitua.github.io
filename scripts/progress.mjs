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
// 3) Описи. Забирає розділ «Про гру» зі сторінок ігор на lbklauncher.com і зберігає
//    в src/data/descriptions.json — сайт бере опис звідти (див. data/catalog.ts).
//
// 4) Титри. Звіряє авторів перекладу з лаунчера з src/data/people.ts і повідомляє
//    про тих, кого на сайті ще немає (ролі туди треба вписати вручну).
//
// Якщо лаунчер недоступний — нічого не змінює.

import { build } from "esbuild";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(".");
const LOG = join(ROOT, "src/data/progress-log.json");
const DESCRIPTIONS = join(ROOT, "src/data/descriptions.json");
const CACHE = join(ROOT, "node_modules/.cache/lb-progress");
mkdirSync(CACHE, { recursive: true });

const bundle = join(CACHE, "data.mjs");
await build({
  stdin: {
    contents: `export { games } from "./src/data/games.ts"; export { PEOPLE } from "./src/data/people.ts"; export { fetchLauncherGames, launcherSlugOf, applyLauncherData } from "./src/lib/launcher.ts";`,
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
const { games, PEOPLE, fetchLauncherGames, launcherSlugOf, applyLauncherData } = await import(pathToFileURL(bundle).href);

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
  const point = {
    date: today,
    t: round(g.progress),
    ...(editingOf(g) != null ? { e: round(editingOf(g)) } : {}),
    // Версія перекладу з лаунчера — для стрічки «Що нового»
    ...(g.version ? { v: g.version } : {}),
  };
  if (point.t == null) continue;
  const list = (log[site.id] ??= []);
  const last = list.at(-1);
  if (last && last.t === point.t && last.e === point.e && (last.v ?? point.v) === point.v) continue;
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
  if (site.launcherSync !== false || site.launcherCheck === false) continue;
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

const linked = new Set([...games.map(launcherSlugOf), ...games.flatMap((g) => g.launcherVersions?.map((v) => v.slug) ?? [])].filter(Boolean));
const missing = launcher.filter((g) => !linked.has(g.slug));
for (const g of missing) problems.push(`- **${g.name}** — є в LBK Launcher (\`${g.slug}\`), але немає на сайті.`);

// ── 3) Описи ──
const decode = (t) =>
  t.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
async function aboutText(slug) {
  try {
    const res = await fetch(`https://lbklauncher.com/games/${slug}`, {
      headers: { "User-Agent": "littlebit-site-launcher-sync/1.0" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const m = (await res.text()).match(/<h2>Про гру<\/h2><div class="[^"]*game-description[^"]*">([\s\S]*?)<\/div><\/section>/);
    if (!m) return null;
    const paras = [...m[1].matchAll(/<p>([\s\S]*?)<\/p>/g)]
      .map((p) => decode(p[1].replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim())
      .filter(Boolean);
    return paras.length ? paras.join("\n\n") : null;
  } catch {
    return null;
  }
}
const descriptions = JSON.parse(readFileSync(DESCRIPTIONS, "utf8"));
const targets = games.filter((g) => launcherSlugOf(g) && g.launcherCheck !== false && bySlug.has(launcherSlugOf(g)));
let descChanged = 0;
for (let i = 0; i < targets.length; i += 6) {
  await Promise.all(
    targets.slice(i, i + 6).map(async (g) => {
      const text = await aboutText(launcherSlugOf(g));
      if (text && text !== descriptions[g.id]) { descriptions[g.id] = text; descChanged++; }
    }),
  );
}
if (descChanged) writeFileSync(DESCRIPTIONS, JSON.stringify(descriptions, null, 2) + "\n");
console.log(`[progress] описи: ${descChanged ? `оновлено ${descChanged}` : "без змін"}`);

// ── 4) Титри ──
const norm = (t) => t.toLowerCase().replace(/[«»"'’()]/g, " ");
const words = (t) => norm(t).split(/[\s,]+/).filter((w) => w.length >= 3);
const credits = [];
for (const site of games) {
  const lg = bySlug.get(launcherSlugOf(site) ?? "");
  const t = lg && ourTeam(lg);
  if (!t || site.launcherCheck === false) continue;
  const names = t.team.split(",").map((n) => n.trim()).filter((n) => n && !/^little bit$/i.test(n));
  const people = PEOPLE.filter((p) => p.credits.some((c) => c.game === site.id));
  const known = new Set(people.flatMap((p) => [...words(p.name), ...words(p.slug.replace(/-/g, " ")), ...words(p.from ?? "")]));
  const absent = names.filter((n) => !words(n).some((w) => [...known].some((k) => k.includes(w) || w.includes(k))));
  if (absent.length) credits.push(`- **${site.title}** — ${absent.join(", ")}`);
}
if (credits.length) {
  problems.push(
    `\n**Автори з лаунчера, яких немає в титрах на сайті** (допишіть у \`src/data/people.ts\` з роллю):\n\n${credits.join("\n")}`,
  );
}

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
