# FLIQ — Engineering Build Specification

Reference: `00-SITEMAP.md` (route inventory, 88 routes), `DESIGN.md` (visual system,
page templates), and `01-CRAFT.md` (award-tier motion/interaction direction — read that
before building Home, PDP, and Drop templates, since those three carry the signature
work). This document is the implementation contract: architecture, data model, API
surface, and the operational concerns — error handling, race conditions, idempotency,
testing — that separate a shippable system from a prototype.

---

## 1. Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Monorepo vs. polyrepo | Monorepo (Turborepo) | Storefront, admin, and API share types (Prisma-generated) and a component package; polyrepo would require publishing internal packages for no benefit at this team size |
| Frontend rendering | Next.js 14, App Router | PLP/PDP need SSR for SEO and social previews; admin is CSR-heavy behind auth where SEO doesn't matter — App Router handles both without two separate apps |
| API style | REST over GraphQL | The client surface (storefront + admin) is finite and well-known; REST keeps caching (CDN/HTTP) straightforward, which matters more here than GraphQL's flexible querying |
| ORM | Prisma over raw SQL / query builder | Generated types flow into both API and frontend via the shared `types` package; migration history is versioned and reviewable in PRs |
| Database | PostgreSQL | Relational integrity matters for inventory (see §5) — stock counts and order state are not eventually-consistent-tolerant |
| Cart storage | Server-side (DB-backed), not client-only | Client-only cart (localStorage) can't reserve stock, can't survive device switch, and can't be resumed via abandoned-cart email — all three are requirements |
| Inventory reservation | Explicit reservation table with TTL, not a simple decrement | Prevents overselling under concurrent checkout without locking the whole product row (see §5.2) |
| Auth | NextAuth.js (credentials + OTP + OAuth) with JWT session, refresh via httpOnly cookie | Avoids building session/token infra from scratch; OTP path required because Indian D2C checkout conversion is materially better with phone-OTP than password auth |
| Payments | Razorpay (India) + Stripe (international), selected by shipping country | Neither gateway alone covers both UPI (India) and major international card/wallet rails well |
| Search | Meilisearch, not Postgres full-text | Sub-50ms typo-tolerant search with facet filtering out of the box; Postgres FTS would need to be hand-rolled to match this |
| Background jobs | BullMQ on Redis | Email sends, inventory sync, low-stock checks, and abandoned-cart nudges must not block the request/response cycle |

---

## 2. Tech Stack

**Frontend (storefront + admin, shared Next.js monorepo apps):** Next.js 14 (App
Router), **Turbopack** as the dev/build bundler (`next dev --turbo`; Turbopack for
production builds once it's stable for the plugin set in use — Turbopack build support
should be re-verified against the exact Next.js version pinned in `package.json` before
relying on it in CI, since coverage for custom webpack loaders/plugins varies by
release), TypeScript (strict mode), CSS Modules using the token system from
`DESIGN.md` §2, Zustand for client state (cart UI, filters, drawers), TanStack Query
for server-state caching, React Hook Form + Zod for form validation (schema shared
with backend), Lucide React icons.

**Motion & craft layer** (this is what takes the site from "well-built" to
award-caliber — see `01-CRAFT.md` for the full direction and choreography spec):
GSAP + ScrollTrigger for orchestrated scroll-driven sequences, Lenis for smooth-scroll
that GSAP's scroll triggers sync against, Framer Motion for component-level and
route-transition animation, React Three Fiber + drei (Three.js) for the WebGL hero/
signature moment, a custom cursor component, and `@react-three/postprocessing` for
grain/chromatic-aberration passes if the WebGL direction calls for it. All of this sits
behind `prefers-reduced-motion` and a performance budget — see `01-CRAFT.md` §5.

**Backend:** Node.js 20, Fastify, TypeScript strict mode, Prisma ORM, PostgreSQL 16,
Redis 7 (cache, sessions, BullMQ), Meilisearch, AWS S3 / Cloudflare R2 for media,
Cloudflare CDN, Razorpay + Stripe SDKs, Resend (email), MSG91/Twilio (OTP/SMS),
Shiprocket API (multi-courier shipping), Sentry (error tracking), PostHog
(self-hosted analytics).

