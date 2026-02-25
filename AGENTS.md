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
