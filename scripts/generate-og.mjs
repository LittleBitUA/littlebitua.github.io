// Генерує картинки-превʼю для посилань (Open Graph, 1200×630):
//   public/images/og.png            — головна, каталог та інші сторінки
//   public/images/og-chronology.png — хронологія (дата звіту й останні виходи)
//
// Дані — ті самі, що й на сайті: каталог із прогресом з LBK Launcher і найсвіжіший
// звіт хронології. Картинка верстається як HTML (шрифт DM Sans, стиль сайту)
// і знімається headless Chrome.
//
// Запускати: npm run og. Якщо Chrome не знайдено — скрипт нічого не змінює.
// Шлях до Chrome можна задати змінною CHROME_PATH.

import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const W = 1200;
const H = 630;
const ROOT = resolve(".");
const tmp = mkdtempSync(join(tmpdir(), "lb-og-"));

// ── Chrome ──
const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((p) => p && existsSync(p));
if (!CHROME) {
  console.warn("[og] Chrome не знайдено — превʼю лишаються без змін.");
  process.exit(0);
}

// ── Дані сайту: каталог і хронологія ──
// lib/chronology.ts читає звіти через import.meta.glob (Vite) — тут підставляємо порожній
// об'єкт і розбираємо найсвіжіший звіт самі.
// Бандл кладемо всередину проєкту, щоб Node знайшов пакети з node_modules
const bundle = join(ROOT, "node_modules/.cache/lb-og/data.mjs");
await build({
  stdin: {
    contents: `export { games } from "./src/data/catalog.ts"; export { parseReport } from "./src/lib/chronology.ts";`,
    resolveDir: ROOT,
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: bundle,
  packages: "external",
  define: { "import.meta.glob": "__noGlob" },
  banner: { js: "const __noGlob = () => ({});" },
  logLevel: "error",
});
const { games, parseReport } = await import(pathToFileURL(bundle).href);

const reportFile = readdirSync(join(ROOT, "src/data/chronology")).filter((f) => f.endsWith(".md")).sort().pop();
const report = parseReport(readFileSync(join(ROOT, "src/data/chronology", reportFile), "utf8"), reportFile.replace(".md", ""));

// ── Вибір ігор ──
const playable = games.filter((g) => g.status === "done" || g.status === "early-access");
const fresh = [...playable].sort(
  (a, b) =>
    Number(!!b.releaseDate) - Number(!!a.releaseDate) ||
    (b.releaseDate ?? b.lastUpdate ?? "").localeCompare(a.releaseDate ?? a.lastUpdate ?? ""),
);
const steamHero = (g) => {
  const id = g.steamUrl?.match(/\/app\/(\d+)/)?.[1];
  return id ? `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/library_hero.jpg` : null;
};
async function reachable(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10_000) });
    return res.ok;
  } catch {
    return false;
  }
}
async function bannerOf(g) {
  for (const url of [steamHero(g), g.launcherArt?.banner].filter(Boolean)) if (await reachable(url)) return url;
  return null;
}

let heroGame = null;
let heroBanner = null;
for (const g of fresh) {
  heroBanner = await bannerOf(g);
  if (heroBanner) { heroGame = g; break; }
}
const posters = fresh.filter((g) => g !== heroGame).slice(0, 6);
const total = games.length;
const playableCount = playable.length;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ── Спільні стилі ──
const BASE_CSS = `
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=block");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body { position: relative; font-family: "DM Sans", system-ui, sans-serif; color: #fff; background: #120d14; -webkit-font-smoothing: antialiased; }
  .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% 25%; }
  .shade { position: absolute; inset: 0; background:
      linear-gradient(90deg, rgba(14, 10, 16, 0.94) 0%, rgba(14, 10, 16, 0.78) 42%, rgba(14, 10, 16, 0.2) 75%, rgba(14, 10, 16, 0.35) 100%),
      linear-gradient(180deg, transparent 45%, rgba(14, 10, 16, 0.92) 100%); }
  .brand { position: absolute; top: 44px; left: 56px; display: flex; align-items: center; gap: 14px; }
  .brand__mark { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 12px; background: #f4f1f4; color: #111; font-weight: 700; font-size: 17px; letter-spacing: -0.04em; }
  .brand__name { font-size: 22px; font-weight: 700; }
  .brand__sub { margin-top: 2px; color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500; }
  h1 { font-size: 62px; font-weight: 700; line-height: 1.02; letter-spacing: -0.03em; }
  .lead { margin-top: 18px; color: rgba(255,255,255,0.86); font-size: 23px; font-weight: 500; line-height: 1.4; }
  .pill { display: inline-flex; align-items: center; height: 44px; padding: 0 22px; border-radius: 9999px; background: #f4f1f4; color: #111; font-size: 18px; font-weight: 700; }
  .pill--glass { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.22); }
`;

