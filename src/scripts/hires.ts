// ─── Чіткі банери окремим кроком ───────────────────────────────
// Спершу показуємо легкий банер (1280 px), щоб сторінка з'явилася швидко.
// Потім у фоні вантажимо чіткий розмір із data-hi (srcset) і, коли він уже
// декодований, підміняємо — без мерехтіння.

export function upgrade(img: HTMLImageElement) {
  const set = img.dataset.hi;
  if (!set) return;
  delete img.dataset.hi;
  const pre = new Image();
  pre.sizes = img.sizes;
  pre.srcset = set;
  pre.decode().then(() => { img.srcset = set; }).catch(() => {});
}

/** Після завантаження сторінки — для всіх банерів, які вже показані */
export function upgradeAll(root: ParentNode = document) {
  const run = () => root.querySelectorAll<HTMLImageElement>("img[data-hi]:not([data-src])").forEach(upgrade);
  if (document.readyState === "complete") run();
  else addEventListener("load", run, { once: true });
}
