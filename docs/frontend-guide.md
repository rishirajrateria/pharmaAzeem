# Frontend guide — Pharmadent Remedies "Glass & Crimson"

This document is the contract for building pages in this project. Read it fully before writing code.

## Stack

- **Next.js 16 (App Router, React 19, Turbopack)** – frontend lives in `src/app/(frontend)/`.
- **Payload CMS 3** – admin at `/admin`, config in `src/payload.config.ts`, collections in `src/collections`, globals in `src/globals`. Generated types: `src/payload-types.ts` (`Product`, `Category`, `Country`, `Certification`, `Facility`, `SiteSetting`, `Homepage`, `AboutPage`, `QualityPage`, `ManufacturingPage`, `GlobalPresencePage`, `LicensesPage`, `ContactPage`, `ProductsPage`, `InquiryPage`).
- **Tailwind CSS v4** – tokens and utilities in `src/app/(frontend)/globals.css` (CSS-first config; no tailwind.config file).
- **Fonts** – Geist Sans (`font-sans`) and Geist Mono (`font-mono`), already loaded in the root layout.
- **Icons** – `lucide-react` (named imports) or `<Icon name="…" />` for CMS-driven icon names.
- **State** – `zustand` store for the inquiry list (`src/store/inquiry.ts`).
- Package manager: `pnpm`.

## Rendering & data rules

- Pages are **React Server Components** by default. Only add `'use client'` to small leaf components that need interactivity (filters UI, forms, tabs). Keep client JS minimal – this site must be very fast.
- Fetch data with the functions in `src/lib/data.ts` (all wrapped in React `cache`). Never call `getPayload` directly in a page.
- Static pages export `export const revalidate = 3600` (ISR). Payload hooks revalidate paths on content changes.
- Dynamic routes export `generateStaticParams` (prebuild every published item) and `export const dynamicParams = true`.
- Pages that read `searchParams` (product listing filters) are dynamic; that is expected – keep their queries lean.
- `params` and `searchParams` are **Promises** in Next 16: `const { slug } = await params`.
- Use `notFound()` from `next/navigation` when a document does not exist.
- Rich text from the CMS: `<RichText data={doc.description} />` (`src/components/RichText.tsx`).
- Images from the CMS: `<Media media={doc.image} size="large|card|thumbnail|og" fill? sizes="…" priority? />` (`src/components/Media.tsx`). Always give `sizes`. Use `priority` only for the single above-the-fold hero image. `MediaPlaceholder` renders when no image exists.
- Relationships may be numbers or populated objects depending on depth – guard with `typeof x === 'object'`. `relId(x)` returns the id either way.

## Design language ("Glass & Crimson")

Positive, clean, futuristic pharma. White base with soft red/pink gradient light, glass panels, thin hairlines, mono uppercase eyebrow labels, big tight display headings, red gradient accents. Lots of visual texture but light on JS.

Utilities (see `globals.css`):

| Purpose | Utility |
| --- | --- |
| Page container | `container-x` (max-w-7xl + gutters) — or `<Container>` |
| Vertical rhythm | `section-y` — or `<Section>` |
| Glass panels | `glass`, `glass-strong`, `glass-subtle`, `glass-red`, `glass-dark`, `glass-card` (hover lift), `glass-edge` |
| Gradients | `bg-brand-gradient`, `bg-brand-gradient-animated`, `text-gradient`, `text-gradient-ink`, `mesh-bg` (already on body), `mesh-bg-dark` |
| Patterns | `grid-pattern`, `dots-pattern`, `noise`, `fade-mask-y`, `fade-mask-x`, `hairline` |
| Fancy border | `gradient-border` (animated conic border) |
| Buttons | `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-dark` — or `<Button variant href>` |
| Labels | `eyebrow`, `chip` — or `<Eyebrow>`, `<Chip>`, `<Badge tone>` |
| Type scale | `display-1`, `display-2`, `heading-2`, `heading-3`, `lead` |
| Forms | `input-glass` |
| Motion | `animate-float`, `animate-float-slow`, `animate-pulse-ring`, `animate-spin-slow`, `animate-marquee`, `animate-fade-up`, `reveal` (+ `<Reveal delay>`) |
| Colours | `brand-50…950` (red), `ink-50…950` (neutral), `surface`, `surface-2` |
| Shadows | `shadow-glass`, `shadow-glass-lg`, `shadow-glow`, `shadow-soft` |
| Rich text | `prose-pharma` (applied by `<RichText>`) |