**Tooling:** Turborepo, ESLint + Prettier (shared config package), Husky pre-commit
(lint + type-check on staged files), Vitest (unit), Testing Library (component),
Playwright (E2E), GitHub Actions (CI/CD), Docker Compose (local Postgres/Redis/Meilisearch).

---

## 3. Repository Structure

```
fliq/
├── apps/
│   ├── web/                     # storefront — Next.js
│   │   ├── app/                 # routes per DESIGN.md §6 templates
│   │   ├── components/          # ui/, nav/, product/, cart/, checkout/, account/
│   │   ├── hooks/
│   │   ├── lib/                 # api client, validators, formatters
│   │   ├── store/                # Zustand slices
│   │   └── middleware.ts        # auth guard, locale, maintenance-mode check
│   ├── admin/                   # staff dashboard — Next.js, separate deployable
│   │   └── app/                 # routes per 00-SITEMAP.md §E
│   └── api/                     # Fastify backend
│       └── src/
│           ├── routes/          # one file per resource, see §4
│           ├── services/        # business logic, framework-agnostic
│           ├── jobs/             # BullMQ workers
│           ├── plugins/          # fastify plugins: auth, rate-limit, cors, sentry
│           ├── middleware/
│           └── prisma/
│               ├── schema.prisma
│               ├── migrations/
│               └── seed.ts
├── packages/
│   ├── ui/                      # shared component primitives (Button, Badge, FormField…)
│   ├── types/                   # shared TS types, generated from Prisma + Zod schemas
│   ├── config/                  # eslint, tsconfig, prettier — shared configs
│   └── validators/              # Zod schemas shared by frontend forms and API routes
├── docker-compose.yml
├── turbo.json
└── .github/workflows/
```

**Rule:** business logic lives in `apps/api/src/services/*`, never inline in route
handlers. Route handlers do request parsing, calling a service, and response shaping —
nothing else. This is what makes the service layer unit-testable without spinning up
Fastify or a database.

---

## 4. Data Model

Full schema lives in `apps/api/prisma/schema.prisma`. Entity groups and the
relationships that carry real business rules:

**Identity:** `User`, `Address`, `Session`. A `User` has many `Address`; exactly one
may be `isDefault` per user, enforced in the service layer (not the DB) because Prisma
can't express "exactly one true per FK group" declaratively — this is checked
transactionally on write.

**Catalog:** `Product` → `Variant` (size × color) → `Inventory` (variant × warehouse).
A `Product` is never sold directly; every cart line, order line, and stock check
references a `Variant`. `ProductImage` can optionally be scoped to a `variantColor` so
the gallery swaps when the customer changes color.

**Merchandising:** `Category` (self-referential for sub-categories), `Drop`, `Collab`.
A `Product` optionally belongs to one `Drop` and one `Collab`; both are nullable
because most catalog product is evergreen, not drop-exclusive.

**Commerce:** `Cart` → `CartItem`, `Order` → `OrderItem`, `Payment`, `Shipment` →
`ShipmentEvent`, `Return`, `Discount`. `OrderItem` snapshots `productName`, `sku`,
`unitPrice`, `size`, `color` at time of purchase — order history must never change
retroactively because a product was later renamed or repriced.

**Inventory:** `Warehouse`, `Inventory`, `InventoryMovement` — every change to
`Inventory.quantity` is written through a service method that also writes an
`InventoryMovement` row in the same transaction. Direct mutation of `Inventory.quantity`
outside that service is a code-review blocker (see §9).

**Engagement:** `Review`, `WishlistItem`, `LoyaltyEvent`, `Notification`,
`DropWaitlist`.

The full field-level schema (all enums, constraints, indexes) is maintained in
`apps/api/prisma/schema.prisma` as the single source of truth — this document describes
relationships and rules, not a duplicate copy of the schema that will drift from it.

**Indexing requirements** (defined in the schema, called out here because they're easy
to omit and expensive to add later on a large table):
- `Product.slug`, `Order.orderNumber`, `User.email` — unique indexes, already implied by uniqueness
- `Inventory(variantId, warehouseId)` — composite unique, this is the hot lookup on every add-to-cart and checkout
- `OrderItem.orderId`, `CartItem.cartId` — FK indexes for join performance on order/cart detail
- `InventoryMovement.createdAt` — for the audit-log date-range queries in admin
- `Product` full-text/trigram index is not needed — search is delegated to Meilisearch entirely; Postgres is not queried for text search in the request path

