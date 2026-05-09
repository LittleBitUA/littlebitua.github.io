// Генерує public/images/og.png з public/images/og.svg.
// Запускати: node scripts/generate-og.mjs

import sharp from "sharp";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const SVG_PATH = resolve("public/images/og.svg");
const PNG_PATH = resolve("public/images/og.png");

const svgBuffer = readFileSync(SVG_PATH);

await sharp(svgBuffer, { density: 192 })
  .resize(1200, 630, { fit: "cover" })
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(PNG_PATH);

const stats = statSync(PNG_PATH);
console.log(
  `og.png — ${(stats.size / 1024).toFixed(1)} KB · 1200×630`
);
