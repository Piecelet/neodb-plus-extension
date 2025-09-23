# Repository Guidelines

## Project Structure & Module Organization
- The extension is built with WXT; active scripts live under `entrypoints/` with `content/` handling DOM injections on NeoDB and Douban pages and `background/` owning cross-tab messaging.
- Shared assets reside in `public/icon/`, while build and tooling configs (`wxt.config.ts`, `tsconfig.json`) sit at the repo root.
- Generated artifacts land in WXT's build output directory; avoid editing those directly and keep changes focused on the TypeScript sources.

## Build, Test, and Development Commands
- Install dependencies with `pnpm install`; it runs `wxt prepare` to scaffold WXT internals.
- `pnpm dev` launches WXT’s Chrome dev server with automatic rebuilds; use `pnpm dev:firefox` when validating Firefox-specific behavior.
- Ship builds with `pnpm build` (Chrome) or `pnpm build:firefox`; bundle and sign-off using `pnpm zip` or `pnpm zip:firefox` for store uploads.
- Run `pnpm compile` before submitting changes to ensure the TypeScript surface stays type-safe.

## Coding Style & Naming Conventions
- Code is TypeScript-first with React JSX where needed; keep modules small and favor named exports from `entrypoints/*` files.
- Follow the established two-space indentation and single-quote-free import style (`"module"`). Run Prettier 3 (`pnpm exec prettier --write <paths>`) to normalize formatting.
- Keep DOM query selectors descriptive (`doubanPageSearch`, `neodbPageSearch`) and mirror filename casing when adding new entrypoints.

## Testing Guidelines
- There is no automated test harness; rely on WXT’s hot reload plus manual browser verification.
- Smoke-test each content script scenario in Chrome and Firefox: confirm NeoDB search buttons render, Douban forms autofill, and background messages resolve without console errors.
- When touching network logic, throttle dev tools to simulate slow responses and watch for unhandled rejections.

## Commit & Pull Request Guidelines
- Match the existing concise, imperative commit style (`fix: ...`, `docs: ...`, or direct verbs like `Update dependencies`). Squash noisy WIP commits before publishing.
- PRs should state the problem, the approach, and any manual validation steps (include browser/URL pairs tested). Link related issues and add before/after screenshots or GIFs when UI changes occur.

## Security & Configuration Tips
- Never commit personal NeoDB access tokens; inject them through browser storage or local overrides during development.
- Review manifest permissions before expanding host access, and document any new scopes in the PR to simplify the extension review process.
