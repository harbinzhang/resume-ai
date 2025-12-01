# Repository Guidelines

## Project Structure & Module Organization
The Vite-powered React client sits in `src/`, with entry `main.tsx`, routing/auth flows in `App.tsx`, and dashboard views in `Dashboard.tsx`. Firebase glue lives in `src/firebase.ts`, which connects to local emulators during development. Global styles (`App.css`, `index.css`) and SVG assets accompany the components, while deployable static files sit in `public/`. Firebase Functions code lives under `functions/src` and compiles to `lib/` during deploys.

## Build, Test, and Development Commands
- `npm run dev`: start Vite with hot reload, automatically wiring Firebase emulators via `src/firebase.ts`.
- `npm run build`: run TypeScript project references (`tsc -b`) and emit the production Vite bundle to `dist/`.
- `npm run lint`: apply the shared flat ESLint config to every `.ts/.tsx` file; fix issues before opening PRs.
- `npm run preview`: serve the built bundle locally for sanity checks.
- `cd functions && npm run serve`: transpile the Cloud Functions TypeScript and boot the Firebase Functions emulator; use `npm run deploy` there when releasing backend changes.

## Coding Style & Naming Conventions
Write all UI code in TypeScript with ES modules. Components and routes use PascalCase filenames (`Dashboard.tsx`), hooks/utilities use camelCase, and CSS classes remain kebab-case to match existing styles. Keep indentation at two spaces, prefer early returns, and favor functional components/hooks over classes. Run `npm run lint` (React Hooks + Refresh plugins included) and adopt the same import order shown in `App.tsx` (external → local).

## Testing Guidelines
Automated tests are not yet checked in, so introduce them alongside the code they cover. Use `vitest` + `@testing-library/react` for UI components (`Component.test.tsx` adjacent to the source) and `firebase-functions-test` for Cloud Functions (`functions/src/__tests__`). Aim for 80% line coverage on new modules and ensure authentication flows (Google + email/password) have regression tests. Until CI is set up, run the suite locally before each PR.

## Commit & Pull Request Guidelines
Follow short, present-tense subjects mirroring the current history (`dashboard`, `email/pwd support`, `feat: …`). Prefix structural changes with Conventional Commit tokens (`feat:`, `fix:`, `chore:`) when they affect release notes; otherwise keep to ≤50 characters. Every PR should describe the motivation, list test evidence (`npm run build`, emulator screenshots), and link the relevant issue or Firebase task. Include UI captures for visual tweaks and emulator logs for backend work.

## Firebase & Environment Tips
Create a `.env` containing the `VITE_FIREBASE_*` keys referenced in `src/firebase.ts`; placeholder values are acceptable when emulators run. The app autoconnects to emulators on ports 9099 (Auth), 8080 (Firestore), 9199 (Storage), and 5001 (Functions)—match those in `firebase.json` before testing auth flows. Keep `firestore.rules`, `storage.rules`, and `firestore.indexes.json` in sync with any schema updates, and coordinate Firebase deployments (`firebase deploy`) with both hosting and `functions` changes.
