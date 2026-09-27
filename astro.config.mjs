// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [sitemap({ filter: (page) => !page.includes("/updates") })],
  site: "https://littlebitua.github.io",
  // Стара стрічка оновлень будувалася з недостовірного progressHistory —
  // тепер її замінює хронологія.
  redirects: {
    "/updates": "/chronology/",
  },
  // Обкладинки з чужих CDN під час збірки завантажуються й стискаються у WebP
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
});