---

## 5. Inventory & Concurrency — Core Business Logic

This is the part of the system most likely to break silently if built casually, so it
gets its own section rather than being folded into "API routes."

### 5.1 The problem

Two customers can add the last unit of a variant to their carts simultaneously. Without
explicit handling, both checkouts can succeed, and the store oversells.

### 5.2 Reservation model

Stock is never decremented at "add to cart" — only at checkout initiation, and only for
a bounded time:

1. Customer starts checkout → for each cart line, `InventoryService.reserve()` runs
   inside a DB transaction: `SELECT ... FOR UPDATE` locks the specific
   `(variantId, warehouseId)` row, checks `quantity - reserved >= requestedQty`, and if
   so increments `reserved` and writes an `InventoryMovement` of type `RESERVATION`.
   If not enough stock, the transaction aborts and the customer sees a per-line
   "only N left" or "sold out" message immediately, before entering payment.
2. The reservation carries a 15-minute TTL (stored as `expiresAt` on the order, checked
   by a scheduled job, see §5.4). This is the checkout window.
3. Payment succeeds → `commitReservation()` runs: `reserved` stays incremented,
   `quantity` decrements, movement type `SALE` recorded, in the same transaction as the
   order status update to `CONFIRMED`.
4. Payment fails, times out, or the customer abandons checkout → `releaseReservation()`
   runs: `reserved` decrements back, movement type `RESERVATION_CANCEL`. This can be
   triggered by the payment webhook (failure event) or by the expiry sweep in §5.4.

Row-level locking (`FOR UPDATE`) is scoped to a single `(variant, warehouse)` row, not
the whole product — two customers buying different sizes of the same hoodie never
contend with each other.

### 5.3 Multi-warehouse routing

`InventoryService.routeOrder(items, destinationPostcode)` runs before reservation and
decides, per line item, which warehouse fulfills it:

1. Filter to warehouses with `quantity - reserved >= requestedQty` for that variant.
2. Prefer a single warehouse that can fulfill the entire cart (avoids split shipments
   and duplicate shipping cost) — computed by intersecting the eligible-warehouse sets
   across all lines.
3. If no single warehouse covers the full cart, split: assign each line to its nearest
   eligible warehouse by shipping-zone distance, and create one `Shipment` per
   warehouse used.
4. If no warehouse has any given line in stock at all, that line is rejected before
   reservation — the customer is told at cart/checkout, not after payment.

### 5.4 Reservation expiry sweep

A BullMQ repeatable job runs every 2 minutes: finds orders in `PENDING` status where
`expiresAt < now()`, calls `releaseReservation()` for each, and marks the order
`CANCELLED` with reason `RESERVATION_EXPIRED`. This is what makes "someone opened
checkout and closed the tab" not silently lock stock forever.

### 5.5 Low-stock alerting

A separate job runs every 15 minutes: for every `Inventory` row where
`quantity - reserved <= lowStockAt`, and no alert has fired for that row in the last 24
hours (tracked via a Redis key with TTL, not a DB write, since this is a rate-limit
concern not durable state), enqueue an email + Slack webhook to the ops channel and
create an in-app `Notification` for admin users.

### 5.6 Shipping rate calculation

`/api/shipping/rates` is called at the Checkout — Shipping step with the resolved
warehouse-routing result from §5.3 and the destination address. It calls the Shiprocket
rate API per warehouse-to-destination leg, sums for split shipments, and returns
options (Standard/Express/International) with live price and ETA — these are never
hardcoded flat rates in the frontend, because actual courier pricing varies by weight,
distance, and zone, and hardcoding it either overcharges or loses money on edge cases.

---

## 6. API Surface

Base path `/api`. Full request/response schemas are defined as Zod schemas in
`packages/validators` and shared between the Fastify route (server-side validation) and
the React Hook Form resolver (client-side validation) — the two never validate against
separately maintained rules.

### 6.1 Conventions

- Versioning: unversioned for v1; a breaking change gets `/api/v2/...` alongside the old
  path until clients migrate, not an in-place breaking change.
