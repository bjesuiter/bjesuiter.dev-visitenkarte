import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import deno from "@deno/astro-adapter";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon({
      include: {
        bxl: ["github"],
        ph: ["x-logo-fill", "linkedin-logo-fill"],
        ion: ["logo-xing", "logo-stackoverflow", "logo-npm"],
        "simple-icons": ["jsr"],
      },
    }),
  ],
  output: "server",
  adapter: deno(),
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
