# Pixel Pets – To Do Later

A running backlog of “nice-to-have” improvements for Pixel Pets.  

---

## 1. Backend (Spring Boot / JPA / API)

- [ ] Tighten Spring Security rules
  - [ ] Lock down endpoints so not everything is `permitAll`.
  - [ ] Keep `/api/auth/**`, `/api/health`, and `/` open; require auth for user/pet routes.
  - [ ] Revisit `SecurityConfig.filterChain` once real auth tokens are in place.

- [ ] Harden JPA / Hibernate for production
  - [ ] When schema is stable, change `spring.jpa.hibernate.ddl-auto=update` to `validate` or `none`.
  - [ ] Manage schema via migrations (Flyway/Liquibase) or manual SQL scripts.
  - [ ] Revisit `spring.jpa.open-in-view` and decide whether to disable it; adjust code accordingly.

- [ ] Error handling & exceptions
  - [ ] Introduce custom exceptions (e.g. `NotFoundException`, `ConflictException`) instead of repeating `ResponseStatusException`.
  - [ ] Add a `@ControllerAdvice` to format **all** errors (not just validation) into a consistent JSON shape.

- [ ] Domain logic & configuration
  - [ ] Extract pet stat decay “tuning knobs” (per-minute decay, caps, bounds) into config/properties for easier tweaking.
  - [ ] Extract shared username/email normalization helpers into a small utility instead of duplicating in `UserService` / `AuthController`.

- [ ] Health & root endpoints
  - [ ] Review whether `HealthController` (`/api/health`) and `RootController` (`/`) should be consolidated or kept separate.
  - [ ] Standardize their response shapes and clearly document which is for humans vs. platform checks.

- [ ] Database credentials & config
  - [ ] Externalize local DB password:
    - [ ] Replace hard-coded `spring.datasource.password=` with an environment variable (e.g. `SPRING_LOCAL_DB_PASSWORD`) so dev secrets never appear in GitHub or screenshots.

---

## 2. Frontend (React / UI / UX)

- [ ] Add About / Help page(s)
  - [ ] Create an `/about` page that explains what Pixel Pets is and who built it.
  - [ ] List the tech stack and any fun credits/shoutouts.
  - [ ] Create a `/help` or “How to Play” section explaining stats (fullness, happiness, energy) and actions (feed/play/rest).
  - [ ] Optionally add keyboard/UX tips and a link to portfolio / GitHub.

- [ ] Document the notice / toast system
  - [ ] Add README/docs for how `NoticeProvider` works (global toasts).
  - [ ] Show how to use `useNotice()` in a component (e.g. `notify.success('Saved!')`).
  - [ ] Note any gotchas (dedupe timing, max toast count, etc.).

- [ ] API client improvements
  - [ ] When auth tokens exist, extend the API client so all requests automatically inject `Authorization` headers.
  - [ ] Move `src/api.js` into `src/api/client.js`.
  - [ ] (Later) Consider splitting into `api/auth.js`, `api/pets.js`, `api/users.js` for clearer domains.

- [ ] Feature organization (optional, for future growth)
  - [ ] Consider grouping related files into:
    - `features/auth` (Login, Register, RequireAuth, auth utilities)
    - `features/profile` (Settings)
    - `features/pets` (Dashboard, PetProfile, AdoptForm, PetSprite, StatusBarPixel, mood helpers)
  - [ ] Keep shared UI in `components/` and shared hooks in `hooks/`.

- [ ] Theme system & visual polish
  - [ ] Move the theme toggle logic from inline script in `index.html` into a React `<ThemeToggle />` component.
  - [ ] Reconcile `body.theme-cola` with the Konami `data-theme="gb"` toggle so they work together cleanly.
  - [ ] Persist theme choice in `localStorage` (optional).
  - [ ] Honor `prefers-color-scheme` for users with OS-level preferences (optional).

- [ ] Pixel art rendering tweaks
  - [ ] Scope `image-rendering: pixelated;` to sprite/image selectors (e.g. `.pet-sprite`) instead of the universal `*`.
  - [ ] Keep `*` only for reset concerns (margin, padding, box-sizing) so text stays crisp.

- [ ] CSS organization
  - [ ] Split `style.css` into partials if needed:
    - `styles/base.css` (reset, body, typography, utilities)
    - `styles/layout.css` (nav, panels, layout)
    - `styles/components.css` (buttons, forms, status bars, sprites, notices)
    - `styles/theme.css` (variables, theme variants, pixel borders)
  - [ ] Import via a single `styles/index.css` entry in `main.jsx`.

---

## 3. Infrastructure & Deployment (Netlify / Elastic Beanstalk / Env Vars)

- [ ] Frontend → Backend configuration
  - [ ] Add `.env.production` or Netlify env var for `VITE_API_BASE` pointing to the Elastic Beanstalk backend.
  - [ ] Document environment URLs for local, staging (if any), and production.

- [ ] Netlify redirects / config
  - [ ] Revisit `force = true` in Netlify redirects once routing is stable so it doesn’t unexpectedly override future rules.

- [ ] Backend environment configuration
  - [ ] Confirm all sensitive values (DB credentials, JWT secrets, etc.) live in environment variables and **not** in source code.

---

## 4. Build, Tooling & Project Metadata

- [ ] Maven / Gradle configuration
  - [ ] Ensure any “skip tests” profile (e.g. `dev-skip-tests`) is **not** `activeByDefault` so CI and prod builds run tests.
  - [ ] Clean up POM metadata:
    - [ ] Fill in `<licenses>`, `<developers>`, and `<scm>` with real info, or remove them if unused.

- [ ] ESLint / Prettier / Stylelint consolidation
  - [ ] Consolidate ESLint to a single config (`eslint.config.js`).
  - [ ] Remove `src/.eslintrc.json` once everything is using the new config.
  - [ ] Keep Prettier and Stylelint configs at the repo root as the single source of truth.

- [ ] Package.json polish
  - [ ] Add `description`, `author`, and `license` fields to `package.json` for portfolio polish.

- [ ] Import aliases (nice-to-have)
  - [ ] Set up import aliases (via `jsconfig.json` / bundler / test config) so imports look like:
    - `import NoticeProvider from 'components/NoticeProvider';`
  - [ ] Update existing imports away from very long relative paths.

---

## 5. Documentation

- [ ] Backend / API documentation in README
  - [ ] Document endpoint groups:
    - [ ] `/api/auth/**` (auth flows)
    - [ ] `/api/users/**` (user profile / account)
    - [ ] `/api/pets/**` (pet CRUD and actions)
    - [ ] `/api/health` (health checks)
    - [ ] `/` (root / human-friendly status)
  - [ ] Include sample requests/responses where helpful.

- [ ] Error handling docs
  - [ ] Document validation behavior and sample error payloads (e.g. from `ApiErrorHandler` / `@ControllerAdvice`).
  - [ ] Note which HTTP codes you use for common scenarios (400, 401, 403, 404, 409, 500).

- [ ] Dev notes & “under the hood” section
  - [ ] Document:
    - [ ] Theme system (normal vs Konami “GB” mode).
    - [ ] Location of decay configuration and how to tune it.
    - [ ] Required environment variables for local development vs production.
  - [ ] Optionally add a short “Architecture Overview” diagram (frontend, API, DB, hosting).

---

_This list is intentionally aspirational — it’s okay if some items stay unchecked until Pixel Pets 2.0._ 🐾