- Pagination: cursor-based (`?cursor=<id>&limit=24`), response includes `nextCursor`.
  Chosen over offset pagination because product/order tables are written to
  continuously and offset pagination skips/duplicates rows under concurrent writes.
- Errors: consistent envelope —
  ```json
  { "error": { "code": "OUT_OF_STOCK", "message": "Size M is no longer available", "field": "variantId" } }
  ```
  `code` is a stable machine-readable enum the frontend switches on for messaging;
  `message` is a fallback display string, not the primary contract.
- Idempotency: all mutating endpoints that can be safely retried (`POST /orders`,
  `POST /payments/*`) accept an `Idempotency-Key` header; the server stores the key →
  response mapping for 24h in Redis and replays the stored response on a duplicate key
  instead of re-executing the mutation. This is what prevents a flaky network retry
  from creating two orders.
- Filtering/sorting on list endpoints is expressed as query params that mirror the
  frontend URL state described in DESIGN.md §6 Template B, so filter state round-trips
  through a shareable URL without a translation layer.

### 6.2 Resource routes

```
Products        GET/POST  /products, /products/:slug, /products/featured,
                          /products/related/:slug
Categories      GET/POST  /categories, /categories/:slug
Search          GET       /search  (proxies Meilisearch, merges stock status from Postgres)
Cart            GET/POST/PUT/DELETE  /cart, /cart/items, /cart/items/:id, /cart/discount
Checkout        POST      /checkout/quote (validates cart, runs routeOrder, returns
                          shipping options — does not reserve yet)
Orders          GET/POST  /orders, /orders/:id, /orders/:id/cancel
Payments        POST      /payments/razorpay/order, /payments/razorpay/verify,
                          /payments/stripe/intent
Webhooks        POST      /webhooks/razorpay, /webhooks/stripe, /webhooks/shiprocket
Inventory       GET/POST  /inventory, /inventory/variant/:id, /inventory/low-stock,
                          /inventory/adjust, /inventory/transfer, /inventory/movements
Drops           GET/POST  /drops, /drops/:slug, /drops/:slug/waitlist, /drops/:id/launch
Auth            POST      /auth/register, /auth/login, /auth/otp/send, /auth/otp/verify,
                          /auth/logout, /auth/refresh
Users           GET/PUT   /users/me, /users/addresses, /users/wishlist, /users/loyalty
Returns         GET/POST  /returns, /returns/:id/status
Shipping        POST/GET  /shipping/rates, /shipping/track/:trackingNumber
Reviews         GET/POST  /reviews, /reviews/:id/moderate
```

Every admin-only route additionally requires role middleware (§7.3) and is written
under the same route files with an explicit `preHandler: [requireRole('ADMIN')]` rather
than a parallel `/admin/api/*` namespace — one resource, role-gated per-action, is
easier to keep consistent than two parallel route trees.

---

## 7. Cross-Cutting Concerns

### 7.1 Error handling

Every service method that can fail in an expected way (out of stock, invalid discount
code, payment declined) throws a typed `AppError` with a `code` and HTTP status, caught
by a single Fastify error handler that shapes the response envelope from §6.1.
Unexpected errors (bugs, DB connection loss) are caught by the same handler, logged to
Sentry with request context, and returned as a generic `500` — internals are never
leaked to the client response body.

Frontend: TanStack Query's error boundary per data-fetching region, so a failure in the
"related products" rail doesn't blank the entire PDP — only that section shows a retry
state.

### 7.2 Payment webhook handling

Razorpay and Stripe webhooks are the source of truth for payment status, not the
client-side success callback (which can be spoofed or lost on a dropped connection).
Flow: client-side handler calls `/payments/*/verify` for immediate UI feedback, but
`commitReservation()` and `Order.status → CONFIRMED` only happen from the webhook
handler, guarded by signature verification (HMAC for Razorpay, Stripe's SDK
verification for Stripe) and by idempotency (Stripe/Razorpay event IDs are stored and
duplicate deliveries are no-ops).

### 7.3 AuthN/AuthZ

Storefront: NextAuth.js, JWT session cookie (httpOnly, `SameSite=Lax`, `Secure`),
refresh token rotation. Guest checkout uses a signed, unauthenticated session ID for
cart association, merged into the user's cart on login (`POST /cart/merge`).

