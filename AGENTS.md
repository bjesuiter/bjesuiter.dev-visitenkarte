# Repository Guidelines

## Project Structure & Module Organization
This repository is a static Astro site.

- `src/pages/`: route entry points (`index.astro`).
- `src/components/`: reusable UI components (for example `Visitenkarte.astro`, `Social-Link.astro`).
- `src/layouts/`: shared page shells (`Layout.astro`).
- `src/css/`: global and reset styles.
- `src/assets/` and `public/`: images and static assets.
- Root config: `astro.config.mjs`, `tsconfig.json`, `deno.json`, `bunfig.toml`.

## Build, Test, and Development Commands
Use Bun for local workflows:

- `bun install`: install dependencies.
- `bun run dev` (or `bun run start`): run local Astro dev server.
- `bun run build`: produce static output in `dist/`.
- `bun run preview`: preview the built site.
- `bun run prettier`: format all files with Prettier.

Deployment note:
- Deno Deploy pulls from the repository directly; `package.json` does not need `deploy` or `rollout` scripts.

## Coding Style & Naming Conventions
- Follow existing Astro + TypeScript strict setup (`tsconfig` extends `astro/tsconfigs/strict`).
- Use 2-space indentation in `.astro`, `.ts`, `.css`, and config files.
- Keep component files consistent with current naming style in this repo (`PascalCase` or `Pascal-Kebab`, e.g. `Social-Link.astro`).
- Use Tailwind utility classes and Astro `class:list` patterns where conditional styling is needed.
- Run `bun run prettier` before opening a PR.

## Testing Guidelines
There is currently no committed automated test suite (`test`/`spec` files are not present).

Minimum validation before merge:
- `bun run build` must succeed.
- `bun run preview` and manually verify core page rendering, responsive layout, and social link behavior.
- For UI changes, include before/after screenshots in the PR.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages, often with a type prefix:

- Preferred format: `<type>: <summary>` (examples: `fix: ...`, `refactor: ...`, `upgrade deps`).
- Keep commits focused on one concern.
- PRs should include: purpose, key changes, manual test steps, and screenshots for visual updates.
- Link related issue/task IDs when available.
