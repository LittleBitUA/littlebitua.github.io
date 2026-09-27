// ─── Covers ────────────────────────────────────────────────────
// Обкладинки лежать на чужих CDN (Steam, SteamGridDB) і важать до 1 МБ.
// Під час збірки Astro завантажує їх і стискає у WebP потрібної ширини;
// результат потрапляє в /_astro/ на нашому ж сайті.
// Якщо картинка недоступна — повертаємо оригінальне посилання, щоб збірка не падала.

import { getImage } from "astro:assets";

const cache = new Map<string, Promise<string>>();

export function cover(src: string, width = 400): Promise<string> {
  const key = `${src}|${width}`;
  let result = cache.get(key);
  if (!result) {
    result = getImage({ src, width, inferSize: true, format: "webp", quality: 78 })
      .then((img) => img.src)
      .catch((err) => {
        console.warn(`[cover] ${src}: ${(err as Error).message}. Використовую оригінал.`);
        return src;
      });
    cache.set(key, result);
  }
  return result;
}
