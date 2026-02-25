# Pomodoro Timer

A productivity app combining a Pomodoro technique countdown timer with a drag-and-drop task manager. Built with React, Vite, and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR (port 5173) |
| `npm run build` | Lint + typecheck + production build |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking |

## Docker

### Production

```bash
docker compose up app
```

Serves the production build via nginx on [http://localhost:8080](http://localhost:8080).

### Development

```bash
docker compose up dev
```

Runs the Vite dev server with hot reload on [http://localhost:5173](http://localhost:5173).

## Tech Stack

- **UI:** React 18
- **Build:** Vite 5
- **CSS:** Tailwind CSS 3
- **Drag & Drop:** @hello-pangea/dnd
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint 9 (flat config)
- **Type Checking:** TypeScript (checkJs)

## License

ISC License. See [LICENSE](LICENSE) for details.
