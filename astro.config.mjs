// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://hanivan.my.id",
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      // applyBaseStyles: true,
    }),
    react(),
  ],
});
