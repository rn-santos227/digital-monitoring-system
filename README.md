# Digital AFP Personnel and Equipment Monitoring System

A Nuxt-based monitoring system for AFP personnel, unit organization, deployments, trainings, engagements, incidents, equipment inventory, equipment issuances, dashboard analytics, audit logs, and application settings.

## Project documentation

- [`documentation/api-guide.md`](documentation/api-guide.md) lists the currently implemented Nuxt server API routes under `server/api`.
- [`documentation/schema-guide.md`](documentation/schema-guide.md) summarizes the Supabase schema generated from the migration files under `supabase/migrations`.
- [`documentation/unit-testing-guide.md`](documentation/unit-testing-guide.md) explains how to run, organize, and extend the Vitest unit test suite.
- [`AGENTS.md`](AGENTS.md) records repository conventions for domain naming, shared modules, frontend organization, backend API safety, RBAC, and audit logging.

## Tech stack

- Nuxt 4 and Vue 3
- Pinia for frontend state management
- Supabase for database/auth-related infrastructure
- Tailwind CSS and Heroicons for UI styling and icons
- ExcelJS for spreadsheet-related workflows

## Setup

Install dependencies with your preferred package manager:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Local login seed account

`supabase/seed.sql` does **not** create a default login account unless you explicitly opt in. This avoids committing predictable credentials that could be unsafe in hosted environments.

To enable local bootstrap account seeding, set these PostgreSQL settings before running the seed:

```sql
alter database postgres set app.seed_default_user = 'true';
alter database postgres set app.default_user_email = 'your-admin-email@example.com';
alter database postgres set app.default_user_password = 'your-secure-password';
alter database postgres set app.default_user_full_name = 'Your Admin Name';
```

If `app.seed_default_user` is not set to `true`, the bootstrap user seed is skipped.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview a local production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Documentation maintenance

When API route files or Supabase migrations change, update the documentation in the same change set so maintainers can keep route and schema references in sync with the codebase.
