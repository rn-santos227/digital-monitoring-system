# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

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

Locally preview production build:

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

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
