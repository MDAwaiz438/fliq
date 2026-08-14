# FLIQ — Design System

Reference: `00-SITEMAP.md` for the full route table (88 routes). This document defines
the design tokens once, and specs each page as a composition of reusable templates and
components — the way an actual design system is documented, not as one-off mockups.

---

## 1. Brand Basis

Source: Simple, sober, professional e-commerce design ("RAW. EDGE. NOW." / Light Canvas – Ink BLK – Cobalt Blue).

- Archetype: sleek premium e-commerce / professional streetwear
- Audience: 16–32, streetwear collectors, minimalist design enthusiasts
- Visual reference: Modern, clean, simple and sober website — crisp light ground, high-contrast typography, Cobalt Blue primary accent
- Non-negotiables extracted: clean light-grey/white ground, solid high-contrast black typography, single cobalt blue accent used for primary CTAs and badges, crisp B&W photography

---

## 2. Design Tokens

Tokens are the single source of truth. Components and pages reference tokens only —
no hardcoded hex, px, or font-family values anywhere in the codebase.

### 2.1 Color

```css
:root {
  --clr-acid:     #2563EB;  /* primary accent — Cobalt Blue */
  --clr-onyx:     #FAFAFA;  /* base page background — Light canvas */
  --clr-obsidian: #F4F4F5;  /* card / alternate section background — Light surface */
  --clr-charcoal: #E4E4E7;  /* footer, panels, inputs container */
  --clr-bone:     #09090B;  /* primary text on light ground — Ink dark */
  --clr-muted:    #71717A;  /* secondary text, placeholders */
  --clr-white:    #FFFFFF;  /* high-emphasis surface, clean white */
  --clr-danger:   #DC2626;  /* errors, sold-out, destructive actions */
  --clr-success:  #16A34A;  /* confirmations */
  --clr-gold:     #D97706;  /* loyalty tier / premium indicator only */
  --clr-border:   rgba(0,0,0,0.1);
}
```

**Contrast audit (WCAG AA, 4.5:1 body text minimum):**

| Pair | Ratio | Pass |
|---|---|---|
| `--clr-bone` on `--clr-onyx` | 18.1:1 | AA/AAA |
| `--clr-muted` on `--clr-onyx` | 4.6:1 | AA (body) |
| `--clr-white` on `--clr-bone` (primary button text) | 19.8:1 | AA/AAA |
| `--clr-danger` on `--clr-onyx` | 5.2:1 | AA |

**Usage constraint:** `--clr-acid` is used as a primary accent for CTAs, active indicators, focus rings, and badges.

### 2.2 Typography

| Role | Family | Weights used | Fallback stack |
|---|---|---|---|
| Display (hero, drop names) | Bebas Neue | 400 only (already condensed/bold by design) | `'Bebas Neue', 'Anton', Impact, sans-serif` |
| Heading (section titles, product names) | Barlow Condensed | 600, 700 | `'Barlow Condensed', 'Roboto Condensed', sans-serif` |
| Body | Inter | 400, 500 | `Inter, -apple-system, 'Segoe UI', sans-serif` |
| Numeric / SKU / countdowns | JetBrains Mono | 400, 500 | `'JetBrains Mono', 'SF Mono', monospace` |

All four are self-hosted via `next/font/google` with `display: 'swap'` and Latin subset
only — no CDN `<link>` tags (avoids a third-party render-blocking request).

```css
:root {
  --font-display: var(--font-bebas);
  --font-heading: var(--font-barlow);
  --font-body:    var(--font-inter);
  --font-mono:    var(--font-jetbrains);

  --text-hero:    clamp(2.75rem, 9vw, 8.5rem);
  --text-display: clamp(2rem, 5vw, 4rem);
  --text-h1:      clamp(1.75rem, 3.4vw, 2.75rem);
  --text-h2:      clamp(1.375rem, 2.4vw, 1.875rem);
  --text-h3:      clamp(1.125rem, 1.6vw, 1.375rem);
  --text-body-lg: clamp(1rem, 1.2vw, 1.125rem);
  --text-body:    clamp(0.9375rem, 1vw, 1rem);
  --text-small:   clamp(0.8125rem, 0.9vw, 0.875rem);
  --text-micro:   clamp(0.6875rem, 0.8vw, 0.75rem);
}
```