Admin: separate login flow, mandatory TOTP 2FA for `ADMIN`/`SUPER_ADMIN` roles, role
enum (`WAREHOUSE_STAFF < ADMIN < SUPER_ADMIN`) checked via a `requireRole()` middleware
on every admin route per §6.2. Every state-changing admin action (status change, refund,
stock adjustment, discount creation) writes an `AuditLog` entry: actor, action, target,
before/after diff, timestamp — surfaced at `/admin/audit-log`.

### 7.4 Rate limiting

Per-IP and per-account limits via `@fastify/rate-limit` backed by Redis: auth endpoints
5/min, cart mutations 30/min, general API 100/min, webhook endpoints exempt (verified
by signature instead). Limits return `429` with a `Retry-After` header, not a silent drop.

### 7.5 Caching

- CDN edge caching for `GET /products`, `GET /categories` responses (`Cache-Control`
  with short `max-age` + `stale-while-revalidate`), invalidated on product/category
  mutation via a cache-purge call to Cloudflare.
- Redis cache for computed, expensive reads (homepage featured products, drop status)
  with explicit invalidation on the relevant admin mutation, not TTL-only — TTL-only
  caching on a "drop just went live" moment would show stale sold-out state for up to
  the TTL window, which is unacceptable at a drop launch.
- Next.js ISR (`revalidate: 60`) for PDP/PLP static shells, with client-side
  stock/price re-fetch on mount so the statically-rendered shell never shows stale
  price or availability.

### 7.6 Observability

Sentry (frontend + backend) for error tracking with release tagging so a regression is
traceable to a deploy. Structured JSON logging (Pino) for all API requests: request ID,
route, status, duration, user ID if authenticated — request ID is propagated from an
`X-Request-Id` header (generated at the edge if absent) through to logs and error
reports so a single user-reported issue can be traced end to end. PostHog for product
analytics (funnel: PDP view → add to cart → checkout start → purchase) and session
replay on the storefront only, never on `/checkout/payment` (payment fields are
excluded from replay/recording entirely).

---

## 8. Content & Configuration

Not everything is a deploy. The following are admin-editable at runtime, backed by DB
tables rather than code constants, because product/marketing needs to change them
without engineering:

- Homepage sections (hero media, ticker message, featured-drop selection) — `/admin/content`
- Free-shipping threshold, low-stock default threshold, checkout reservation TTL — `/admin/settings`
- Email templates (Resend template variables editable per trigger listed below) — `/admin/email-templates`
- Shipping zones/rates fallback rules, discount codes, loyalty tier thresholds and
  point-earn rates — their respective admin pages per `00-SITEMAP.md` §E

**Transactional email triggers** (Resend), each with its own template row:
account welcome, order confirmed, order shipped, order delivered (+ review prompt),
payment failed, return approved, return refunded, drop-waitlist notify, low-stock
wishlist-item alert, password reset, loyalty-tier-unlocked.

---

## 9. Code Review Standards (PR checklist)

- [ ] No hardcoded color/spacing/font values — tokens from `DESIGN.md` §2 only
- [ ] No direct `prisma.inventory.update()` outside `InventoryService` — every stock
      mutation goes through the reservation/movement-logging methods (§5)
- [ ] Every new mutating endpoint has a Zod schema shared from `packages/validators`,
      not an inline/duplicated shape
- [ ] Every new mutating endpoint has an explicit error-case test (not just the happy path)
- [ ] Every new list/detail page has a loading and empty state (DESIGN.md §3.7–3.8)
- [ ] Business logic lives in `services/`, not in route handlers or React components
- [ ] No secrets committed; new env vars added to `.env.example` and to the deploy
      platform's secret store, referenced in §12
- [ ] Admin state-changing actions write an `AuditLog` entry (§7.3)

---

## 10. Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Service unit tests | Vitest | All `services/*` methods, especially `InventoryService` reservation/release/routing logic under concurrent-call simulation |
| API integration tests | Vitest + a real test Postgres (via Docker) | Every route in §6.2, happy path + documented error codes |
| Component tests | Testing Library | Shared components in `packages/ui` (Button, FormField, ProductCard states, size-selector disabled/low-stock states) |
| E2E | Playwright | Critical paths only: browse → PDP → add to cart → guest checkout → order confirmation; login → account → reorder; admin: create product → appears on storefront; drop launch → goes live at scheduled time |
| Load/concurrency | k6 script targeting `/checkout/quote` and reservation flow | Simulate N concurrent checkouts against a single low-stock variant; assert final `quantity` never goes negative |
| Accessibility | axe-core in CI against key pages (Home, PLP, PDP, Cart, Checkout) | Zero critical/serious violations |

