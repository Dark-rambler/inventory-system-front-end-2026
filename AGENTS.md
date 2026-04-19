# AGENTS.md

## Quick start
- Use Node.js 18+.
- `npm start`: Angular dev server (`ng serve`) on `http://localhost:4200`.
- `npm run build`: production build to `dist/inventory-system-front-end`.
- `npm run lint`: full Angular ESLint run.
- `npm test`: Karma tests (watch mode by default).
- Single spec: `npm test -- --include="**/file-name.spec.ts"`.
- One-off tests: `npm test -- --watch=false`.

## Pre-commit behavior (important)
- Husky pre-commit hook runs only `npx lint-staged`.
- `lint-staged` rules from `package.json`:
  - `*.ts`, `*.html`: `eslint --fix` then `prettier --write`
  - `*.{scss,css,json}`: `prettier --write`
- Pre-commit does **not** run full `npm run lint`, `npm test`, or `npm run build`.

## How the app is wired
- Standalone bootstrap: `src/main.ts` + providers in `src/app/app.config.ts`.
- Router entrypoint: `src/app/app.routes.ts`.
  - `/login` uses `publicGuard`.
  - Authenticated area uses `authGuard` and `MainLayoutComponent`.
  - Root path redirects to `/dashboard`.
- `MainLayoutComponent` opens branch picker dialog if `localStorage.selectedBranch` is missing.

## Dashboard specifics
- Dashboard route lazy-loads `src/app/domains/dashboard/dashboard.component`.
- Current dashboard data is mock-backed (not API-backed yet):
  - Charts: `src/app/domains/dashboard/constants/dashboard-charts.mock.ts`
  - Activity feed: `src/app/domains/dashboard/constants/recent-activity.mock.ts`
- Services add artificial latency (`delay(...)`), so loading/skeleton states are meaningful and should be preserved.

## Conventions enforced by config
- TypeScript strict mode is enabled (`tsconfig.json`).
- Use configured path aliases: `@app/*`, `@shared/*`, `@domains/*`, `@env/*`.
- Angular selector lint rules are enforced:
  - Components: element selector, `app-...` kebab-case
  - Directives: attribute selector, `app...` camelCase
- Prettier rules: single quotes, semicolons, width 100, Angular HTML parser override.
- Tailwind scans only `src/**/*.{html,ts}`; classes outside these files will be purged.

## Repo realities
- No `.github/workflows` CI definitions exist in this repository.
