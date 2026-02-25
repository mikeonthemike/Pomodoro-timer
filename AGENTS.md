## Cursor Cloud specific instructions

This is a **Pomodoro Timer with Task Manager** — a client-side React SPA built with Vite and Tailwind CSS. There is no backend, database, or authentication.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite Dev Server | `npm run dev` | 5173 | The only service; serves the app with HMR |

### Key notes

- **No lint or test tooling configured.** There is no ESLint, no test framework, and no test scripts in `package.json`. The `tsconfig.json` exists but `allowJs` is `false` and all source files are `.jsx`, so `tsc --noEmit` does not type-check them.
- **No environment variables or secrets required.** All state is in-memory React state.
- **Build:** `npm run build` produces a static site in `dist/`.
- **Preview production build:** `npm run preview` serves the built `dist/` folder.
- See `README.md` for general project context (Replit-oriented).
