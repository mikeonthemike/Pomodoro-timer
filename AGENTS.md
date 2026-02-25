## Cursor Cloud specific instructions

This repo is a **Pomodoro Timer with Task Manager** built as a client-side React SPA using Vite and Tailwind CSS.

## Project facts

- Frontend-only application (no backend, database, or auth).
- No environment variables or secrets are required.
- Primary runtime state is client-side React state.

## Services

| Service | Command | Port | Notes |
| --- | --- | --- | --- |
| Vite dev server | `npm run dev` | 5173 | Serves app with HMR |

## Commands

- **Dev:** `npm run dev`
- **Test:** `npm test` (Vitest), `npm run test:watch`
- **Lint:** `npm run lint` (ESLint flat config in `eslint.config.js`)
- **Typecheck:** `npm run typecheck` (`tsc --noEmit`)
- **Build:** `npm run build` (runs lint + typecheck + `vite build`)
- **Preview:** `npm run preview` (serves `dist/`)

## Code map

- `src/App.jsx`: main application shell and feature composition.
- `src/components/TaskManager.jsx`: task CRUD and list behavior.
- `src/components/Settings.jsx`: timer and app settings UI.
- `src/test/*.test.jsx`: React Testing Library + Vitest coverage.

## Agent workflow

Use this loop for each change, keeping diffs small and focused:

1. **Plan**: define the smallest useful scope before editing.
2. **Implement**: touch only files needed for the scoped change.
3. **Test**:
   - `npm test`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
   - If UI is affected, run `npm run dev` and verify behavior in browser.
4. **Review**: run `git diff` and confirm no unrelated edits or debug leftovers.
5. **Commit & push**:
   - `git add -A`
   - `git diff --cached --stat`
   - `git commit -m "<concise description>"`
   - `git push -u origin <branch>`

Repeat this loop for each additional scoped change. Do not batch unrelated work into one commit.