Rules of thumb:
- Every page starts with a hero: `<Orbs />` behind, eyebrow, `h1.display-2` (or `display-1` on home), lead paragraph, optional CTA buttons, optional hero image inside a glass frame (rounded-3xl, `glass`, slight rotate/float).
- Sections alternate rhythm: full-width glass panels, 2–4 column glass card grids, split image/text (`grid lg:grid-cols-2`), dark CTA band (`mesh-bg-dark` + `glass-dark` card + `text-white`).
- Use `<SectionHeading eyebrow title description />` for section intros.
- Wrap grids of cards in `<Reveal>` with staggered `delay={i * 60}` for entrance animation.
- Decorative: `<MoleculeField />`, `<HudRings />`, `<Orbs variant="intense" />`, `dots-pattern` overlays, `hairline` dividers, floating glass "stat chips".
- Mobile first. Everything must work at 360 px wide; test breakpoints in your head: `sm`, `md`, `lg`, `xl`.
- Headings: exactly one `h1` per page; sections use `h2`; cards use `h3`. Use `aria-labelledby` on sections where sensible.
- Use `text-wrap: balance` (already on headings) and keep copy readable (max-w-3xl for paragraphs).
- Never use inline `style` for colours; use tokens. Never import `motion`/framer or other animation libraries – CSS only.

## Shared components (`src/components`)

- `ui/index.tsx`: `Container`, `Section`, `Eyebrow`, `SectionHeading`, `GlassCard`, `Button`, `Chip`, `Badge`, `Hairline`, `Kbd`.
- `ui/Reveal.tsx`: `<Reveal delay as className>` scroll reveal (client).
- `ui/Icon.tsx`: `<Icon name={string} className />` for CMS icon names.
- `visuals/Orbs.tsx` (`<Orbs variant="default|intense|subtle" />`), `visuals/MoleculeField.tsx` (`MoleculeField`, `HudRings`), `visuals/WorldMap.tsx` (`<WorldMap pins={[{name,lat,lng,href,featured}]} showLabels />`, `projectPin`).
- `Media.tsx`, `RichText.tsx`, `Breadcrumbs.tsx` (`<Breadcrumbs crumbs={[{name,path}]} />` – emits BreadcrumbList JSON-LD, do not add Home), `FaqAccordion.tsx` (`<FaqAccordion faqs />` – emits FAQPage JSON-LD), `Stats.tsx` (`<Stats stats variant />` count-up).
- `seo/JsonLd.tsx`: `<JsonLd data={graph(...)} />`.
- `catalog/ProductCard.tsx` (`<ProductCard product labels priority />`, `toInquiryItem`), `catalog/CategoryCard.tsx`, `catalog/PriceTag.tsx`.
- `inquiry/AddToInquiryButton.tsx` (`<AddToInquiryButton product={toInquiryItem(p)} label addedLabel variant="full|icon" quantity />`), `inquiry/InquiryDrawer.tsx`, `inquiry/InquiryTrigger.tsx`.
- `forms/InquiryForm.tsx` (`<InquiryForm source includeList product successMessage submitLabel compact />` – server action already wired).
- `layout/*`: Header, Footer, Logo (already in the root layout – do not render again).

## Library (`src/lib`)

