# Wagyu Meat Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (the user asked for no subagents). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (EN/JA) Wagyu Meat storefront for Pakistan, with a custom `/admin` panel, cart and checkout that creates orders in MySQL.

**Architecture:** One Next.js 16 App Router app. The storefront lives in `src/app/[locale]/...` (next-intl); the admin lives in `src/app/admin/...` (English only, cookie-session protected). Both read and write MySQL through Drizzle repositories in `src/db/queries/*`. Pure commerce logic lives in `src/lib/commerce` and is unit-tested.

**Tech Stack:** Next.js 16.4, React 19, TypeScript, Tailwind CSS 4, next-intl 4, Drizzle ORM + mysql2, drizzle-kit, bcryptjs, jose, Zod, Zustand, react-markdown, sharp, Vitest, tsx.

**Spec:** `docs/superpowers/specs/2026-10-21-wagyu-meat-store-design.md`

## Global Constraints

- Brand: "Wagyu Meat"; wordmark "WAGYU MEAT" + 和牛 mark.
- Locales `en` (default), `ja`; storefront routes `/en/...`, `/ja/...`. Admin at `/admin` (not localized).
- Money: integer PKR; display `Rs 12,500` in both locales.
- DB: MySQL 8 over TLS; env `DATABASE_URL` (mysql://…), optional `DATABASE_CA_CERT` (PEM path). Every table has a primary key.
- Translatable columns are `<field>_en` / `<field>_ja`; reads fall back to `_en` when `_ja` is empty or null.
- Tokens and fonts exactly as spec §7.
- Cities: Karachi, Lahore, Islamabad/Rawalpindi. Payment methods: `cod | bank-transfer | jazzcash | easypaisa | card`. Order status: `pending | confirmed | packed | out-for-delivery | delivered | cancelled`. Payment status: `pending | paid | refunded`. Order number `WM-` + 5 digits, starting at 24001.
- Quantity per line 1–20.
- Secrets only in `.env` (git-ignored); `.env.example` has placeholders. No git commits unless the user asks.

## Review Focus

1. Tampered cart (changed price, unknown SKU, qty 0/999): the server recomputes from the DB and rejects. Task 2 `validateCartLines` tests.
2. `/ja` with untranslated fields shows EN, never blanks. Task 3 `pickLocale` test plus a browser check in Task 9.
3. Lead time crossing a delivery day: the day is skipped. Task 2 `nextDeliveryDates` tests.
4. PK phone formats normalize to `+92…`; junk is rejected. Task 2 `pkPhoneSchema` tests.
5. Admin actions called without a session (direct POST to a server action) are rejected. Task 5 `requireAdmin` is called first in every action; test `verifySession` with tampered and expired tokens.

---

### Task 1: Scaffold
**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.env`, `.env.example`, `.gitignore`, `src/i18n/{routing,request,navigation}.ts`, `src/middleware.ts`, `messages/{en,ja}.json`, `src/app/globals.css`, `src/app/[locale]/{layout,page}.tsx`.
- [ ] create-next-app (TS, Tailwind 4, App Router, src dir) into a temp dir and move it in; add deps.
- [ ] Middleware chains next-intl for storefront paths and admin session gating for `/admin/*` (except `/admin/login`).
- [ ] Verify `npm run dev` and that `/en` and `/ja` render.

### Task 2: Commerce logic (TDD)
**Files:** `src/lib/commerce/{pricing,delivery,cart,validation,format}.ts`, tests in `src/lib/commerce/__tests__/`.
**Produces:**
- `pricePerKg(pricePKR, weightGrams): number`
- `deliveryFee(subtotal, city:{deliveryFeePKR; freeDeliveryThresholdPKR}): number`
- `cartTotals(lines:PricedLine[], city|null): {subtotal; delivery; total; remainingForFree}`
- `nextDeliveryDates(now:Date, city:{deliveryDays:number[]; leadTimeHours:number}, count=6): Date[]`
- `validateCartLines(lines:CartLine[], catalog:CatalogVariant[])` → `{ok:true; lines:PricedLine[]} | {ok:false; errors:{sku; reason:'unknown'|'out-of-stock'|'quantity'}[]}`
- `pkPhoneSchema`, `checkoutSchema` (zod)
- `formatPKR(n): string`
- [ ] Tests: `pricePerKg(12500,250)===50000`; threshold 24999→fee 1500, 25000→0; Thu 18:00 with days [2,4,6] and lead 24h → Sat first; Thu 08:00 with lead 6h → Thu; tamper cases; phone `03001234567` / `+923001234567` / `0300-1234567` → `+923001234567`, `12345` rejected; `formatPKR(1250000)==='Rs 1,250,000'`.
- [ ] Red → implement → green (`npx vitest run`).

### Task 3: Database schema, client, queries
**Files:** `drizzle.config.ts`, `src/db/{client,schema}.ts`, `src/db/queries/{products,categories,cities,orders,reviews,guides,settings,users,enquiries}.ts`, `src/lib/i18n-db.ts`.
**Tables:** `admin_users`, `categories`, `products`, `product_variants`, `product_images`, `product_categories` (join), `cities`, `city_slots`, `orders`, `order_items`, `reviews`, `guides`, `site_settings` (single row id=1, JSON `homepage`), `subscribers`, `enquiries`.
**Produces:** `db` (drizzle instance); `pickLocale(row, field, locale)`; `getProducts({origin?, grade?, category?, sort?}, locale)`, `getProductBySlug(slug, locale)`, `getCatalogVariants(skus)`, `getCities()`, `getSettings()`, `createOrder(input)`, `getOrderByNumber(num)`, and the admin CRUD functions.
- [ ] `pickLocale` test: empty `name_ja` returns `name_en`.
- [ ] `npx drizzle-kit push` against MySQL succeeds; tables are visible.

### Task 4: Imagery (Higgsfield)
**Files:** `public/images/*.webp`, `scripts/optimize-images.ts`, `docs/image-prompts.md`.
- [ ] Generate: `hero-a5`, `origin-japan`, `origin-australia`, `p-a5-ribeye`, `p-a5-striploin`, `p-a5-tenderloin`, `p-a5-yakiniku`, `p-a5-shabu`, `p-a5-burger`, `p-au-ribeye`, `p-au-striploin`, `p-au-tenderloin`, `p-au-picanha`, `p-flight-box`, `p-gift-box`, `occ-steak`, `occ-yakiniku`, `occ-shabu`, `occ-gift`, `prov-farm`, `prov-coldchain`, `guide-sear`.
- [ ] Download each and convert to webp at ≤ 400 KB.

### Task 5: Admin auth
**Files:** `src/lib/auth/{session,password,require}.ts`, `src/app/admin/login/{page,actions}.ts(x)`.
**Produces:** `createSession(user)`, `verifySession(token): Promise<Session|null>`, `requireAdmin(role?: 'admin'|'staff'): Promise<Session>` (throws/redirects), `hashPassword`, `verifyPassword`.
- [ ] Tests: valid token verifies; tampered and expired tokens return null.
- [ ] Rate-limit login attempts per IP in memory (5 per 15 min).

### Task 6: Seed
**Files:** `src/db/seed/{index,products,content}.ts`; script `npm run db:seed`.
- [ ] Idempotent seed per spec §9; admin user from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

### Task 7: Design system and storefront shell
**Files:** `src/components/ui/*`, `src/components/layout/*` (AnnouncementBar, Header, MegaMenu, MobileNav, Footer, LanguageSwitcher, CitySelector, WhatsAppButton), `src/store/{cart,city}.ts`.
- [ ] Verify at 375 and 1440 widths; EN↔JA switch keeps the path; city persists.

### Task 8: Storefront pages + checkout
**Files:** `src/app/[locale]/{page, shop/page, shop/[category]/page, products/[slug]/page, cart/page, checkout/{page,actions}, checkout/success/[orderNumber]/page, track/page, wagyu-101/page, guides/page, guides/[slug]/page, gifting/page, halal-provenance/page, delivery/page, faq/page, about/page, contact/page, privacy/page, terms/page, refunds/page, not-found}.tsx`, components in `src/components/{product,cart,home,checkout}/*`.
- [ ] `placeOrder` server action: `checkoutSchema` → `getCatalogVariants` → `validateCartLines` → `cartTotals` → `createOrder` → redirect to success.
- [ ] Verify: an order placed in the browser appears in the DB with correct totals.

### Task 9: Admin panel
**Files:** `src/app/admin/(panel)/{layout,page}.tsx`, `orders/{page,[id]/page,actions}.ts(x)`, `products/{page,new/page,[id]/page,actions}`, `categories`, `cities`, `reviews`, `guides`, `enquiries`, `settings`, `users`; `src/components/admin/*`; `src/lib/storage.ts` (`saveUpload(file): Promise<string>` → `/uploads/...`).
- [ ] Verify: log in, edit a product's JA name and see it on `/ja`, change order status, approve a review.

### Task 10: SEO + final verification
**Files:** `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo.ts`.
- [ ] `npx tsc --noEmit`, `npx vitest run`, `npm run build`: all pass. Browser pass on both locales, mobile and desktop.