Typographic rules:
- Display/Heading roles are always uppercase with `letter-spacing: 0.02em` (display) or
  `0.06em` (heading, since Barlow Condensed reads tighter at small sizes).
- Body copy is sentence case, `line-height: 1.6`, max measure `65ch`.
- Never set Bebas Neue below `1.5rem` rendered size — it loses legibility condensed and small.
- Numeric values that change dynamically (prices, countdowns, stock counts) use `--font-mono`
  so digit widths don't cause layout shift.

### 2.3 Spacing & Layout

```css
:root {
  --space-1: clamp(0.25rem, 0.4vw, 0.375rem);
  --space-2: clamp(0.5rem, 0.8vw, 0.75rem);
  --space-3: clamp(0.75rem, 1.2vw, 1.25rem);
  --space-4: clamp(1rem, 1.8vw, 1.75rem);
  --space-5: clamp(1.5rem, 2.6vw, 2.5rem);
  --space-6: clamp(2rem, 3.6vw, 3.5rem);
  --space-7: clamp(3rem, 5.5vw, 5.5rem);
  --space-8: clamp(4.5rem, 8vw, 8.5rem);

  --section-pad-y: var(--space-8);
  --content-max: 90rem;         /* 1440px content ceiling */
  --content-pad-x: clamp(1rem, 4vw, 3rem);
  --gutter: clamp(0.75rem, 1.6vw, 1.75rem);
}

.container {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--content-pad-x);
}
```

Spacing scale is a t-shirt scale (1–8), not arbitrary values, so any two engineers land
on the same number for "medium gap between related elements" (`--space-4`) vs.
"gap between unrelated sections" (`--space-7`/`--space-8`).

### 2.4 Grid

```css
.grid-plp {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gutter);
}
@media (max-width: 1024px) { .grid-plp { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px)  { .grid-plp { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .grid-plp { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); } }
```

Product grids stay 2-up on mobile, not 1-up — single-column product grids force
excessive scrolling and underperform on mobile conversion. This is a deliberate
deviation from the "mobile = stack everything" default.

### 2.5 Radius, Elevation, Motion

```css
:root {
  --radius-sm: 2px;
  --radius-md: 4px;
  --shadow-card: 0 8px 30px rgba(0,0,0,0.45);
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 360ms;
}
```

Corner radius is deliberately near-zero (2–4px) — sharp geometry is part of the brand's
"raw/edge" identity, established from the source asset's angular wordmark treatment.

Motion is restricted to: page-load hero reveal, scroll-triggered fade-in (once, not
repeating), hover state transitions, and cart/toast feedback. No parallax gimmicks, no
scroll-jacking. Every animation is wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## 3. Component Specifications

Each component below is built once as a shared primitive and reused across every page
that needs it — pages are not allowed to define one-off variants.

### 3.1 Button

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--clr-bone` (`#09090B`) | `--clr-white` (`#FFFFFF`) | none | Add to cart, checkout, primary CTA |
| Secondary | `--clr-obsidian` (`#F4F4F5`) | `--clr-bone` (`#09090B`) | `1px solid --clr-border` | Secondary actions |
| Ghost | transparent | `--clr-bone` (`#09090B`) | `1px solid --clr-border` | Secondary navigation CTAs |
| Outline-accent | `--clr-white` | `--clr-acid` (`#2563EB`) | `2px solid --clr-acid` | "Shop the drop" style CTAs on hero |
| Destructive / Danger | `--clr-danger` (`#DC2626`) | `--clr-white` | none | Destructive actions, remove item |
| Disabled | `--clr-charcoal` | `--clr-muted` | none | Out of stock, invalid form state |

Spec: height `clamp(2.5rem, 4vw, 3rem)`, horizontal padding `var(--space-5)`, label is
`--font-heading` 700 uppercase `--text-small`, `letter-spacing: 0.08em`. Hover: 6%
lightness shift, `transform: translateY(-1px)`, `--dur-fast`. Focus: `2px solid
--clr-acid` outline with `2px` offset — this is the only place acid appears as a
non-button-fill and it's required for keyboard accessibility, not decoration.

### 3.2 Product Card

Fixed anatomy, used identically on Home, PLP, Search, Wishlist, Cart upsell rail, and
Admin product picker:

