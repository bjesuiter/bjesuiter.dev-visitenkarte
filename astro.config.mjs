import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://bjesuiter.de",
  integrations: [
    icon({
      include: {
        bxl: ["github"],
        ph: [
          "x-logo-fill",
          "linkedin-logo-fill",
          "instagram-logo",
          "globe-fill",
        ],
        ion: ["logo-xing", "logo-stackoverflow", "logo-npm"],
        "simple-icons": ["jsr", "bluesky"],
      },
    }),
  ],
  // output: "static",
  output: "static",
  // vite config needed for astro-font
  vite: {
    plugins: [tailwindcss()],
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
