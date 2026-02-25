## Cursor Cloud specific instructions

This is a **Pomodoro Timer with Task Manager** — a client-side React SPA built with Vite and Tailwind CSS. There is no backend, database, or authentication.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite Dev Server | `npm run dev` | 5173 | The only service; serves the app with HMR |

### Key notes

- **Lint:** `npm run lint` runs ESLint 9 (flat config in `eslint.config.js`) with recommended rules + React Hooks + React Refresh.
- **Type check:** `npm run typecheck` runs `tsc --noEmit`. The `tsconfig.json` has `allowJs: true` and `checkJs: true` so it type-checks `.jsx` files. `noImplicitAny` is disabled since source is JS without full type annotations; strict null checks are active.
- **Build:** `npm run build` runs lint, then typecheck, then `vite build`. All three must pass.
- **No test framework configured.** There are no automated tests.
- **No environment variables or secrets required.** All state is in-memory React state.
- **Preview production build:** `npm run preview` serves the built `dist/` folder.
- See `README.md` for general project context (Replit-oriented).

### Agent workflow

Follow this loop for every change. Keep each iteration small and commit frequently.

1. **Plan** — Scope the change to the smallest useful unit. Write down what will change and why before touching code.
2. **Implement** — Make the change. Touch only what the plan calls for.
3. **Test** — Run all checks and verify behavior:
   - `npm run lint` — must pass with 0 errors.
   - `npm run typecheck` — must pass with 0 errors.
   - `npm run build` — must complete successfully (runs lint + typecheck + vite build).
   - If the change affects UI, start the dev server (`npm run dev`) and verify in the browser.
4. **Review** — Re-read the diff (`git diff`). Confirm no unrelated changes, no leftover debug code, and no regressions.
5. **Commit & push** — Stage and commit with a clear message, then push:
   ```
   git add -A
   git diff --cached --stat   # sanity-check what's staged
   git commit -m "<concise description>"
   git push -u origin <branch>
   ```

Repeat from step 1 for the next change. Never batch unrelated changes into one commit.
