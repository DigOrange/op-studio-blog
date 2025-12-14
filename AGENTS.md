# Repository Guidelines

This document is a short, practical guide for contributing to this Next.js + Prisma project.

## Project Structure & Modules

- Application routes and layouts live in `app/` (Next.js App Router).
- Shared UI, hooks, libs, and types are under `src/components`, `src/hooks`, `src/lib`, and `src/types`.
- Database schema and migrations live in `prisma/` (`schema.prisma`, `migrations/`, `seed.ts`).
- Static assets are in `public/`. Project docs are in `docs/`.

## Build, Test & Development

- `npm run dev` – start local dev server.
- `npm run build` / `npm start` – production build and run.
- `npm run lint` – run ESLint checks.
- `npm run format` – format code with Prettier + Tailwind plugin.
- `npm run db:generate` / `db:push` / `db:migrate` – manage Prisma schema and migrations.
- `npm run db:seed` / `db:studio` – seed data and inspect DB.

## Coding Style & Naming

- Use TypeScript everywhere (`.ts` / `.tsx`), 2-space indentation, and named exports where practical.
- Prefer functional React components in `app/` and `src/components/`.
- Name files and folders in `kebab-case`, React components in `PascalCase`, and hooks as `useSomething`.
- Always run `npm run format` and `npm run lint` before committing.

## Testing Guidelines

- If you add logic in `src/lib` or complex components, add or update tests in the closest relevant area (follow existing patterns).
- Use realistic test data and cover common error paths, not just the happy path.

## Commit & Pull Requests

- Write clear, imperative commit messages (e.g., `feat: add post editor`, `fix: handle missing session`).
- Keep PRs focused and small; include a summary, screenshots for UI changes, and links to related issues/tasks.
- Ensure the app builds (`npm run build`), lints, and DB migrations run before requesting review.

## Security & Configuration

- Do not commit secrets or `.env` files. Use environment variables documented in `README.md` or `docs/`.
- When touching authentication or database access, prefer existing helpers in `src/lib` and `stack/` over new ad-hoc logic.