const brand = `
  <div class="brand">
    <span class="brand__mark">LB</span>
    <span><div class="brand__name">«Little Bit»</div><div class="brand__sub">Українські локалізації відеоігор</div></span>
  </div>`;

// ── og.png ──
const ogHtml = `<!doctype html><html lang="uk"><head><meta charset="utf-8"><style>${BASE_CSS}
  .copy { position: absolute; left: 56px; top: 122px; width: 640px; }
  .actions { display: flex; gap: 12px; margin-top: 26px; }
  .row { position: absolute; left: 56px; right: 56px; bottom: 36px; display: flex; gap: 14px; justify-content: flex-end; }
  .row img { width: 100px; height: 150px; object-fit: cover; border-radius: 12px; box-shadow: 0 0 0 1px rgba(255,255,255,0.18) inset, 0 14px 30px rgba(0,0,0,0.5); }
</style></head><body>
  ${heroBanner ? `<img class="bg" src="${esc(heroBanner)}" alt="">` : ""}
  <div class="shade"></div>
  ${brand}
  <div class="copy">
    <h1>Перекладаємо те,<br>у що граємо самі</h1>
    <p class="lead">Сюжет, інтерфейс і дрібниці — українською.<br>Без машинного перекладу, безкоштовно.</p>
    <div class="actions">
      <span class="pill">${playableCount} з ${total} уже можна грати</span>
      <span class="pill pill--glass">littlebitua.github.io</span>
    </div>
  </div>
  <div class="row">${posters.map((g) => `<img src="${esc(g.cover)}" alt="">`).join("")}</div>
</body></html>`;

// ── og-chronology.png ──
const releases = report.entries.filter((e) => e.kind === "released" && e.date).slice(-4).reverse();
const chronHtml = `<!doctype html><html lang="uk"><head><meta charset="utf-8"><style>${BASE_CSS}
  .copy { position: absolute; left: 56px; top: 150px; width: 500px; }
  .label { margin-bottom: 14px; color: rgba(255,255,255,0.65); font-size: 15px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
  h1 { font-size: 56px; }
  .actions { margin-top: 26px; }
  .list { position: absolute; right: 48px; top: 48px; bottom: 48px; width: 520px; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
  .item { display: flex; align-items: center; gap: 16px; padding: 12px 14px; border-radius: 16px; background: rgba(20, 16, 24, 0.62); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(10px); }
  .item img { width: 60px; height: 90px; flex-shrink: 0; object-fit: cover; border-radius: 8px; }
  .item small { display: block; color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
  .item strong { display: block; margin-top: 4px; font-size: 21px; font-weight: 700; line-height: 1.2; }
</style></head><body>
  ${heroBanner ? `<img class="bg" src="${esc(heroBanner)}" alt="">` : ""}
  <div class="shade" style="background: linear-gradient(90deg, rgba(14,10,16,0.95) 0%, rgba(14,10,16,0.8) 45%, rgba(14,10,16,0.55) 100%);"></div>
  ${brand}
  <div class="copy">
    <p class="label">Хронологія перекладів</p>
    <h1>Що вийшло й над чим працюємо</h1>
    <div class="actions"><span class="pill">Станом на ${esc(report.dateLabel)}</span></div>
  </div>
  <div class="list">
    ${releases
      .map(
        (e) => `<div class="item">${e.game ? `<img src="${esc(e.game.cover)}" alt="">` : ""}
          <span><small>${esc(e.date)}</small><strong>${esc(e.game?.title ?? e.title)}</strong></span></div>`,
      )
      .join("")}
  </div>
</body></html>`;

// ── Знімок ──
function render(html, out) {
  const page = join(tmp, `${Date.now()}.html`);
  writeFileSync(page, html);
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-sandbox",
    `--user-data-dir=${join(tmp, "profile")}`,
    `--window-size=${W},${H}`, "--virtual-time-budget=15000",
    `--screenshot=${out}`, pathToFileURL(page).href,
  ], { stdio: "ignore", timeout: 120_000 });
  console.log(`[og] ${out.replace(ROOT + "/", "")} — ${(statSync(out).size / 1024).toFixed(0)} KB`);
}

render(ogHtml, join(ROOT, "public/images/og.png"));
render(chronHtml, join(ROOT, "public/images/og-chronology.png"));
console.log(`[og] тло: ${heroGame?.title ?? "—"}; звіт станом на ${report.dateLabel}`);