- Image container: `aspect-ratio: 4/5`, `object-fit: cover`, single badge slot top-left
  (`NEW`, `SALE`, `SOLD OUT`, `LIMITED` — one at a time, priority in that order)
- Below image: category label (`--text-micro`, `--clr-muted`, uppercase) + wishlist
  toggle icon, right-aligned, same row
- Product name: `--font-heading` 600, `--text-h3`, max 2 lines with ellipsis truncation
- Price row: current price `--font-mono`, `--clr-bone`; if discounted, compare-at price
  in `--clr-muted` with `text-decoration: line-through`, plus a `%off` chip in `--clr-danger`
- Size availability: inline chips, out-of-stock sizes rendered at 35% opacity with a
  diagonal strike, not hidden — hiding sizes makes people think the product only comes
  in fewer sizes than it does
- Quick-add: revealed on hover (desktop) / always visible as icon (touch), opens a
  lightweight size-select popover rather than navigating away

Card container: `background: var(--clr-obsidian)`, no shadow at rest, `1px solid
transparent` border that becomes `1px solid var(--clr-acid)` on hover/focus-within.

### 3.3 Navigation

- `position: sticky; top: 0`, height `clamp(3.25rem, 6vw, 4.375rem)`, background
  `rgba(10,10,10,0.85)` with `backdrop-filter: blur(10px)`, bottom border
  `1px solid var(--clr-border)` that only appears after `scrollY > 40px` (avoids a
  visible seam over full-bleed hero media)
- Left: wordmark. Center or left-adjacent: primary nav (`Drops`, `Shop`, `Collab`,
  `Archive`, `About`). Right: search icon, wishlist icon, account icon, cart icon with
  live item-count badge.
- `Shop` opens a mega-menu on hover (desktop, `≥1024px`): category list left column,
  one featured-drop promo tile right column. Below `1024px`, entire nav collapses to a
  hamburger driving a full-height off-canvas panel — no mega-menu on touch, since
  hover-driven menus don't translate to touch and shouldn't be faked with tap-toggle
  hacks that fight the user's first tap.
- Cart icon opens a slide-in drawer (`CartDrawer`) rather than navigating to `/cart`
  for quick add/remove; `/cart` remains a full page for users who land there directly
  or want the full upsell rail.

### 3.4 Form Fields

Single input pattern reused across auth, checkout, account, and admin forms:

```
label (--text-small, --clr-muted, uppercase, margin-bottom: var(--space-1))
input (background: --clr-charcoal, border: 1px solid --clr-border,
       border-radius: --radius-sm, padding: var(--space-3),
       focus: border-color --clr-acid, no glow/shadow)
helper/error text (--text-micro, --clr-danger on error, margin-top: var(--space-1))
```

Every input has a real `<label>` (not placeholder-as-label). Error state adds
`aria-invalid="true"` and `aria-describedby` pointing at the helper text — this is
enforced by a shared `<FormField>` wrapper component, not left to each page to remember.

### 3.5 Badges

`--font-heading` 700, uppercase, `--text-micro`, padding `2px 8px`, `border-radius:
--radius-sm`.

| Badge | Background | Text |
|---|---|---|
| New | `--clr-acid` | `--clr-onyx` |
| Sale / % off | `--clr-danger` | `--clr-white` |
| Sold out | `--clr-charcoal` | `--clr-muted` |
| Limited | transparent, `1px solid --clr-acid` | `--clr-acid` |
| Collab | `--clr-gold` | `--clr-onyx` |

### 3.6 Toast / Inline Notification

Bottom-right on desktop, full-width bottom-anchored on mobile. `--clr-obsidian`
background, `4px` left border in semantic color (success/error/info), auto-dismiss 4s
with a pause-on-hover timer, and an explicit close button — auto-dismiss alone fails
accessibility for screen reader / motor-impaired users who need time to act on it.

### 3.7 Skeleton / Loading States

Every data-dependent component (product grid, cart, order list, admin tables) ships
with a skeleton variant matching its final layout dimensions exactly, to avoid layout
shift when data resolves. No spinners-in-a-blank-page for anything that renders a list
or card grid.

### 3.8 Empty States

