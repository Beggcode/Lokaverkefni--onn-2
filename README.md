# NTV — E-commerce Store

**Live:** https://client-production-dfcf.up.railway.app

NTV is a full-stack e-commerce store for outdoor clothing like Patagonia for example.

## Features

- Product listing with search, category filters, and season filters
- Individual product pages
- User registration and login with JWT authentication
- Shopping cart
- checkout and payment (Demonstrative only)
- Order confirmation page
- Recently viewed products (localStorage)
- New Vibes — highlights the 3 most recently added products in the nav menu, determined by creation date

## Tech Stack

**Frontend:** React, TypeScript, Vite, TanStack Router, TanStack Query, Zustand, Zod, Radix UI

**Backend:** Node.js, Express, Prisma, PostgreSQL

**Deployment:** Railway (API + Client + Postgres database)

## Architecture

**Monorepo** — the API, client, and a shared package live in one repo. The shared package holds types and validation schemas used by both sides so they never go out of sync.

**Custom API over Supabase** — building the backend from scratch gave full control over how auth, data, and logic work rather than being locked into a third-party service where security might become compromised. Auth uses httpOnly cookies to store the JWT so it can't be read or stolen by malicious scripts.

**TanStack Router** — chosen over React Router because routes, params, and search filters are fully typed, which catches mistakes in production instead of release.

**Card validation** — the checkout form uses the [`card-validator`](https://github.com/braintree/card-validator) library integrated into a Zod schema. It validates card numbers via the Luhn algorithm, checks expiry dates, and validates CVV length based on the detected card type. Since the payment flow is demonstrative, no real charges will be made.

**Route files** — routing config lives in `.route.ts` files separate from the page components, keeping each file ideally focused on one job.

## Local Setup

**Prerequisites:** [Node.js](https://nodejs.org), [pnpm](https://pnpm.io), [PostgreSQL](https://www.postgresql.org)

```bash
git clone https://github.com/Beggcode/Lokaverkefni--onn-2.git
cd Lokaverkefni--onn-2
pnpm install
```

Both packages need a `.env` file for local environment variables. Create these files manually in the root of each package (they are git-ignored and not therefore included in the repo).

`api/.env`:

```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=any_random_string
CLIENT_URL=http://localhost:5173
```

`client/.env`:

```
VITE_API_URL=http://localhost:3000
```

PostgreSQL must be running locally before starting the API.

On Linux:

```bash
sudo systemctl start postgresql
```

Run migrations to create the database tables, then seed to populate it with product data:

```bash
pnpm db:migrate
pnpm db:seed
```

Start dev servers (run from the project root):

```bash
pnpm dev:api
pnpm dev:client
```
