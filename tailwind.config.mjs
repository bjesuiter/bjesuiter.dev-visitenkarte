import { slate } from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
      backgroundImage: {
        "profile-pic": "url('/2024_profile_pic.jpg')",
      },
      fontFamily: {
        headings: ["Rubik"],
        motto: ["Playwrite"],
      },
      colors: {
        "foreground-light": slate[50],
        "codemonument-primary": "#D843EB",
        "codemonument-banner": "#C704BA",
        "codemonument-dark": "#5B1F65",
        "codemonument-light": "#C842DD",
      },
    },
    screens: {
      sm: "500px",
      md: "860px",
    },
  },
  plugins: [],
};
