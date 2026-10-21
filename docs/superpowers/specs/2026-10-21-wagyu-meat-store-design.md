# Wagyu Meat — E-commerce Store Design

Date: 2026-10-21
Status: approved 2026-10-21; implemented (custom admin on MySQL replaced Payload, see §2)
Research input: [docs/research/2026-10-21-wagyu-competitor-audit.md](../../research/2026-10-21-wagyu-competitor-audit.md)

## 1. Intent

**What the user asked for**
- A new e-commerce website, **"Wagyu Meat"**, selling wagyu beef, launching in **Pakistan** (first of its kind there).
- Bilingual **English and Japanese** with a language switcher.
- Built in **Next.js**, with an **admin panel**.
- Layout inspired by buykatori.com, but not a copy.
- Built on research into the top 10 wagyu stores: what customers expect to see.
- Images generated with **Higgsfield**.
- Range: **Japanese A5 + Australian wagyu**.
- Admin stack: **custom admin panel** at `/admin` on the user's DigitalOcean MySQL database (Payload CMS was chosen first, then dropped because it does not support MySQL).

**Assumptions (to be corrected by the user)**
- All beef sold is halal-certified; halal proof is shown on every beef product.
- Launch cities: Karachi, Lahore, Islamabad/Rawalpindi (admin-editable).
- Prices are placeholders in PKR until real pricing is supplied.
- Frozen, cold-chain home delivery on scheduled days and slots.

**Success criteria**
- A shopper can browse by origin/grade, cut and occasion, read provenance and halal info, add to cart, and place an order with a city, delivery slot and payment method, in English or Japanese, on phone or desktop.
- Staff can log in at `/admin` and manage products (EN/JA fields), images, cities, delivery fees, orders and order status, reviews, guides and site settings, with no code changes.
- `next build` succeeds; key pages are verified in a browser at mobile and desktop widths.

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, React Server Components), TypeScript |
| Admin | **Custom admin panel** at `/admin`, built in the same Next.js app (server components + server actions). Payload CMS was dropped (2026-10-21) because it has no MySQL support. |
| Database | DigitalOcean Managed **MySQL 8** (SSL required), accessed with **Drizzle ORM** + `mysql2`; schema applied with `drizzle-kit push`. Every table has a primary key (DO enforces `sql_require_primary_key`). |
| Admin auth | `admin_users` table, passwords hashed with `bcryptjs`, session = signed JWT (`jose`) in an httpOnly, secure, sameSite=lax cookie (7 days). Route protection in `src/middleware.ts` + a `requireAdmin(role?)` check inside every admin server action. |
| Storefront i18n | `next-intl` 4 with locale-prefixed routes `/en/...` and `/ja/...`; `/` redirects by `Accept-Language`, default `en` |
| Content i18n | Paired columns per translatable field (`name_en`, `name_ja`, …); reading code falls back to EN when the JA value is empty |
| Uploads | Admin image uploads go through a `Storage` interface; v1 writes to `public/uploads/` on local disk, with a DigitalOcean Spaces (S3) implementation later for production |
| Styling | Tailwind CSS 4 with design tokens as CSS variables |
| Cart state | Zustand, persisted to `localStorage` (guarded with try/catch) |
| Forms / validation | Zod, shared by client and server action |
| Images | Higgsfield-generated images in `public/images/`; admin uploads stored by `src/lib/storage.ts`; served via `next/image` |
| Tests | Vitest for pricing/cart/checkout logic; browser verification of pages |

Package manager: npm (pnpm is not installed).

## 3. Information architecture

### Storefront routes (all under `/[locale]`)
- `/` Home
- `/shop`: all products, with filters for origin (Japanese / Australian), grade (A5, A4, BMS 6–7, 8–9), cut, occasion; sort by featured / price / BMS
- `/shop/[category]`: pre-filtered landing (e.g. `japanese-a5`, `australian-wagyu`, `yakiniku`, `gifts`)
- `/products/[slug]`: product detail page
- `/cart`: full cart (the drawer is the main surface)
- `/checkout` and `/checkout/success/[orderNumber]`
- `/track`: order status lookup by order number + phone
- `/wagyu-101`: grading (A–C yield, 1–5 quality, BMS 1–12 interactive scale), Japanese vs Australian comparison table, interactive cut map linking to products
- `/guides` and `/guides/[slug]`: cooking guides and recipes (sear A5, yakiniku, shabu-shabu, thawing and storage)
- `/gifting`: gift boxes, gift cards (as products), corporate enquiry form
- `/halal-provenance`: halal certification, authenticity certificates, origin and import chain
- `/delivery`: cities, days, slots, fees, cold-chain packaging, perishables policy
- `/faq`, `/about`, `/contact`
- Legal: `/privacy`, `/terms`, `/refunds`

