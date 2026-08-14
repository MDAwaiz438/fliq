# FLIQ — Craft & Motion Direction (Award-Tier Layer)

Reference: `DESIGN.md` for tokens and templates, `SKILL.md` for the motion/3D stack
(§2). This document exists because a well-built e-commerce site and an Awwwards-caliber
one diverge in exactly three places: **the first 3 seconds** (load/intro), **the
signature moment** (the one thing nobody else's streetwear site has), and **the texture
of every small interaction** (cursor, transitions, hover, scroll feel). Everything else
— the 88 routes, the checkout flow, the inventory system — needs to be *correct*.
These three things need to be *memorable*. This doc is scoped to them specifically so
that ambition doesn't leak into the 80 utility pages where it would just become noise
and hurt conversion.

**Hard rule that governs everything below:** craft is spent on Home, PDP, and Drop
pages. Checkout, account, and admin get restraint and speed, not spectacle — nobody has
ever left a 5-star review for a beautiful shipping-address form, and friction at
checkout costs revenue in a way friction on the homepage doesn't. Judges evaluate the
front-of-house; customers complete purchases through the back-of-house. Build both, but
don't confuse which one gets the WebGL budget.

---

## 1. What "Award-Tier" Actually Means Here

Not: more animation everywhere. Sites that stack effect on effect read as AI-generated
or template-driven — the opposite of what wins. Award-tier means:

1. **One real idea, executed with precision** — not five ideas executed at 70%.
2. **Motion that's driven by the content**, not decorating it — a garment image
   distorting like the "DISTORTION" wordmark in the source brand asset is on-brief;
   a generic parallax blob is not.
3. **A load sequence that sets tone before any content is visible** — judges and
   first-time visitors form a verdict in the first 2–3 seconds, before scrolling.
4. **Restraint everywhere else** — the signature moment reads as intentional specifically
   *because* the surrounding pages are disciplined, not because everything is loud.

---

## 2. Signature Element (the one thing FLIQ is remembered for)

**Direction: "Distortion Reveal."** Drawn directly from the source brand asset — the
"DISTORTION" wordmark on Drop 03 is already rendered as a warped/glitched typographic
mark. That's not just a drop name, it's a latent interaction language nobody has
extracted from the brief yet. Build it as the site's core interaction primitive:

- **Hero load:** the FLIQ wordmark and hero garment image enter in a distorted/glitched
  state (RGB channel-split, slight vertical displacement, scanline noise) and resolve to
  sharp focus over ~1.2s as a WebGL shader pass settles — implemented as a custom
  fragment shader in React Three Fiber applied to a plane textured with the hero image,
  not a CSS filter (CSS filters can approximate this crudely but the channel-split/
  displacement effect needs per-pixel shader control to look intentional rather than glitchy-broken).
- **Product image hover (PDP gallery, product cards on hover):** a subtle, fast
  version of the same distortion triggers on interaction start and settles — this
  turns "distortion" from a one-time hero gimmick into a recognizable brand touch that
  shows up everywhere the customer engages with product imagery, at an intensity low
  enough (≈15% of the hero's magnitude, ~200ms settle) that it reads as tactile
  feedback, not a repeated spectacle.
- **Drop countdown → live transition:** when a drop's status flips from Upcoming to
  Live (either on page load if already live, or live via a websocket/poll if the user
  is on the page at the exact moment), the drop hero runs the full distortion-reveal
  again — this is the one moment worth spending the effect's full intensity on
  repeatedly, since a drop going live is inherently a "moment."

This is the single WebGL surface in the whole site. It is not reused as generic
decoration on the About page, footer, or checkout — a signature effect that appears
everywhere stops being signature.

**Fallback:** the shader requires WebGL; on unsupported devices/browsers or when
`prefers-reduced-motion: reduce` is set, the same reveal is approximated with a CSS
`clip-path` + `filter: hue-rotate` keyframe sequence at a fixed, shorter duration — same
narrative beat (distorted → resolved), lower fidelity, zero dependency on WebGL support.
This fallback is not an afterthought; it's built and reviewed alongside the shader
version, not bolted on after launch.

---

## 3. Load & Intro Sequence

Applies to first visit in a session only (stored in `sessionStorage`, not shown on
every route change or repeat visit within the session — repeat-visit intros are the
single most common Awwwards complaint in site feedback, because they punish return
users for engaging).

Sequence (\~1.6s total, skippable via a visible "Skip" affordance appearing after 400ms
for accessibility and impatient users):

1. `0–200ms`: pure `--clr-onyx` light frame (`#FAFAFA`), wordmark fades in at 40% opacity, static/noise texture
2. `200–900ms`: distortion-reveal shader resolves the wordmark and a hint of hero
   imagery underneath from noise to sharp (per §2)
3. `900–1400ms`: wordmark holds, tagline ("RAW. EDGE. NOW.") types/reveals via clipped
   mask, current-drop label fades in beneath it
4. `1400–1600ms`: entire intro layer fades and the actual Home route content, already
   fully loaded behind it, is revealed — the intro masks load time, it does not cause it

**Critical constraint:** the intro sequence must never be the thing users are waiting
on. Real page content and critical assets load in parallel behind the intro (not
triggered by intro completion), so a slow network doesn't extend the intro — if content
isn't ready when the intro finishes, the intro holds its final resolved frame rather
than either stalling early or revealing an empty page.

---

## 4. Scroll Choreography

Lenis provides the smooth-scroll physics; GSAP ScrollTrigger reads scroll position off
Lenis (not the native scroll event) so animation timing stays frame-accurate.

- **Home:** section transitions are not just fade-on-enter — each section has one
  deliberate scroll-tied move (hero image scales down slightly as the ticker strip
  slides up beneath it; the drop-cards section's cards stagger in with a slight
  x-offset that mirrors the distortion motif — displacement settling into place, not a
  generic fade+translateY). This is choreography, not a checklist of "add fade-in to
  every section" — a section only gets a scroll-tied treatment if it has something
  specific to say with it; the email-capture and footer do not, and load in with a
  simple, fast fade per `DESIGN.md` §2.5 defaults.
- **PDP:** the gallery does not scroll-animate — a PDP is a decision-making surface,
  and scroll-tied gallery effects fight the customer's ability to actually study the
  product. Motion here is confined to the micro-interaction hover distortion (§2) and
  a fast, standard section reveal on the accordion/reviews content below the fold.
- **Drop/Collab pages:** the hero can run a longer, cinematic scroll-tied sequence
  (image pins and slowly reveals a second layer of detail photography as the user
  scrolls through the story block) since these are narrative pages by design, not
  transactional ones — this is where "editorial" and "spectacle" are allowed to
  overlap.

Every scroll-tied animation is authored with an explicit start/end scroll range and a
`scrub` value (tied to scroll position, not autoplaying independent of it) so it never
runs ahead of or lags behind what the user is actually doing.

---

## 5. Micro-Interactions & Cursor

- **Custom cursor** (desktop, pointer-fine devices only — never faked on touch):
  a small dot that scales up and inverts color (`--clr-acid` ring) when hovering any
  interactive element, and morphs into a text label ("VIEW", "DRAG", "CLOSE") when
  hovering a product image, gallery thumbnail strip, or modal-close target respectively
  — the cursor communicates affordance rather than just following the pointer for its
  own sake.
- **Add-to-cart feedback:** the product image briefly runs the low-intensity distortion
  pulse (§2) simultaneously with the cart icon's item-count badge incrementing —
  cause and effect are visually linked in one glance rather than a generic toast alone
  (the toast still fires per `DESIGN.md` §3.6, this is additive confirmation on the
  triggering element itself).
- **Page transitions:** route changes between storefront pages use a shared Framer
  Motion transition — outgoing content fades and shifts down slightly, incoming
  content's hero element runs a fast (400ms) version of the distortion-reveal rather
  than a plain fade, so navigating *feels* like the brand rather than like a generic
  Next.js route change. Checkout steps explicitly opt out of this (§ hard rule above)
  and use a fast, plain slide consistent with `DESIGN.md` Template H.
- **Magnetic buttons:** primary CTAs on Home/Drop/Collab heroes have a subtle magnetic
  hover (button shifts a few px toward the cursor within its hit area). Not applied to
  utility buttons (form submits, quantity steppers, admin) — magnetic effects on
  functional/frequent-use controls read as sluggish rather than delightful.

---

## 6. Typography as Motion

Beyond the static type system in `DESIGN.md` §2.2:

- Hero and section headlines split into words (not characters — character-level split
  animation on Bebas Neue at display size reads as noisy given how condensed the
  typeface already is) and reveal with a clipped-mask rise, timed via GSAP, on first
  scroll-into-view only (not repeating on every re-entry into viewport).
- The drop countdown timer (`--font-mono`) uses a per-digit flip/roll transition on
  change rather than an instant re-render — small detail, but numeric instability
  (digits just snapping) is one of the fastest tells of an unpolished build.

---

## 7. Performance Budget (non-negotiable guardrail)

Award judging and Core Web Vitals are not actually in tension if this is respected —
sites that lose Awwwards points on performance usually skipped this step, not because
craft and speed are inherently opposed:

| Constraint | Budget |
|---|---|
| WebGL shader — active surfaces at once | 1 (the hero/signature element only; never stack a second WebGL canvas elsewhere on the same page) |
| Total JS for motion/3D libraries, gzipped | < 180kb, code-split so PDP/Cart/Checkout/Admin never load Three.js or GSAP's scroll plugin at all |
| LCP with intro sequence active | < 2.8s (intro must not push LCP past this; real hero image is the LCP element and loads regardless of intro state) |
| Frame rate during scroll choreography | 60fps on mid-tier mobile (test device: a 3-year-old mid-range Android, not just a dev machine) — if a scroll effect drops below this on the test device, simplify the effect, don't ship it and hope |
| `prefers-reduced-motion: reduce` | Every effect in this document has a defined reduced-motion fallback (static equivalent, not "just remove it and leave a blank gap") — enumerated per-effect in §8 |

`react-three-fiber` and GSAP are lazy-loaded (`next/dynamic`, `ssr: false`) and scoped
to exactly the routes that use them (Home, PDP, Drop, Collab) — every other route in
the 88-route sitemap ships zero bytes of this layer.

---

## 8. Reduced-Motion & Fallback Matrix

| Effect | Reduced-motion / fallback behavior |
|---|---|
| Load intro (§3) | Skips straight to resolved final frame, no animated sequence, ~200ms simple fade |
| Distortion-reveal hero (§2) | Static resolved image, no shader pass |
| Product hover distortion (§2) | Simple `1.02` scale on hover, no displacement |
| Scroll choreography (§4) | Sections appear via simple opacity fade on enter, no pinning/scrubbing |
| Page transitions (§5) | Instant route change, no shared transition |
| Magnetic buttons (§5) | Standard hover state only, no cursor-following offset |
| Word-reveal headlines (§6) | Headlines render fully visible immediately |
| Countdown digit flip (§6) | Instant text update |

This matrix is a build requirement, not a nice-to-have — every row above is implemented
before the corresponding effect is considered done, per the craft QA checklist below.

---

## 9. Craft QA Checklist (Home, PDP, Drop/Collab only)

- [ ] Signature distortion effect looks identical in direction/character across hero,
      product hover, and drop-live transition — one motif, three touchpoints, not three
      unrelated effects that happen to share a name
- [ ] Load intro tested on a throttled 3G profile — never blocks or extends real content load
- [ ] Load intro does not replay on repeat visits within a session
- [ ] Scroll choreography tested at 60fps on the mid-tier Android benchmark device
- [ ] Every effect in §8's matrix verified under `prefers-reduced-motion: reduce`
- [ ] Custom cursor disabled/absent on touch devices (verified via pointer-media-query, not UA sniffing)
- [ ] WebGL canvas count on any single page never exceeds 1
- [ ] Motion/3D bundle confirmed absent from Checkout, Account, and Admin network payloads
- [ ] Lighthouse Performance ≥ 90 on Home and PDP with the full craft layer active (not
      measured with effects disabled — the budget in §7 exists so this passes with them on)