The concurrency load test in particular is a release gate for any change touching
`InventoryService` — this is the one area where a passing unit test suite alone isn't
sufficient evidence of correctness, because the bug class (overselling) only appears
under real concurrent load.

---

## 11. Compliance

- Cookie consent banner gating non-essential analytics (PostHog) until accepted, per
  `/cookies` policy
- Data export and account-deletion request handling from `/account/profile`, fulfilled
  within the timeframe stated in `/privacy` — deletion is a soft-delete + PII scrub on
  `User`, not a hard row delete, since `OrderItem` snapshots must legally be retained
  for tax/accounting purposes independent of the user account
- Payment data: card details never touch FLIQ's servers — Razorpay/Stripe Elements/SDK
  tokenize client-side; only tokens and last-4/brand metadata are stored

---

## 12. Environments & Deployment

| Env | Frontend host | API host | DB | Purpose |
|---|---|---|---|---|
| Local | Docker Compose | Docker Compose | Local Postgres container | Development |
| Preview | Vercel PR previews | Railway PR environment | Ephemeral Neon branch | Per-PR QA |
| Staging | Vercel | Railway | Neon (staging branch) | Pre-release verification, seeded with anonymized production-shaped data |
| Production | Vercel | Railway | Neon/Supabase (production) | Live |

**CI (GitHub Actions), on every PR:** install → type-check → lint → unit tests →
integration tests (against a spun-up Postgres service container) → build. **On merge to
`main`:** the above, plus `prisma migrate deploy` against staging, Playwright E2E
against the staging deploy, then a manual promotion step to production (not
auto-deployed to prod on green CI — a human confirms, given this touches payments and
inventory).

**Required environment variables** (full list maintained in `.env.example`, categories
below): database URL, Redis URL, NextAuth secret + provider keys, Razorpay key/secret,
Stripe key/secret + webhook signing secret, Resend API key, MSG91/Twilio credentials,
Shiprocket API credentials, S3/R2 credentials, Meilisearch host + key, Sentry DSN
(web/admin/api, separate projects), PostHog project key.

Pre-launch checklist: migrations applied, seed data loaded (categories, warehouses,
initial catalog), all webhook endpoints registered with their respective providers and
verified with a test event, DNS/SSL live, `robots.txt` + `sitemap.xml` generated from
the live product/category set (not hand-maintained), Sentry and PostHog wired in both
apps, staging→production data parity checked.

---

## 13. Build Sequence

Ordered so every stage is independently testable before the next depends on it:

1. Monorepo scaffold, shared config packages, CI skeleton
2. Prisma schema + migrations + seed script (categories, warehouses, sample catalog)
3. Auth (register/login/OTP) end to end, storefront + API
4. Catalog read APIs + PLP/PDP (static content, no cart yet) — validates DESIGN.md
   tokens and templates against real data early
5. Cart (server-backed) + cart UI (drawer + page)
6. Inventory service: reservation, release, routing, expiry sweep, low-stock job — built
   and load-tested (§10) before checkout is wired to it
7. Checkout flow (4 steps) + Razorpay/Stripe integration + webhook handlers
8. Order confirmation, order history, tracking
9. Admin: catalog CRUD, order management, inventory dashboard
10. Search (Meilisearch indexing + search UI)
11. Drops/Collabs (storefront pages + admin launch control)
12. Reviews, wishlist, returns flow (storefront + admin moderation)
13. Loyalty engine
14. Content-block system for editorial pages + admin CMS
15. Email templates wired to all triggers (§8)
16. Remaining policy/utility pages (Template F)
17. SEO pass: metadata, structured data, sitemap generation
18. Accessibility audit against §7 (DESIGN.md) and axe-core CI gate
19. Performance pass: image optimization, bundle analysis, ISR tuning
20. Security review against §7.1–7.4 of this document
21. Staging soak test + Playwright E2E full pass
22. Production deploy per §12
