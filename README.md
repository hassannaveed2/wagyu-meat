# Wagyu Meat

E-commerce store for halal Japanese A5 and Australian wagyu in Pakistan, in English and Japanese, with a custom admin panel.

- **Storefront:** `/en/...` and `/ja/...` with a language switcher, city-based delivery, a cart drawer, and checkout (cash on delivery, bank transfer; JazzCash, Easypaisa and card via a payment link on WhatsApp).
- **Admin:** `/admin`, covering orders, products (EN/JA), categories, cities & delivery, reviews, guides, enquiries, subscribers, site settings and team.
- **Stack:** Next.js 16.4 (App Router, Cache Components), React 19, Tailwind CSS 4, next-intl 4, Drizzle ORM on MySQL 8, Zod, Zustand, Vitest.

Design docs: [competitor audit](docs/research/2026-10-21-wagyu-competitor-audit.md) · [design spec](docs/superpowers/specs/2026-10-21-wagyu-meat-store-design.md) · [plan](docs/superpowers/plans/2026-10-21-wagyu-meat-store.md) · [image sources](docs/image-prompts.md)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run db:push        # create/update tables in MySQL
npm run db:seed        # catalogue, cities, guides, settings and the first admin user
npm run dev            # http://localhost:3000
```

Sign in at `http://localhost:3000/admin` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`, then change the password under **Team**.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm test` | Unit tests (pricing, delivery dates, cart validation, phone numbers, sessions, uploads, shop filters) |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply `src/db/schema.ts` to the database |
| `npm run db:seed` | Seed an empty catalogue (`-- --reset` replaces catalogue/content tables; orders are never touched) |

## Environment

| Variable | Notes |
|---|---|
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | DigitalOcean managed MySQL |
| `DATABASE_CA_CERT` | Path to DigitalOcean's CA certificate (download it from the database's *Connection details*). **Required in production.** |
| `DATABASE_ALLOW_UNVERIFIED_TLS` | Local development only, until the CA certificate is set |
| `AUTH_SECRET` | 32+ random characters; signs admin sessions |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | First admin account created by the seed |
| `SEED_SAMPLE_REVIEWS` | `true` adds clearly-labelled sample reviews for design previews |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, hreflang and the sitemap |
| `UPLOAD_DIR` | Where admin image uploads are stored (default `storage/uploads`) |

## How it fits together

- `src/app/[locale]/…`: storefront pages. Catalogue reads are cached with `"use cache"` and tagged (`catalog`, `reviews`, `cities`, `settings`, `guides`); admin saves call `updateTag(...)`, so the store updates immediately.
- `src/app/admin/…`: admin panel. `src/proxy.ts` redirects signed-out visitors to the login page; every page and server action also calls `requireAdmin()`, which re-checks the account in the database.
- `src/lib/commerce/…`: pure, unit-tested pricing, delivery-date, cart-validation and checkout-schema logic. The server always re-prices the cart from the database at checkout.
- `src/db/…`: Drizzle schema, queries and seed. Translatable text uses paired `_en` / `_ja` columns; empty Japanese falls back to English.
- `messages/en.json`, `messages/ja.json`: interface text.

## Before launch

- [ ] Replace placeholder prices, products and photos with real stock. Customers buying A5 expect to see the actual marbling.
- [ ] Set the WhatsApp number, phone, email and bank details in **Admin → Site settings**.
- [ ] Add the halal certifying body to each product and confirm every halal / authenticity claim in the copy is accurate.
- [ ] Delete the sample reviews (**Admin → Reviews**) and set `SEED_SAMPLE_REVIEWS=false`.
- [ ] Have a native speaker review the Japanese copy.
- [ ] Replace the placeholder privacy, terms and refund pages with reviewed legal text.
- [ ] Set `DATABASE_CA_CERT` and remove `DATABASE_ALLOW_UNVERIFIED_TLS`.
- [ ] Choose hosting. Uploads are written to local disk, which suits a single server (e.g. a DigitalOcean Droplet). For App Platform or several instances, move `src/lib/storage.ts` to DigitalOcean Spaces.
- [ ] Connect real payment gateways (JazzCash / Easypaisa / card) once merchant accounts exist.
