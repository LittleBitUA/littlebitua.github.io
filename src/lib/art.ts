// ─── Game artwork ──────────────────────────────────────────────
// Широкий банер, логотип і колір теми гри для «кінематографічного» дизайну.
// Банер і логотип беремо з LBK Launcher (launcherArt), запасний варіант —
// library_hero зі Steam. Колір теми — домінантний колір банера, приглушений,
// щоб на ньому читався світлий текст. Усе рахується один раз під час збірки.

import sharp from "sharp";
import type { Game } from "../data/games";
import { cover } from "./cover";

export interface GameArt {
  /** Стиснутий банер для тла (або null — тоді тлом служить обкладинка) */
  banner: string | null;
  /** Логотип з прозорим тлом, якщо він є */
  logo: string | null;
  /** Колір теми у форматі rgb(r g b) */
  tint: string;
}

const FALLBACK_TINT = "rgb(38 30 44)";
const TIMEOUT_MS = 20_000;

const bytesCache = new Map<string, Promise<Buffer | null>>();
const artCache = new Map<string, Promise<GameArt>>();

function fetchBytes(url: string): Promise<Buffer | null> {
  let result = bytesCache.get(url);
  if (!result) {
    result = fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
      .then(async (res) => (res.ok ? Buffer.from(await res.arrayBuffer()) : null))
      .catch(() => null);
    bytesCache.set(url, result);
  }
  return result;
}

const steamAppId = (g: Game) => g.steamUrl?.match(/\/app\/(\d+)/)?.[1];

/**
 * Колір теми: середнє з яскравих і насичених пікселів (темні й сірі ділянки
 * майже не впливають), потім приводимо до темного, але кольорового тону.
 */
async function tintOf(bytes: Buffer): Promise<string> {
  try {
    const { data, info } = await sharp(bytes).resize(48, 48, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let r = 0, g = 0, b = 0, total = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      const pr = data[i], pg = data[i + 1], pb = data[i + 2];
      const max = Math.max(pr, pg, pb), min = Math.min(pr, pg, pb);
      const sat = max === 0 ? 0 : (max - min) / max;
      const w = sat * sat * (max / 255) + 0.002;
      r += pr * w; g += pg * w; b += pb * w; total += w;
    }
    r /= total; g /= total; b /= total;
    // Цільова яскравість ~ 70 з 255: тло темне, але колір гри впізнаваний
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b || 1;
    const k = 70 / lum;
    const c = (v: number) => Math.round(Math.max(10, Math.min(150, v * k)));
    return `rgb(${c(r)} ${c(g)} ${c(b)})`;
  } catch {
    return FALLBACK_TINT;
  }
}

async function resolve(g: Game): Promise<GameArt> {
  const bannerCandidates = [
    g.launcherArt?.banner,
    steamAppId(g) && `https://shared.steamstatic.com/store_item_assets/steam/apps/${steamAppId(g)}/library_hero.jpg`,
  ].filter(Boolean) as string[];

  let bannerSrc: string | null = null;
  let bannerBytes: Buffer | null = null;
  for (const src of bannerCandidates) {
    bannerBytes = await fetchBytes(src);
    if (bannerBytes) { bannerSrc = src; break; }
  }

  const logoBytes = g.launcherArt?.logo ? await fetchBytes(g.launcherArt.logo) : null;

  const tintSource = bannerBytes ?? (await fetchBytes(g.cover));
  return {
    banner: bannerSrc ? await cover(bannerSrc, 1920) : null,
    logo: logoBytes && g.launcherArt ? await cover(g.launcherArt.logo, 720) : null,
    tint: tintSource ? await tintOf(tintSource) : FALLBACK_TINT,
  };
}

export function artOf(g: Game): Promise<GameArt> {
  let result = artCache.get(g.id);
  if (!result) {
    result = resolve(g);
    artCache.set(g.id, result);
  }
  return result;
}
