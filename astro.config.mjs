import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon({
      include: {
        bxl: ["github"],
        ph: ["x-logo-fill", "linkedin-logo-fill", "instagram-logo"],
        ion: ["logo-xing", "logo-stackoverflow", "logo-npm"],
        "simple-icons": ["jsr"],
      },
    }),
  ],
  // output: "static",
  output: "server",
  adapter: netlify(),
  // vite config needed for astro-font
  vite: {
    ssr: {
      external: [
        "node:buffer",
        "node:path",
        "node:fs",
        "node:os",
        "node:crypto",
      ],
    },
    resolve: {
      alias: {
        path: "node:path",
        fs: "node:fs",
        os: "node:os",
        crypto: "node:crypto",
      },
    },
  },
});