### Header
- Announcement bar (admin-editable): e.g. "Free cold-chain delivery over Rs 25,000 · Karachi · Lahore · Islamabad".
- Logo; nav: Shop (mega menu by Origin / Cut / Occasion), Wagyu 101, Guides, Gifting.
- City selector (persists choice; drives delivery messaging), language switcher (EN / 日本語), search, cart button with count.
- Mobile: hamburger drawer, logo, search, cart.

### Footer
- Shop links, help links, WhatsApp, phone, email, social, halal badge, payment-method marks, and a newsletter field (stored in the `subscribers` table).

## 4. Page designs

### Home (section order)
1. **Hero (split)**: eyebrow ("HALAL JAPANESE A5 · NOW IN PAKISTAN"), serif headline, 3 check-mark proofs (Certified halal · Certificate of authenticity · Cold-chain delivery), rating line, primary CTA "Shop wagyu", secondary "What is A5?", hero image.
2. **Trust strip**: halal certified, BMS graded, frozen at peak, delivered in insulated packaging.
3. **Shop by origin**: two large tiles, Japanese A5 vs Australian wagyu, each with a "from Rs" price.
4. **Best sellers**: product cards.
5. **Marbling explainer**: interactive BMS 1–12 scale with grade labels and a link to Wagyu 101.
6. **Shop by occasion**: Steak night, Yakiniku/BBQ, Shabu-shabu, Burgers, Gifting.
7. **Comparison table** (Katori-style): Japanese A5 vs Australian wagyu vs regular beef. Marbling, flavour, portion size, best for, price band.
8. **Provenance story**: farm-to-door steps (Japan/Australia farm, halal processing, import and certification, cold-chain delivery).
9. **Tasting flight / gift box** feature with package-tier pricing.
10. **Cooking guides**: three cards.
11. **Reviews**: three cards with rating summary.
12. **FAQ** accordion (6–8 questions).
13. **Final CTA panel** with WhatsApp concierge.
- Floating WhatsApp button, placed so it never covers a CTA or the mobile sticky bar.

### Shop
- Left filter rail on desktop; bottom-sheet filters on mobile.
- Cards show: image, origin flag/label, grade + BMS badge, name, weight, price, price per kg, quick add.
- Empty state with "clear filters".

### Product page
- Gallery with thumbnails.
- Badge row: grade, BMS, prefecture/region, Halal, "Certificate included".
- Title, short description, rating summary.
- Weight variant cards (e.g. 200 g / 300 g / 500 g), each with price per piece and per kg; out-of-stock shown disabled.
- Quantity stepper; Add to cart; "Order on WhatsApp" secondary action.
- Delivery estimate for the selected city ("Next delivery to Lahore: Thursday, 4–8 pm") and the free-delivery threshold.
- Storage status: "Frozen. Thaw 24 h in the fridge."
- Accordions: Description · Provenance & halal · How to cook (portion guidance: A5 80–120 g per person) · Storage & thawing · Delivery & returns.
- Related products and related guides; reviews list with distribution.
- Mobile sticky bar: name, price, selected weight, Add to cart.

### Cart drawer
- Line items with weight, quantity stepper and remove.
- Free-delivery progress bar for the selected city; subtotal; delivery fee; total; checkout CTA.

