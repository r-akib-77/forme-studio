# FORME STUDIO — Premium Bangladesh Fashion Storefront (Frontend Demo)

A complete, production-quality **frontend-only** ecommerce storefront for a fictional Bangladeshi
fashion brand. Built as a live sales demo to pitch professional ecommerce websites to clothing,
T-shirt, jersey, streetwear and fashion retailers in Bangladesh.

> **This is a demonstration, not a live store.** There is no backend, no database, no payment
> gateway and no order processing. The cart lives in the browser's `localStorage`, the checkout
> simulates a submission locally, and every product, price, review, policy and contact detail is
> clearly labelled sample content.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, TypeScript strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` design tokens) |
| Type | Clash Display (display) + Inter (UI/body), self-hosted via `next/font/local` |
| Icons | `lucide-react` |
| Motion | `framer-motion` (respects `prefers-reduced-motion`) |
| State | React Context + `useReducer` (cart), Context (overlays/toasts) |
| Data | Local TypeScript modules in `src/lib/data` |
| Images | `next/image` over locally-hosted assets in `public/images` |

No database, no API routes, no auth, no login, no account dashboard.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage — hero, trust strip, category explorer, featured rotation, editorial campaign, bestsellers, brand story, testimonials, newsletter |
| `/shop` | Full catalogue with filters, sorting and search support |
| `/collections` | Index of every editorial collection |
| `/collections/[slug]` | Collection page — `new-arrivals`, `t-shirts`, `oversized`, `jerseys`, `shirts`, `bottoms`, `accessories`, `bestsellers`, `studio-edit` |
| `/products/[slug]` | Product detail — gallery, variants, quantity, stock, related products, recently viewed |
| `/search?q=` | Search results page with full filter set |
| `/cart` | Full cart page |
| `/checkout` | Demo checkout with validation and a clearly-labelled confirmation |
| `/policies/[slug]` | Delivery, exchange & returns, privacy, terms, size guide, contact |
| `*` | Polished 404 |

---

## Working interactions

- **Cart** — add from card (quick-add with inline size picker), product page, or buy-now. Quantity
  increment/decrement, removal, duplicate-variant merge, live totals, free-delivery progress bar.
  Persisted to `localStorage` and restored across refreshes and navigation.
- **Filters & sorting** — category, price ceiling, size and colour filters with live facet counts,
  active filter chips, clear-all, empty state with reset, and a mobile filter drawer.
  Sort by featured / newest / price low-to-high / price high-to-low.
- **Search** — header overlay with live results, keyboard navigation (↑ ↓ Enter Esc), plus a full
  results page. Matches names, summaries, categories, colours, sizes, materials and studio tags.
- **Checkout** — required-field validation, Bangladeshi mobile-number validation, inline errors,
  disabled/loading state during the simulated submission, then a demo reference number, order
  summary and an explicit "no real order was placed" statement.
- **Overlays** — cart drawer, search dialog and mobile navigation all support Escape to close,
  background scroll-lock and focus placement.

---

## Design system

Tokens live in `src/app/globals.css` under `@theme`:

- Surfaces `paper` / `bone` / `sand` / `clay`
- Ink `ink` / `ink-2` / `muted` / `muted-2`
- Lines `line` / `line-strong`
- Accent `lime` (electric), `lime-deep`, `lime-ink`, `lime-wash` — used only for primary CTAs,
  sale markers and micro-details

Type scale: `.display-xl`, `.display-lg`, `.display-md` for headings; `.eyebrow` for the small
uppercase labels; Inter everywhere else. Buttons use `.btn` with `.btn-ink`, `.btn-lime`,
`.btn-outline` and `.btn-ghost` variants.

---

## Project structure

```
src/
  app/                      # route-level pages (App Router)
    layout.tsx              # fonts, providers, header/footer, overlays
    collections/[slug]/     # collection pages
    products/[slug]/        # product detail pages
    policies/[slug]/        # policy pages
    cart/ checkout/ search/ shop/
  components/
    providers/              # CartProvider, OverlayProvider
    layout/                 # AnnouncementBar, SiteHeader, MobileNavigation, SearchDialog, SiteFooter
    home/                   # Hero, TrustStrip, CategoryGrid, EditorialBanner, BrandStory, …
    product/                # ProductCard, ProductGallery, VariantSelector, AddToCart flow, …
    catalog/                # CatalogView, FilterPanel, SortControl
    cart/  checkout/        # CartDrawer, CartItem, CartSummary, CheckoutForm, OrderConfirmation
    ui/                     # Wordmark, Price, Badge, EmptyState, SectionHeading, Reveal
  lib/
    data/                   # products, categories, collections, policies, site config
    filters.ts  format.ts  checkout.ts  recently-viewed.ts
```

---

## Configuration

Everything a store owner would want to change lives in `src/lib/data/site.ts`:

- `announcements` — the promotional bar
- `trustPoints` — the value strip
- `deliveryInfo` — fees and the free-delivery threshold
- `socialLinks` — footer social destinations
- `districts` — the checkout district list

---

## Image credits

Photography is sourced from [Pixabay](https://pixabay.com/) under the Pixabay Licence
(free for commercial use, no attribution required) and bundled locally in `public/images` so the
demo renders identically offline. Images are illustrative product/lifestyle photography and do not
depict the fictional FORME STUDIO brand.

---

## Deployment

The project is configured for **Cloudflare Workers** via the OpenNext adapter. See
[`wrangler.jsonc`](./wrangler.jsonc) and the Cloudflare section of the deployment notes.

```bash
npm run build:cloudflare
npx wrangler deploy
```
