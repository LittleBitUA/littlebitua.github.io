// Генерує public/images/og.png — OG-картинка з реальними обкладинками
// ігор з каталогу.
//
// Запускати: npm run og  (або node scripts/generate-og.mjs)

import sharp from "sharp";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

// Обкладинки в порядку, як з'являться в OG-картинці.
// Беремо локальні файли — без мережних запитів і без CORS.
const COVERS = [
  "public/images/nier-replicant.jpg",
  "public/images/mgs2.jpg",
  "public/images/judgment.jpg",
  "public/images/nmh1.jpg",
  "public/images/dispatch.jpg",
  "public/images/yakuza-lad.jpg",
];

const W = 1200;
const H = 630;

// Параметри ряду обкладинок (Steam-формат 2:3)
const C_W = 124;
const C_H = 186;
const C_GAP = 22;
const C_ROW_W = COVERS.length * C_W + (COVERS.length - 1) * C_GAP;
const C_X0 = Math.round((W - C_ROW_W) / 2);
const C_Y = 412;

// Конвертуємо кожен файл у data URI, щоб включити в SVG.
const dataUris = COVERS.map((file) => {
  const buf = readFileSync(resolve(file));
  const ext = file.endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${buf.toString("base64")}`;
});

// SVG-розмітка картинки. Без логотипа і темної рамки — лише текст і ряд обкладинок.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f4f7fc"/>
      <stop offset="55%" stop-color="#eef2fb"/>
      <stop offset="100%" stop-color="#eaf2fb"/>
    </linearGradient>
    <radialGradient id="orbA" cx="14%" cy="18%" r="42%">
      <stop offset="0%" stop-color="rgba(129, 140, 248, 0.55)"/>
      <stop offset="70%" stop-color="rgba(129, 140, 248, 0)"/>
    </radialGradient>
    <radialGradient id="orbB" cx="88%" cy="22%" r="38%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.50)"/>
      <stop offset="70%" stop-color="rgba(56, 189, 248, 0)"/>
    </radialGradient>
    <radialGradient id="orbC" cx="55%" cy="105%" r="55%">
      <stop offset="0%" stop-color="rgba(20, 184, 166, 0.40)"/>
      <stop offset="70%" stop-color="rgba(20, 184, 166, 0)"/>
    </radialGradient>
    <filter id="coverShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(15,23,42,0.32)"/>
    </filter>
    ${COVERS.map((_, i) => {
      const x = C_X0 + i * (C_W + C_GAP);
      return `<clipPath id="cv${i}"><rect x="${x}" y="${C_Y}" width="${C_W}" height="${C_H}" rx="14"/></clipPath>`;
    }).join("\n    ")}
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#orbA)"/>
  <rect width="${W}" height="${H}" fill="url(#orbB)"/>
  <rect width="${W}" height="${H}" fill="url(#orbC)"/>

  <!-- Subtle grid -->
  <g stroke="rgba(15, 23, 42, 0.04)" stroke-width="1">
    <line x1="0" y1="158" x2="${W}" y2="158"/>
    <line x1="0" y1="315" x2="${W}" y2="315"/>
    <line x1="240" y1="0" x2="240" y2="${H}"/>
    <line x1="480" y1="0" x2="480" y2="${H}"/>
    <line x1="720" y1="0" x2="720" y2="${H}"/>
    <line x1="960" y1="0" x2="960" y2="${H}"/>
  </g>

  <!-- Headline -->
  <text x="600" y="190" font-family="Manrope, Inter, system-ui, sans-serif" font-weight="800" font-size="58"
        fill="#0f172a" text-anchor="middle" letter-spacing="-2">Перекладаємо те,</text>
  <text x="600" y="262" font-family="Manrope, Inter, system-ui, sans-serif" font-weight="800" font-size="58"
        fill="#4338ca" text-anchor="middle" letter-spacing="-2">у що самі граємо</text>

  <!-- Subtitle -->
  <text x="600" y="312" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="20"
        fill="#475569" text-anchor="middle">Сюжет, інтерфейс і дрібниці — українською.</text>

  <!-- Bottom row: actual game covers from /public/images/ -->
  <g filter="url(#coverShadow)">
    ${COVERS.map((_, i) => {
      const x = C_X0 + i * (C_W + C_GAP);
      return `<g clip-path="url(#cv${i})">
      <image href="${dataUris[i]}" x="${x}" y="${C_Y}" width="${C_W}" height="${C_H}" preserveAspectRatio="xMidYMid slice"/>
    </g>`;
    }).join("\n    ")}
    ${COVERS.map((_, i) => {
      const x = C_X0 + i * (C_W + C_GAP);
      return `<rect x="${x}" y="${C_Y}" width="${C_W}" height="${C_H}" rx="14" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2"/>`;
    }).join("\n    ")}
  </g>

  <!-- Bottom URL stripe -->
  <g transform="translate(600, ${C_Y + C_H + 22})">
    <text x="0" y="0" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="13"
          fill="#64748b" text-anchor="middle" letter-spacing="0.8">littlebitua.github.io</text>
  </g>

  <!-- Decorative sparkles -->
  <g fill="#6366f1" opacity="0.55">
    <circle cx="120" cy="60" r="3"/>
    <circle cx="1080" cy="60" r="3"/>
    <circle cx="80" cy="600" r="3"/>
    <circle cx="1120" cy="600" r="3"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg), { density: 192 })
  .resize(W, H, { fit: "cover" })
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(resolve("public/images/og.png"));

const stats = statSync(resolve("public/images/og.png"));
console.log(
  `og.png — ${(stats.size / 1024).toFixed(1)} KB · ${W}×${H} · ${COVERS.length} обкладинок`
);