Every list-type page has a defined empty state — this is scoped as a requirement, not
an afterthought:

| Context | Empty state content |
|---|---|
| Cart | "Your cart is empty" + 4-product recommendation rail + link to `/shop` |
| Wishlist | "Nothing saved yet" + link to `/shop` |
| Order history | "No orders yet" + link to `/shop` |
| Search, 0 results | Query echoed back + 6 trending products + link to clear/broaden |
| Admin table, filtered to 0 | "No results match these filters" + clear-filters action |

---

## 4. Imagery

| Context | Ratio | Notes |
|---|---|---|
| Product card / PLP | 4:5 | Consistent studio or on-model shot, neutral or concrete backdrop |
| PDP gallery main | 4:5 | 5–8 images per product: front, back, detail ×2, on-model ×2, fabric close-up |
| Hero (home, drop, collab) | full-bleed, `min(100svh, 900px)` | High-contrast B&W or duotone photography with acid used only as a graphic overlay element, never a color-graded wash over the whole frame |
| Category header | 21:9 | Editorial crop, left-side gradient scrim for text legibility |
| Lookbook | 3:4 or 1:1 mixed, editorial layout | Intentionally varied, not a rigid grid |

All images served via `next/image`, AVIF with WebP fallback, explicit `sizes` per
breakpoint, `priority` only on the single largest above-the-fold image per page.

---

## 5. Responsive Strategy

Mobile-first authoring. Breakpoints are content-driven, not device-driven:

```
base   : 0–479px    (default styles)
sm     : ≥480px
md     : ≥768px
lg     : ≥1024px
xl     : ≥1280px
2xl    : ≥1536px
```

Because typography and spacing already flex via `clamp()`, breakpoints in practice are
only needed for **structural** changes: column count, nav collapse, sidebar-to-drawer
conversion. This keeps the media query count low and the layout logic legible — a page
should need 2–4 breakpoint rules, not 15.

---

## 6. Page Specifications

Rather than mock every one of the 88 routes individually (which produces
inconsistency), pages are built from a small set of **page templates**. Each route in
`00-SITEMAP.md` maps to exactly one template below, plus route-specific content
sections.

### Template A — Home (unique, single instance)