### Checkout (single page, guest)
1. Contact: name, phone (Pakistan format validated), email (optional).
2. Delivery: city (from active cities), address, area, delivery date + slot (from the city's schedule), notes.
3. Payment method:
   - Cash on delivery
   - Bank transfer (shows account details from settings after order)
   - JazzCash / Easypaisa / Card: in v1 these record the choice and show "We'll send a secure payment link on WhatsApp"; gateway integration is a later phase.
4. Gift option: gift message, "hide prices on invoice".
5. Order summary with server-recalculated totals.
- Submit runs a server action that validates with Zod, recomputes prices from the DB, creates an `orders` record, and redirects to the success page with order number, summary and a prefilled WhatsApp confirmation link.

## 5. Data model (MySQL via Drizzle)

The entities below map to MySQL tables. Every human-readable text field becomes a pair of columns `<field>_en` / `<field>_ja`. Arrays (variants, order items, slots, gallery) are child tables, except short lists (delivery days, occasion links), which use JSON columns or join tables as noted in the plan. Rich text is stored as Markdown and rendered with `react-markdown` (no raw HTML).

### Admin panel (`/admin`)
- `/admin/login`: email + password.
- Dashboard: today's orders, pending orders, 7-day revenue, low-stock variants.
- Orders: list filtered by status/city/date; detail view with items, customer, delivery; update status and payment status; WhatsApp link to the customer.
- Products: list, create, edit. EN/JA tabs for text, variants editor, image upload and reorder, badges and flags, publish toggle.
- Categories, Cities (fees, thresholds, days, slots), Reviews (approve/hide), Guides (EN/JA Markdown), Enquiries and Subscribers (read-only lists, CSV export), Settings (site settings + homepage content), Users (admin only: invite staff, reset password).
- The admin UI uses the same design tokens, in a denser layout. Not translated in v1: the admin is English only, but edits content in both languages.

- **users**: admin auth. `role`: `admin` | `staff`. Staff can manage orders and reviews; admins can do everything.
- **media**: uploads, `alt` (localized).
- **products**
  - `title`, `slug` (unique, not localized), `shortDescription`, `description` (rich text)
  - `origin`: `japan` | `australia`; `grade`: `A5` | `A4` | `MB6-7` | `MB8-9` | `n/a`; `bms` (number 1–12); `region` (e.g. Kagoshima, Miyazaki, Margaret River); `brand`
  - `cut` (relationship to `categories` of type `cut`); `occasions` (relationship, many, type `occasion`)
  - `productType`: `steak` | `sliced` | `burger` | `bundle` | `gift-card`
  - `variants[]`: `label` (localized), `weightGrams`, `pricePKR`, `compareAtPKR?`, `inStock` (bool), `sku`
  - `storage`: `frozen` | `chilled`; `halalCertified` (bool) + `halalCertificate` (upload); `authenticityCertificate` (bool)
  - `gallery[]` (uploads); `cookingNotes`, `storageNotes` (rich text); `servingSuggestion`
  - `bundleContents[]` (for bundles): product ref + quantity
  - `featured`, `bestSeller` (bool); `relatedGuides` (relationship)
  - `seo` group: `metaTitle`, `metaDescription`
- **categories**: `title`, `slug`, `type`: `origin` | `cut` | `occasion`, `image`, `description`, `order`.
- **cities**: `name`, `slug`, `active`, `deliveryFeePKR`, `freeDeliveryThresholdPKR`, `deliveryDays[]` (weekday), `slots[]` (label, e.g. "12–4 pm"), `leadTimeHours`.
- **orders**: `orderNumber` (e.g. `WM-24001`, generated), `customer` group (name, phone, email), `delivery` group (city ref, address, area, date, slot, notes), `items[]` snapshot (product ref, title, variant label, weightGrams, unitPricePKR, quantity, lineTotalPKR), `subtotalPKR`, `deliveryFeePKR`, `totalPKR`, `paymentMethod`, `paymentStatus` (`pending` | `paid` | `refunded`), `status` (`pending` | `confirmed` | `packed` | `out-for-delivery` | `delivered` | `cancelled`), `gift` group, `locale`. Public create only via the server action; read/update for staff/admin. Admin list columns: order number, customer, city, date, total, status.
- **reviews**: `product`, `name`, `city`, `rating` (1–5), `body`, `verified`, `approved` (only approved reviews are shown).
- **guides**: `title`, `slug`, `excerpt`, `heroImage`, `content` (rich text), `readingMinutes`, `type`: `guide` | `recipe`, `relatedProducts`.
- **subscribers**: `email`, `locale`.
- **enquiries**: corporate/gifting and contact form submissions.
- **Global `site-settings`**: announcement text, WhatsApp number, phone, email, social links, bank-transfer details, default free-delivery threshold.
- **Global `homepage`**: hero eyebrow, headline, subheading, image, CTA labels; featured product picks; FAQ items.

Access: public read for products, categories, cities (active), guides, approved reviews, media and globals; everything else is restricted to authenticated users.

## 6. Pricing and cart logic

- All money is integer PKR.
- `pricePerKg = round(pricePKR / weightGrams * 1000)`.
- Delivery fee = 0 when subtotal ≥ the city's free threshold, otherwise the city's `deliveryFeePKR`.
- The cart stores `{productId, variantSku, quantity}` only; display data is fetched/merged. The server recomputes every line from the DB at checkout and rejects out-of-stock or unknown SKUs with a clear message.
- Quantity limits: 1–20 per line.
- Delivery date options: the city's next N delivery days after `leadTimeHours`.
- These functions live in `src/lib/commerce/` and are unit-tested (Vitest) before UI work.

## 7. Visual design system

The direction is Katori's editorial clarity, made warmer and more Japanese, without copying its layout.

- **Colour tokens**
  - `--paper #F7F3EC`, `--paper-2 #EFE8DC`
  - `--ink #191512`, `--ink-2 #5A5048`
  - `--line #E3DACB`
  - `--wagyu #8E1F1A` (primary actions, accents), `--wagyu-ink #6E1712`
  - `--gold #A8834A` (grade badges, fine rules)
  - `--sumi #1A1613` (one dark band per page: provenance / final CTA)
- **Type**
  - EN headings: **Cormorant Garamond** 600/700, tight leading; body: **Inter**.
  - JA headings: **Shippori Mincho** 600/700; body: **Noto Sans JP**.
  - Eyebrow labels: Inter 12px, uppercase, tracking 0.14em, `--wagyu`.
- **Motifs**: thin gold hairlines, a subtle seigaiha (wave) pattern in dark bands, BMS marbling bar as a recurring element. Generous whitespace; 8px spacing grid; radius 4–10px.
- **Components**: Button (primary/secondary/ghost/WhatsApp), Badge (grade/BMS/halal/origin), ProductCard, VariantCard, Accordion, Drawer, BottomSheet, Stepper, Rating, ComparisonTable, BmsScale, CutMap (inline SVG), SectionHeader (eyebrow + title + lede), StickyBuyBar, CitySelector, LanguageSwitcher.
- **Accessibility**: WCAG AA contrast, visible focus rings, 44px touch targets, keyboard-navigable drawers/menus, `lang` attribute per locale, reduced-motion support.
- **Responsiveness**: designed at 375px first, then 768 and 1280+; 16px side gutters on mobile; no horizontal scroll.

## 8. Imagery (Higgsfield)

About 20 images, photoreal, dark slate/washi/wood surfaces, warm low-key light, consistent style:
- Hero: A5 striploin on a dark ceramic plate with binchotan glow.
- Origin tiles: Japanese A5 slab; Australian wagyu ribeye.
- Products (~12): A5 ribeye, A5 striploin, A5 tenderloin, A5 yakiniku slices, A5 shabu-shabu slices, A5 burger patties, Australian MB8-9 ribeye, Australian MB6-7 striploin, Australian tenderloin, Australian picanha, tasting flight box, gift box.
- Occasion tiles: steak night, yakiniku grill, shabu-shabu hot pot, gifting.
- Provenance: Japanese farm landscape; insulated cold-chain box with dry ice.
- Guides: searing in cast iron; yakiniku on a tabletop grill.
Images are saved to `public/images/` and referenced by the seed script; admin uploads go to `storage/uploads/`. Prompts avoid text and logos.

## 9. Seed data

`npm run seed` creates the admin user (credentials read from `.env`, never committed), categories, the 3 cities with slots, ~14 products with EN/JA copy and variants, 3 guides, ~12 approved reviews, site settings and homepage content. Japanese copy is natural, not machine-literal; the user should have it reviewed by a native speaker before launch.

## 10. SEO and performance

- Per-locale `generateMetadata`, `alternates.languages` (hreflang en/ja/x-default), canonical URLs.
- JSON-LD: `Product` with offers (PKR), `BreadcrumbList`, `Organization`, `FAQPage`.
- `sitemap.ts` and `robots.ts`.
- `next/image` with sizes; fonts via `next/font`; storefront pages statically rendered; admin server actions call `updateTag` on the matching cache tag so changes appear immediately.

## 11. Error handling

- Checkout: field-level Zod errors in the user's language; server-side price mismatch or stock errors return a message and refresh the cart.
- Missing translation: database text falls back to the `_en` column; next-intl message fallback to EN.
- 404 and error pages per locale.
- Cart storage unavailable: the cart works in memory for the session.

## 12. Testing and verification

- Vitest unit tests for `src/lib/commerce` (price per kg, totals, delivery fee threshold, delivery-date computation, cart validation).
- `tsc --noEmit`, `next lint`, `next build`.
- Browser check of home, shop with filters, product page, cart, checkout → order created → visible in `/admin`, both locales, at 375px and 1440px.

## 13. Out of scope for v1

- Live payment gateway integration (JazzCash/Easypaisa/card APIs): needs merchant accounts.
- Customer accounts and login, subscriptions, loyalty points, multi-currency, live stock per city, SMS notifications, email transactional templates (added later).

## 14. Open items for the user

- Database: received (DigitalOcean MySQL, stored only in `.env`). DigitalOcean's CA certificate is needed for verified TLS (`DATABASE_CA_CERT`).
- Hosting target (DigitalOcean App Platform / Droplet / Vercel). This decides where uploaded images live (local disk only works on a single server).
- Real prices, product list, halal certificate files, bank details, WhatsApp number, delivery fees and slots.
- Domain, logo (v1 uses a typographic wordmark "WAGYU MEAT" with a 和牛 mark).
