# Pharmadent Remedies — website & admin

A glassmorphic, SEO-first pharmaceutical catalogue website with an **inquiry-based commerce flow** ("Add to inquiry list" → "Inquire now", no checkout) and a full **admin panel** for categories, sub-categories, products, per-page SEO, countries, licenses, facilities and inquiries.

Built with **Next.js 16** (App Router, React 19, Turbopack), **Payload CMS 3** (self-hosted admin at `/admin`), **Tailwind CSS v4**, SQLite (default) or Postgres.

---

## Quick start

```bash
pnpm install
cp .env.example .env        # edit PAYLOAD_SECRET and NEXT_PUBLIC_SERVER_URL
pnpm seed                   # demo content + admin user (admin@example.com / ChangeMe123!)
pnpm dev                    # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

Production:

```bash
pnpm build && pnpm start
```

| Script | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev server / production build / production server |
| `pnpm seed` | Seeds demo data when the catalogue is empty. `pnpm seed -- --fresh` wipes content and reseeds. |
| `pnpm typecheck` / `pnpm lint` | TypeScript and ESLint |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `pnpm generate:importmap` | Regenerate the admin import map after adding admin components |
| `pnpm map:generate` | Regenerate the dotted world-map SVG |
| `pnpm test:e2e` | Playwright smoke tests against `pnpm start` |
| `node scripts/qa-screenshots.mjs [baseUrl] [outDir]` | Full-page desktop + mobile screenshots of every key route (visual QA; set `CHROMIUM_PATH` to reuse an installed Chromium) |

## Environment variables

See `.env.example`.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | yes | Public site URL (no trailing slash). Used for canonical URLs, sitemap, Open Graph and structured data. |
| `PAYLOAD_SECRET` | yes | Long random string – signs admin sessions. |
| `DATABASE_URL` | yes | `file:./data/pharma.db` (SQLite) or `postgres://…` (Neon, Supabase, RDS…). The adapter is chosen automatically. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME` | no | When set, new inquiries are emailed to *Site Settings → Contact → Inquiry email*. Without SMTP, emails are logged to the console. |
| `BLOB_READ_WRITE_TOKEN` | no | Store uploads in Vercel Blob (required on Vercel, whose filesystem is read-only). |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | no | Credentials for the first admin created by `pnpm seed`. |

## Using the admin panel (`/admin`)

**Catalogue → Categories.** Create a category, then create sub-categories by picking a *Parent*. Each category has: title, slug, short description (cards + default meta description), rich description (shown under the product grid), image, icon, highlights, FAQs and its own **SEO tab** (title, description, image, keywords, canonical, no-index). URLs are hierarchical: `/categories/antibiotics-anti-infectives/cephalosporins`.

**Catalogue → Products.** Title (brand name), generic name, one or more categories (a product assigned to a sub-category also appears in the parent), images, *Details* (dosage form, strength, Rx/OTC, route, pack size, packaging, shelf life, storage, composition, therapeutic class, specifications), *Description* (rich text description, indications, key benefits, FAQs, related products), *Pricing & stock* and the **SEO tab**. Products use drafts – click **Publish** to make them public.

**Pricing.** The site launches in inquiry mode: every product shows *"Inquire for pricing"* and an *"Add to inquiry list"* button. Enter prices whenever you like – they stay hidden until **Site Settings → Commerce → Show prices** is switched on (or a single product is set to *Always show price*). Labels ("Inquiry list", "Add to inquiry list", "Inquire now", "Inquire for pricing") and currency are editable there too.

**Sales → Inquiries.** Every quote request (inquiry list, product page and contact form) is stored here with the requested products and quantities, and emailed when SMTP is configured. Track status (new → contacted → quoted → won/closed) and add internal notes.

**Pages.** Home, Products, About, Quality, Manufacturing, Global presence, Licenses, Contact and Inquiry pages are globals: hero, intro, stats, feature cards, process steps, free-form sections, FAQs and an SEO tab each.

**Content → Countries.** One document per export market = one landing page at `/global-presence/<country>` ("Pharmaceutical supplier & exporter to X") with regulator, summary, rich description, highlights, popular categories/products, FAQs, map pin (lat/lng) and SEO. Countries also feed the home-page world map and the Organization `areaServed` structured data.

**Content → Licenses & Certifications / Facilities.** Power the Licenses and Manufacturing pages (and the trust strip in the footer).

**Site Settings.** Company details, contact info (used in the footer, contact page and structured data), commerce mode, SEO defaults (title template, default description/image, verification codes, GA4 id, `sameAs` profiles, `knowsAbout` topics).

Content changes are published instantly: pages are statically generated and revalidated on demand by Payload hooks.

**Spam protection.** The inquiry action has a honeypot field and a per-IP throttle (5 submissions per 10 minutes, in-memory). On serverless or multi-instance hosting add a shared limiter (e.g. Upstash Ratelimit) or a CAPTCHA (Turnstile/hCaptcha) in `src/app/actions/inquiry.ts`.