Section order: Hero (full-bleed video/image, headline + current-drop CTA) → marquee
ticker (shipping/drop announcements, `--clr-acid` background, the one approved
large-area use of the accent color, since it's a thin strip not a section) → current
drops (3-card grid) → featured products rail (horizontal scroll on mobile, 4-grid on
desktop) → editorial brand statement (60/40 asymmetric split, image + copy, alternates
side on repeat visits is out of scope for v1) → social proof rail (Instagram grid) →
email/drop waitlist capture → footer.

### Template B — Product Listing (PLP)

Used by: `/shop`, `/shop/[category]`, `/shop/[category]/[subcategory]`, `/search`,
`/account/wishlist` (list mode).

Structure: page header (title + result count + sort dropdown) → filter rail (desktop:
sticky left sidebar, `≥1024px`; mobile: bottom-sheet drawer triggered by a "Filters"
button in the header) → product grid (Template §2.2) → pagination (cursor-based
"Load more" over numbered pagination, since drop-culture catalogs are browsed, not
looked up by page number) → empty state per §3.8 when filters return zero.

Filter facets: category, size, color (swatches, not text), price range (dual slider),
availability toggle, sale toggle. Filter state is serialized to the URL query string so
filtered views are shareable and back-button-safe — this is a hard requirement, not an
enhancement (see SKILL.md §6 for the implementation contract).

### Template C — Product Detail (PDP)

Route: `/product/[slug]`.

Two-column desktop (`≥1024px`): sticky gallery left, purchase panel right. Single
column mobile: gallery (swipeable) → purchase panel → details.

Purchase panel, top to bottom: collab/drop eyebrow label (if applicable) → product name
→ rating summary (stars + review count, links to reviews anchor) → price block → color
selector (swatches, selecting swaps gallery) → size selector (chips; a chip for a
size with `available ≤ 3` gets a `--clr-danger` micro-label "Only N left"; a chip at
`available = 0` is disabled, not hidden) → quantity stepper → primary CTA (Add to Cart)
→ secondary CTA (wishlist toggle) → trust row (shipping estimate, returns window,
international shipping note) → accordion: Details / Sizing & Fit / Material & Care /
Shipping & Returns → reviews section → "You may also like" rail (Template §2.2 cards,
same category).

Stock-aware states the PDP must handle explicitly: in stock, low stock (per-size),
out of stock (per-size, per-color), fully sold out (CTA replaced with "Notify me when
back in stock" email capture), drop not yet live (CTA replaced with countdown + waitlist).

### Template D — Drop / Collab Detail

Routes: `/drops/[slug]`, `/collab/[slug]`.

Full-bleed hero (drop art/video) → drop status banner (Live / Upcoming with countdown /
Sold Out / Archive) → story block (editorial copy, 60/40 split) → product grid scoped
to that drop (Template §2.2) → related drops rail.

### Template E — Editorial / Static Content

Routes: `/about`, `/lookbook`, `/lookbook/[slug]`, `/press`, `/careers`.

Freeform editorial layout using the same type scale and spacing tokens, composed from a
CMS-driven block system (see SKILL.md §8 — Content Blocks) rather than hardcoded JSX
per page, since marketing needs to update this copy without a deploy.

### Template F — Policy / Utility Content

Routes: `/size-guide`, `/shipping-returns`, `/faq`, `/terms`, `/privacy`, `/cookies`,
`/stockists`, `/track-order`, `/gift-cards/balance`.

Single-column, max-width `65ch` reading measure, sticky in-page table-of-contents on
desktop for long documents (`/terms`, `/privacy`, `/faq`), generated from document
headings — not maintained by hand. `/size-guide` deviates with a measurement table
(cm/in toggle) plus a "how to measure" diagram instead of prose. `/track-order` and
`/gift-cards/balance` deviate with a single-input lookup form instead of static content.

### Template G — Cart

Route: `/cart`. Two-column desktop (`≥1024px`): line items left, sticky order summary
right. Stacked on mobile with summary below items but its CTA duplicated as a sticky
bottom bar so checkout is always one tap away without scrolling.

Line item: thumbnail, name, variant (size/color), quantity stepper, remove action,
line total. Order summary: subtotal, discount line (if applied) with a remove-code
action, shipping (or "calculated at checkout"), total, promo code input, primary CTA.
Progress incentive bar ("Add ₹X for free shipping") appears above the summary when
applicable, driven by a configurable threshold (SKILL.md §8, store settings).

Below the fold: "Complete the look" rail, 4 products from the same category as the
cart's contents.

### Template H — Checkout (4-step flow)

Routes: `/checkout`, `/checkout/shipping`, `/checkout/payment`, `/checkout/review`.

Shared shell: step indicator (4 segments, completed segments filled `--clr-acid`,
current segment outlined, future segments muted), order summary as a collapsed
accordion on mobile / persistent right rail on desktop (same summary component as
Cart), single primary CTA that advances the step.

- **Contact:** email (or phone for OTP), guest-checkout allowed, "have an account?
  Log in" affordance that doesn't force a redirect (opens inline).
- **Shipping:** saved-address picker for logged-in users, new-address form otherwise,
  shipping method radio group with price and ETA per option (populated live from the
  shipping-rate API, not hardcoded — see SKILL.md §5.6).
- **Payment:** payment method tabs (Card / UPI / Netbanking / Wallet / COD where
  eligible / PayPal for international), embedded Razorpay/Stripe elements, order
  summary re-confirmed above the pay button.
- **Review:** read-only recap of all three prior steps with per-step "Edit" links,
  final total, place-order CTA. This step exists specifically so the payment step
  doesn't have to also carry a full order recap next to sensitive payment fields.

### Template I — Order Confirmation / Failure

Routes: `/order/[id]/confirmation`, `/order/[id]/failed`.

Confirmation: success indicator, order number, delivery estimate, itemized summary,
"Track order" + "Continue shopping" actions, social share affordance. Failed: clear
statement of what happened (declined / timeout / cancelled), the cart is preserved
(not cleared) so the customer doesn't have to rebuild it, retry-payment CTA.

### Template J — Auth

Routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-otp`.

Centered single-column card, max-width `28rem`, on a dark ground with a muted
background image (no full hero — auth pages are utilitarian, not marketing surfaces).
`/verify-otp` uses a 6-segment code input with auto-advance and paste support.

### Template K — Account (authenticated shell)

Routes: everything under `/account/*`.

Persistent left sidebar (desktop) / top horizontal tab bar (mobile) with: Overview,
Orders, Addresses, Profile, Wishlist, Loyalty, Returns, Notifications. Sidebar shows
name, loyalty tier badge, and points balance. Each sub-page is a content region to the
right of this shell — the shell itself is a shared layout, not repeated per page.

- **Orders / Order Detail:** status timeline (Placed → Confirmed → Packed → Shipped →
  Delivered), itemized list, tracking link, invoice download, "Buy again" and
  "Return items" actions gated by order status/return window.
- **Addresses:** card grid of saved addresses, default-address indicator, add/edit/delete.
- **Profile:** name/email/phone, password change, connected login methods, account
  deletion request (compliance requirement, see SKILL.md §11).
- **Loyalty:** points balance (mono numerals), tier progress bar, points-earning-event
  history, tier benefits table.
- **Returns / New Return:** return-eligible items only (derived from order + return
  window, not user-selectable freely), reason dropdown, photo upload for
  defective-item claims, refund-method selection.

### Template L — Admin Shell

Routes: everything under `/admin/*` (34 routes).

Persistent left sidebar nav grouped by domain (Catalog, Orders, Customers, Inventory,
Marketing, Content, Settings), top bar with global search, staff avatar/role, and
notification bell. Content area uses a consistent data-table component (sortable
columns, column visibility toggle, saved filter views, bulk row actions, pagination)
across every list page (`Products`, `Orders`, `Customers`, `Discounts`, `Reviews`,
`Returns`, `Movements`), and a consistent detail/edit-form layout across every
create/edit page — this consistency is what actually differentiates a real admin
tool from a prototype: a data-table and a form-shell are each built once as shared
components, not once per page.

Sub-specs for the domain-specific screens:

- **Inventory Overview (`/admin/inventory`):** matrix table, rows = variant, columns =
  warehouse, cell = available/reserved, color-coded against the low-stock threshold
  (default state / `--clr-gold` warning / `--clr-danger` critical). Filter by
  product, warehouse, stock status.
- **Drop launch control (`/admin/drops/[id]`):** status stepper (Draft → Scheduled →
  Live → Ended/Archived) with explicit "Go Live" action requiring confirmation, since
  this is an irreversible, customer-facing action.
- **Analytics (`/admin/analytics`):** date-range picker (shared component), KPI cards
  (revenue, orders, AOV, conversion rate) above a revenue-over-time chart and a
  top-products table. Inventory valuation is a distinct sub-report, not folded into
  the general dashboard, since it's read by a different audience (finance, not
  marketing).

### Template M — System

Routes: `/404`, `/500`, `/maintenance`, `/offline`.

Minimal, on-brand, each with exactly one primary action ("Back to home" / "Retry" /
"Browse in the meantime" for offline) — no decorative complexity on error surfaces.

---

## 7. Accessibility Requirements (applies to every template above)

- All interactive elements reachable and operable by keyboard, in a logical tab order
- Visible focus indicator on every focusable element (`2px solid var(--clr-acid)`,
  `outline-offset: 2px`) — never `outline: none` without a replacement
- Every `<img>` has meaningful `alt`; decorative images use `alt=""`
- Every form input has a programmatically associated `<label>`
- Color is never the only signal (size availability uses strike-through + label, not
  color alone; order status uses text + icon, not a colored dot alone)
- Modals and drawers trap focus while open and restore focus on close
- Skip-to-content link as the first focusable element on every page
- All animation respects `prefers-reduced-motion`

---

## 8. Design QA Checklist (pre-merge, every new page)

- [ ] Built mobile-first; verified at 375px, 768px, 1024px, 1440px
- [ ] Uses only tokens from §2 — zero hardcoded color/spacing/font values
- [ ] Uses shared components from §3 — zero one-off duplicated markup
- [ ] Has a defined loading state and empty state where applicable (§3.7, §3.8)
- [ ] Keyboard-navigable end to end, focus states visible
- [ ] Passes Lighthouse Accessibility ≥ 95 and Performance ≥ 90
- [ ] No layout shift on data load (CLS < 0.1)
