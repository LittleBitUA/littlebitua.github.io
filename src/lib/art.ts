// ─── Game artwork ──────────────────────────────────────────────
// Широкий банер, логотип і колір теми гри для «кінематографічного» дизайну.
// Банер — library_hero зі Steam (3840×1240, чіткий навіть на великих екранах),
// запасний варіант — банер з LBK Launcher (1920×620). Логотип — з лаунчера. Колір теми — домінантний колір банера, приглушений,
// щоб на ньому читався світлий текст. Усе рахується один раз під час збірки.

import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import type { Game } from "../data/games";
import { cover } from "./cover";

export interface GameArt {
  /** Стиснутий банер для тла (або null — тоді тлом служить обкладинка) */
  banner: string | null;
  /** Легкий банер, який показується одразу (поки вантажиться чіткий) */
  bannerLow: string | null;
  /** Чіткі розміри банера для srcset; підвантажуються окремо, після сторінки */
  bannerSrcset: string | null;
  /** Логотип з прозорим тлом, якщо він є */
  logo: string | null;
  /** Логотип у двох розмірах: на телефоні він дрібний, нема сенсу вантажити великий */
  logoSrcset: string | null;
  /** Колір теми у форматі rgb(r g b) */
  tint: string;
}

const FALLBACK_TINT = "rgb(38 30 44)";
const BANNER_WIDTHS = [1600, 2400, 3200, 3840];
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

// Власні банери: src/assets/banners/<id гри>.(jpg|png|webp), бажано 3840×1240.
// Мають пріоритет над Steam і лаунчером — для ігор, де там лише 1920 px.
const LOCAL = import.meta.glob<{ default: ImageMetadata }>("../assets/banners/*.{jpg,jpeg,png,webp}", { eager: true });
const localBanner = (id: string) => {
  const hit = Object.entries(LOCAL).find(([p]) => p.split("/").pop()!.replace(/\.\w+$/, "") === id);
  return hit ? { meta: hit[1].default, file: hit[0].split("/").pop()! } : null;
};

async function resolveLocal(g: Game, local: NonNullable<ReturnType<typeof localBanner>>): Promise<Pick<GameArt, "banner" | "bannerLow" | "bannerSrcset" | "tint">> {
  const { meta, file } = local;
  const img = (width: number, quality: number) =>
    getImage({ src: meta, width: Math.min(width, meta.width), format: "webp", quality }).then((r) => r.src);
  const widths = BANNER_WIDTHS.filter((w) => w < meta.width).concat(meta.width).filter((w, i, a) => a.indexOf(w) === i);
  let tint = FALLBACK_TINT;
  try { tint = await tintOf(readFileSync(join(process.cwd(), "src/assets/banners", file))); } catch {}
  return {
    banner: await img(1920, 84),
    bannerLow: await img(1280, 70),
    bannerSrcset: (await Promise.all(widths.map(async (w) => `${await img(w, 86)} ${w}w`))).join(", "),
    tint,
  };
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
  const local = localBanner(g.id);
  if (local) {
    const logoBytes = g.launcherArt?.logo ? await fetchBytes(g.launcherArt.logo) : null;
    return {
      ...(await resolveLocal(g, local)),
      logo: logoBytes && g.launcherArt ? await cover(g.launcherArt.logo, 720) : null,
      logoSrcset:
        logoBytes && g.launcherArt
          ? `${await cover(g.launcherArt.logo, 360)} 360w, ${await cover(g.launcherArt.logo, 720)} 720w, ${await cover(g.launcherArt.logo, 1120)} 1120w`
          : null,
    };
  }

  // Беремо найбільший з доступних банерів: library_hero_2x зі Steam (3840×1240),
  // звичайний library_hero (1920×620) або банер з LBK Launcher
  const id = steamAppId(g);
  const bannerCandidates = [
    id && `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/library_hero_2x.jpg`,
    id && `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/library_hero.jpg`,
    g.launcherArt?.banner,
  ].filter(Boolean) as string[];

  let bannerSrc: string | null = null;
  let bannerBytes: Buffer | null = null;
  let bannerWidth = 0;
  for (const src of bannerCandidates) {
    const bytes = await fetchBytes(src);
    if (!bytes) continue;
    const w = (await sharp(bytes).metadata().catch(() => ({ width: 0 }))).width ?? 0;
    if (w > bannerWidth) { bannerSrc = src; bannerBytes = bytes; bannerWidth = w; }
    if (w >= 3840) break;
  }

  const logoBytes = g.launcherArt?.logo ? await fetchBytes(g.launcherArt.logo) : null;

  const tintSource = bannerBytes ?? (await fetchBytes(g.cover));
  // Не збільшуємо картинку понад її справжній розмір — від цього вона лише розмивається
  const widths = BANNER_WIDTHS.filter((w) => w < bannerWidth).concat(bannerWidth).filter((w, i, a) => w > 0 && a.indexOf(w) === i);
  const sizes = bannerSrc
    ? await Promise.all(widths.map(async (w) => `${await cover(bannerSrc!, w, 86)} ${w}w`))
    : null;
  return {
    banner: bannerSrc ? await cover(bannerSrc, Math.min(1920, bannerWidth), 84) : null,
    bannerLow: bannerSrc ? await cover(bannerSrc, 1280, 70) : null,
    bannerSrcset: sizes ? sizes.join(", ") : null,
    logo: logoBytes && g.launcherArt ? await cover(g.launcherArt.logo, 720) : null,
    logoSrcset:
      logoBytes && g.launcherArt
        ? `${await cover(g.launcherArt.logo, 360)} 360w, ${await cover(g.launcherArt.logo, 720)} 720w, ${await cover(g.launcherArt.logo, 1120)} 1120w`
        : null,
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