## SEO & AI-search (LLM) optimisation

- **Per-entity SEO** – every category, sub-category, product, country and page has title / description / OG image / keywords / canonical / no-index.
- **Metadata** – canonical URLs, Open Graph + Twitter cards, `hreflang` (`x-default`, `en`), robots directives with `max-image-preview:large`, dynamic OG images (`/og?title=…` and per-product `opengraph-image`).
- **Structured data (JSON-LD)** – `Organization`+`MedicalOrganization` (with `areaServed` countries, `hasCredential` certifications, `contactPoint`, `sameAs`), `WebSite` with `SearchAction`, `BreadcrumbList` on every page, `Product`+`Drug` (active ingredient, dosage form, route, prescription status, offers) on product pages, `CollectionPage`+`ItemList` on category pages, `FAQPage` wherever FAQs exist, `Service` on country pages, `AboutPage`/`ContactPage`.
- **`/sitemap.xml`** (products with image sitemaps, categories, countries, pages) and **`/robots.txt`** that explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …).
- **`/llms.txt`** and **`/llms-full.txt`** – machine-readable summaries of the company, catalogue, markets and FAQs following the llms.txt convention, so ChatGPT, Claude, Gemini, Perplexity and future assistants can cite the site accurately.
- **Content structure that LLMs and Google reward** – one `h1` with the primary keyword, a factual summary paragraph, key-facts definition lists/tables, FAQs, deep internal linking (categories ⇄ products ⇄ countries), and a **country landing page for every market** for "pharmaceutical supplier in <country>" queries.
- **Speed** – static generation + ISR, React Server Components (almost no client JS), AVIF/WebP images with pre-generated sizes, self-hosted fonts, CSS-only animations, immutable caching for media, security headers.

Add real content for every entity (unique descriptions, FAQs, imagery) – the seed copy is a starting point.

## Deployment

### Vercel (recommended for serverless)

1. Create a Postgres database (Neon / Supabase / Vercel Postgres) → set `DATABASE_URL=postgres://…`.
2. Create a Vercel Blob store → set `BLOB_READ_WRITE_TOKEN` (uploads cannot live on Vercel's filesystem).
3. Set `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL=https://your-domain.com`, optional SMTP vars.
4. Deploy (`pnpm build` runs automatically). Run `pnpm seed` once locally against the production `DATABASE_URL` if you want the demo content, or create the first admin at `/admin`.
5. For Postgres in production use migrations: `pnpm payload migrate:create` locally after schema changes, commit the migration, and run `pnpm payload migrate` in your build step.

### Docker / VPS (single server, SQLite)

```bash
cp .env.example .env    # set PAYLOAD_SECRET and NEXT_PUBLIC_SERVER_URL
docker compose up -d --build
```

The database (`/app/data`) and uploads (`/app/media`) are persisted in named volumes. Put a reverse proxy (Caddy / nginx) with HTTPS in front of port 3000.

## Going e-commerce later

Everything is prepared so that enabling checkout is additive, not a rewrite:

- Products already carry `price`, `compareAtPrice`, `priceUnit`, `sku`, `stock`, `minOrderQuantity`, `availability` and a per-product price visibility override.
- The inquiry list (`src/store/inquiry.ts`) is a cart: line items with product id, slug, quantity. `AddToInquiryButton`, `InquiryDrawer` and `PriceTag` read their labels from `getCommerceLabels()`.
- Flip **Site Settings → Commerce → Mode = E-commerce** and **Show prices**: buttons become "Add to cart" / "Checkout" and prices appear.
- Then add a `/checkout` route (or install `@payloadcms/plugin-ecommerce` for carts, orders and Stripe) – the catalogue, category pages, product pages and admin need no changes.

## Project structure

```
src/
  app/(frontend)/        public site (pages, sitemap, robots, llms.txt, og image)
  app/(payload)/         admin UI + REST/GraphQL API (generated by Payload)
  app/actions/           server actions (inquiry submission)
  collections/           Products, Categories, Inquiries, Countries, Certifications, Facilities, Media, Users
  globals/               Site Settings, Home page and per-page content globals
  fields/                reusable field groups (SEO tab, FAQs, hero, sections, icons)
  components/            UI primitives, layout, catalog, inquiry, forms, visuals, per-page components
  lib/                   data access (cached queries), SEO/JSON-LD builders, commerce helpers, utils
  seed/                  demo content and placeholder image generation
  store/                 zustand inquiry-list store
docs/frontend-guide.md   design system + conventions for building pages
```

## Notes on the seed content

The seeded company profile, addresses, certificates (marked *SAMPLE*), people and products are **placeholders** for demonstration. Replace them with your real details, artwork and certificate scans from the admin panel before going live.