- `data.ts`: `getSiteSettings()`, `getHomepage()`, `getPageGlobal(slug)`, `getAllCategories()`, `getCategoryTree()` (→ `CategoryNode` with `children`, `productCount`), `getCategoryByPath(path)`, `getCategoryBySlug`, `getCategoryDescendantIds(id)`, `getCategoryAncestors(cat)`, `getChildCategories(id|null)`, `getProducts({categoryIds,dosageForm[],prescriptionStatus[],route[],badges[],q,sort,page,limit,featured})` → paginated result `{docs,totalDocs,totalPages,page,hasNextPage…}`, `getProductBySlug(slug)`, `getFeaturedProducts(n)`, `getRelatedProducts(product,n)`, `getAllProductsSlim()`, `getProductFacets(categoryIds?)` → `{dosageForm,prescriptionStatus,route,badges}` with counts, `getCountries({served,featured})`, `getCountryBySlug`, `getCertifications({featured})`, `getFacilities()`, `getLayoutData()`.
- `seo.ts`: `buildMetadata({settings,path,title,description,image,meta,type,absoluteTitle,modifiedTime})` → Next `Metadata` (canonical, OG, Twitter, robots, hreflang). JSON-LD builders: `organizationJsonLd`, `websiteJsonLd` (both already in the root layout – don't repeat), `webPageJsonLd({path,name,description,type,image,dateModified})`, `breadcrumbJsonLd`, `faqJsonLd`, `productJsonLd(product,settings)`, `itemListJsonLd(items,name)`, `categoryJsonLd(category,products)`, `countryServiceJsonLd(country,settings)`, `graph(...nodes)`.
- `commerce.ts`: `getCommerceLabels(settings)` → `{mode,showPrices,currency,priceFallbackLabel,listName,addLabel,addedLabel,ctaLabel}`, `resolvePrice(product,labels)` → `{kind:'inquire'|'price',…}`, `formatPrice`.
- `utils.ts`: `cn`, `SITE_URL`, `absUrl`, `mediaUrl(media,size)`, `mediaAlt`, `mediaDims`, `truncate`, `richTextToPlain`, `formatDate`, `slugify`, `relId`.

## SEO / LLM checklist (every page)

1. `export async function generateMetadata()` using `buildMetadata` with the page's `meta` group (`doc.meta`) and sensible fallbacks. Product pages pass the first product image; others pass the hero image.
2. `<JsonLd data={graph(webPageJsonLd({...}), faqJsonLd(doc.faqs), …)} />` – add `productJsonLd` on product pages, `categoryJsonLd` on category pages, `countryServiceJsonLd` on country pages, `itemListJsonLd` on listings. (`Breadcrumbs` and `FaqAccordion` emit their own JSON-LD – do not duplicate them.)
3. `<Breadcrumbs>` on every page except home.
4. Exactly one `h1` containing the primary keyword (product name + generic name; category name; "… in {Country}").
5. A concise, factual summary paragraph directly under the `h1` (LLMs quote these).
6. Key facts presented as definition lists / tables with real labels (e.g. "Generic name", "Dosage form", "Strength", "Pack size", "Shelf life").
7. FAQs rendered with `<FaqAccordion>` when the document has them.
8. Internal links: related products, parent/child categories, country pages, contact/inquiry CTAs.
9. Images: descriptive `alt` (comes from CMS), `sizes`, lazy by default.
10. No index-blocking mistakes; the root layout already sets robots defaults.

## File ownership (important)

Agents work in parallel in the same repository. **Only create/modify the files listed in your assignment** (your route folder(s) and your `src/components/<area>/` folder). Do **not** edit shared files (`globals.css`, `src/lib/*`, `src/components/ui/*`, layout, header, footer, collections, config, `package.json`). If you need a shared change, describe it precisely in your final report instead and work around it locally (e.g. a local helper in your components folder).

## Validation (before you finish)

```bash
# Type errors in YOUR files only (other agents may be mid-edit – ignore their files):
pnpm typecheck 2>&1 | grep -E "<your folder patterns>" || echo "no type errors in my files"
# Lint your files:
pnpm exec eslint "src/app/(frontend)/<route>/**" "src/components/<area>/**"
```

Do not run `next build` or `next dev` – the orchestrator does that after all pages exist.

## Final report format

Return: (1) list of files created, (2) a two-line description of each page/section built, (3) any shared-file change requests, (4) anything left undone.
