---
title: Manhattan Grapple Club — Visual Identity
status: final
created: 2026-07-25
updated: 2026-07-25
sources:
  - ../../briefs/brief-ManhattanGrapplingClubSite-2026-07-25/brief.md
  - ../../briefs/brief-ManhattanGrapplingClubSite-2026-07-25/addendum.md
  - ../../prds/prd-ManhattanGrapplingClubSite-2026-07-25/prd.md
colors:
  ink: "#0B0B0C"
  slate: "#17171A"
  charcoal: "#232328"
  gold: "#FDB71B"
  goldHi: "#FFC53D"
  goldDim: "#C98F14"
  red: "#E81D2E"
  redHi: "#FF4D5A"
  bone: "#F7F5F1"
  white: "#FFFFFF"
  muted: "#A3A3AD"
  hairline: "rgba(255,255,255,0.10)"
typography:
  display: "system-ui, -apple-system, 'Segoe UI Variable Display', 'Segoe UI', Roboto, sans-serif"
  body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  scaleRatio: 1.25
  displayTracking: "-0.02em"
  eyebrowTracking: "0.14em"
rounded:
  none: "0px"
  sm: "6px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  base: "4px"
  gutter: "20px"
  sectionY: "clamp(56px, 10vw, 112px)"
  maxWidth: "1120px"
components:
  buttonPrimary: "gold fill, ink label, pill, 52px tall"
  buttonSecondary: "transparent fill, gold hairline border, gold label"
  card: "slate surface, hairline border, rounded.md"
  stickyCta: "ink bar, gold primary button, safe-area aware, mobile only"
---

# Manhattan Grapple Club — Visual Identity

## Brand & Style

The badge is the brand. A black-ringed circular crest with a gold sunburst and two red stars — vintage athletic-club heraldry, not modern MMA aggression. The design system extends that badge outward rather than decorating around it.

**The feeling:** a serious gym that is genuinely easy to walk into. Confident, not intimidating. The visual language is heavy black, one loud gold, and disciplined restraint everywhere else. It should look like a club with standards, not a fight promotion.

**Voice of the visuals:** high contrast, generous space, big legible type, no gradients-as-decoration, no drop shadows pretending to be depth. Where the current site is a beige template, this is black-and-gold and unmistakable.

**Dark-first, and for a measured reason.** Gold on white measures 1.76:1 contrast — unusable for text. Gold on near-black measures 11.21:1. The palette itself forces a dark foundation, which happens to suit both the badge and the sport. Light (`bone`) surfaces are used deliberately, for long-form reading sections only.

## Colors

Sampled from the badge's actual pixels, not approximated.

| Token | Value | Role |
| --- | --- | --- |
| `ink` | `#0B0B0C` | Primary surface. The page background. |
| `slate` | `#17171A` | Raised surface — cards, schedule rows. |
| `charcoal` | `#232328` | Third level — hover states, insets. |
| `gold` | `#FDB71B` | The one loud colour. Primary CTA fill, next-class marker, key numbers. |
| `goldHi` | `#FFC53D` | Hover fill for the primary button. A real colour swap, not a `filter: brightness()` — filters force a compositing layer and re-raster the label every frame on mid-tier Android GPUs. |
| `goldDim` | `#C98F14` | Gold that must sit on a light surface (borders, icons only — never text). |
| `red` | `#E81D2E` | Rare accent. The badge stars, and the placeholder border. **Borders and large text only.** |
| `redHi` | `#FF4D5A` | Red that is legible **as text** on `charcoal` — 4.81:1. Required for the placeholder label. |
| `bone` | `#F7F5F1` | Light reading surface for policy and FAQ sections. |
| `white` | `#FFFFFF` | Primary text on dark. |
| `muted` | `#A3A3AD` | Secondary text on dark. |
| `hairline` | `rgba(255,255,255,0.10)` | Borders and dividers on dark. |

**Measured contrast — these numbers are binding:**

| Pair | Ratio | Use |
| --- | --- | --- |
| `ink` on `gold` | 11.21 | **The primary button.** Gold fill, black label. |
| `gold` on `ink` | 11.21 | Gold text, dark surface only. |
| `white` on `ink` | 19.67 | Body text. |
| `muted` on `ink` | 7.87 | Secondary text. |
| `white` on `slate` | 17.89 | Body text on cards. |
| `gold` on `slate` | 10.19 | Gold text on cards. |
| `ink` on `bone` | 18.07 | Body text in light reading sections. |
| `red` on `white` | 4.52 | Passes body, only just. Prefer for large text. |
| `red` on `ink` | 4.35 | **Large text only.** Fails body-size contrast. |
| `red` on `slate` | 3.96 | **Large text only.** |
| `red` on `bone` | 4.15 | **Large text only.** |
| `red` on `charcoal` | **3.46** | **Non-text only.** This is the placeholder's background pairing — see the trap below. |
| `redHi` on `charcoal` | 4.81 | Passes as text. Use this for the placeholder label. |
| `goldDim` on `bone` | **2.60** | **Non-text only.** Borders and icons; never a letterform. |
| `gold` on `white` | **1.76** | **Banned.** Never gold text on a light surface. |

Every ratio above was computed against the actual token values, not estimated.

**A trap this spec originally fell into.** The binding figure for red was measured against `ink`, but the placeholder component sits on `charcoal`, where red drops to 3.46:1. The label is 16px bold — and WCAG's "large text" exemption for bold starts at 18.66px, so 16px bold needs the full 4.5:1 and fails. The first build shipped it anyway, with a code comment asserting an exemption that does not exist. **Measure against the surface the text actually sits on, not the page background.**

**Rules:**
- Gold is a *fill* colour on light contexts and a *text* colour on dark contexts. Never the reverse.
- Red never carries meaning alone and never fills a large area. It is a spark, not a surface.
- Every state (next class, focus, error) must be legible with colour removed entirely.

## Typography

Both roles use the system stack, which costs zero network requests and renders natively on every target device. Weight 800 throughout the display role — a weight the system faces genuinely have, so nothing is ever synthesised.

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Hero H1 | display | `clamp(38px, 9vw, 76px)` | 800 | `-0.02em` | Title |
| Section H2 | display | `clamp(28px, 6vw, 44px)` | 800 | `-0.02em` | Title |
| Card H3 | display | `clamp(19px, 4.5vw, 23px)` | 800 | `-0.01em` | Title |
| Eyebrow | body | `12px` | 700 | `0.14em` | UPPER |
| Body | body | `clamp(16px, 4vw, 18px)` | 400 | `0` | Sentence |
| Small | body | `14px` | 400 | `0` | Sentence |
| Time / day | display | `clamp(15px, 4vw, 17px)` | 800 | `0.02em` | UPPER |

- Body line-height 1.6; display line-height 1.05.
- Measure capped at 68 characters in reading sections.
- Minimum rendered body size on mobile is 16px — never smaller, both for readability and to stop iOS zooming forms.

**Display face resolved (revised after craft review).** The spec originally named `Archivo Black`, which nothing loaded — so every visitor got the fallback, and the fallback stack had no `system-ui`. On iOS that lands on Helvetica Neue, which stops at Bold (700); requesting 900 triggered **synthetic bolding** and smeared every heading on the dominant device for a Maps-referred visitor. Archivo Black is also a single-weight family that registers as 400, so 900 would have synthesised even when it *did* load.

The display role now uses the system stack at weight **800** — SF Pro, Roboto and Segoe all ship real heavy weights, so nothing is synthesised, there is no webfont request, and the draft stays network-free. `font-synthesis-weight: none` makes any future failure visible rather than silent. If a distinctive face is ever wanted, self-host woff2 with `font-display: swap` and set `font-weight: 400`.

## Layout & Spacing

- 4px base unit. All spacing is a multiple.
- Page gutter 20px on mobile, 32px from 768px up.
- Section rhythm `clamp(56px, 10vw, 112px)` vertical.
- Content max-width 1120px; reading columns capped at 68ch regardless.
- **Breakpoints:** 320 (floor), 390 (design target), 768 (tablet), 1024, 1280 (cap).
- Mobile is one column, always. The first two-column layout appears at 768px, and only for the schedule and location blocks.
- Nothing may exceed the viewport width at 320px. No horizontal scroll at any breakpoint, ever.

## Elevation & Depth

Depth comes from surface value, not from shadows.

- Level 0 — `ink`, the page.
- Level 1 — `slate` + `hairline` border. Cards, schedule rows.
- Level 2 — `charcoal`. Cards that sit on a `slate` section, plus hover and active states.
- **Cards always lift off their ground, never punch into it.** A card on `ink` is `slate`; a card on `slate` is `charcoal`. Direction consistency is the whole depth model on a near-black UI.
- Shadows are used in exactly one place: the sticky mobile CTA bar, which needs to separate from scrolling content. `0 -8px 24px rgba(0,0,0,0.45)`.
- No shadow is ever used to fake a border on a dark surface — that is what `hairline` is for.
- **No `backdrop-filter` anywhere.** The header and sticky bar originally blurred their backdrops at 0.92–0.96 alpha over `#0B0B0C` — there is nothing visible to blur, but a full-width filter re-composites on every scroll frame, which is the most reliable source of jank on mid-range Android. Raised alphas to 0.97/0.98 instead.
- **No `drop-shadow()` on the badge.** A black shadow on a near-black ground is invisible, but it forces an alpha-blur of the source bitmap on first paint, above the fold.

## Shapes

- Cards and inputs: `rounded.md` (12px).
- Buttons and tags: `rounded.pill`.
- The badge stays circular and is never cropped, masked, or placed on a busy background.
- Image containers: `rounded.lg` (20px).
- Section dividers are 1px `hairline` rules, not decorative shapes.

## Components

| Component | Spec |
| --- | --- |
| **Primary button** | `gold` fill, `ink` label, pill, min-height 52px, horizontal padding 28px, weight 800. Hover: brightness 1.06. Active: scale 0.98. Focus: 3px `white` outline at 2px offset. |
| **Secondary button** | Transparent fill, 1px `gold` border, `gold` label, same metrics as primary. |
| **Day cell** | `slate` surface, `hairline` border, 12px radius. Day label in display caps, time in `gold`, class name as H3, description in `muted`. Not interactive — there is nowhere for a day to link to, so it is not styled as though there were. |
| **Rest day cell** | Transparent fill, dashed `hairline` border, all text `muted`. Present but quiet: a closed weekend is information, not an omission. |
| **Week grid** | Seven equal columns at 1024px+, cells stretched to equal height, day names in a tinted header bar. Below 1024px the same markup renders as an agenda. See EXPERIENCE.md → Component Patterns. |
| **Glance chip** | Compact day + time, seven across, below 1024px only. `slate` fill, or transparent-dashed when closed, or solid `gold` with `ink` text when it is the next class. |
| **Next-class marker** | `gold` pill with `ink` text reading "Next class". Accompanied by a 3px `gold` left border on the row. Always paired with the text label — never colour alone. |
| **Women's BJJ block** | Full-bleed `slate` panel with a `gold` hairline top border. Distinct from schedule rows to signal it is an offering, not a row. |
| **Price card** | `slate` surface, price in display at 44px `gold`, term in `muted` beneath. |
| **Placeholder** | `charcoal` fill, 2px dashed `red` border, `red` uppercase eyebrow reading "NEEDS CLIENT INPUT", body text naming the missing fact. Carries `data-placeholder`. Deliberately ugly — it must never be mistaken for finished design. |
| **Disclosure (FAQ)** | Native `<details>`/`<summary>`. Chevron rotates 180°. Full row is the tap target, min 48px. |
| **Sticky CTA bar** | Mobile only, under 768px. `ink` background, `hairline` top border, one primary button. Respects `env(safe-area-inset-bottom)`. Hidden when the footer CTA is on screen. |
| **Badge lockup** | Badge + wordmark. Badge min 40px in the header, 96px+ in the hero. |

## Do's and Don'ts

**Do**
- Put `ink` text on `gold` fills. That is the highest-contrast, most on-brand combination available.
- Let black dominate. Gold earns its impact by being rare.
- State "Manhattan, Kansas" in full at least once above the fold.
- Keep every tap target at 44px minimum, 48px for list rows.
- Use the real badge at generous size. It is the best asset the club owns.

**Don't**
- Don't set gold text on white or bone. It measures 1.76:1 and is unreadable.
- Don't use red for more than small accents, and never as the only signal.
- Don't add gradients, glows, or glass effects. The badge is flat; the system stays flat.
- Don't use stock photography of people and imply they train here.
- Don't fill a placeholder to make a mock look finished.
- Don't let any element rely on hover — the primary device has no cursor.

## Photography

Real photographs of the actual gym and actual members. No stock imagery of people, ever — the whole trust argument collapses if the faces aren't real.

| Slot | Image | Treatment |
| --- | --- | --- |
| Hero background | The training space | Full-bleed, `object-fit: cover`, `object-position: 50% 68%` so portrait phones crop to the mat and floor rather than the ceiling ductwork. Behind a scrim (below). The LCP element: eager, `fetchpriority="high"`, and the only image on the page that claims that priority. |
| Women's BJJ | A class in progress | Portrait 3:4, beside the copy from 900px. |
| Coach | Coach Hunter | Portrait 3:4, captioned. |

**The hero scrim is load-bearing, not decoration.** The hero sets white and gold text over a photo containing bright ceiling strip-lights and a mid-blue mat. The scrim is a stacked linear + radial gradient tuned by *measurement*: the page is rendered with the hero text hidden, screenshotted, and the **brightest pixel** in each text block's bounding box is sampled and checked against that text's colour.

Worst-case results at the two reference widths:

| Text | Colour | 390px | 1280px | Needs |
| --- | --- | --- | --- | --- |
| Eyebrow (12px bold) | `gold` | 8.58 | 5.85 | 4.5 |
| H1 | `white` | 10.98 | 9.76 | 3.0 |
| H1 gold span | `gold` | 6.05 | 6.13 | 3.0 |
| Lede | `#EDEDF0` | 8.46 | 10.94 | 4.5 |
| Fact chips | `#E2E2E7` | 13.89 | 13.33 | 4.5 |
| Secondary CTA | `gold` | 8.83 | 8.84 | 4.5 |

Two findings worth keeping:

1. **Gold is the binding constraint**, not white. The 12px gold eyebrow failed at 4.17 on the first lighter scrim while every white element passed comfortably. Tune the scrim against the gold, and the rest follows.
2. **Hero body copy moved off `--muted` to near-white.** Mid-grey text has almost no contrast headroom over a photograph — holding `--muted` would have forced the scrim so dark the photograph disappeared entirely, which defeats the point of having one. Lifting the text is what buys the picture its visibility.

Hero photos are encoded at low quality (~0.62) precisely *because* they sit behind a heavy scrim — compression artefacts are invisible there, and the mobile hero lands at 44KB.

### Link card `[RETIRED — spec kept, not instantiated]`

Full-row hit area, its own surface, gold display title, and a gold arrow that translates 4px on hover (pointer devices only). Built for the Women's BJJ → Community Standards hand-off, then **removed at the client's request** along with its supporting line: the section reads better as a short, warm invitation with nothing asking to be clicked. Its CSS has been deleted from `styles.css` rather than left as dead code; the spec stays here so the component can be rebuilt deliberately if a future section needs it.

**Two traps it left behind, both worth keeping:**
- `.linkcard-title:last-of-type` does not select the title — the arrow is also a `<span>`, so the title is never the last of its type. Use `:has(+ .sub)` to condition spacing on a following sibling instead.
- Consent and zero-tolerance language belongs in Community Standards, where the reader has opted in to reading rules. Surfacing it as a teaser under a welcoming section inverts the intent and reads as a warning.

### A recurring specificity trap in this stylesheet

Three components have now shipped broken because a **variant class lost to a base descendant selector**:

| Variant | Lost to | Symptom |
| --- | --- | --- |
| `.menu-cta` (0,1,0) | `.menu-panel a` (0,1,1) | CTA painted white-on-gold — the banned 1.76:1 pairing |
| `.photo-chip` (0,1,0) | `.photo figcaption` (0,1,1) | Gold time chip rendered as the default grey caption bar |
| `.std-list li` grid | — | (different bug: grid container shredded inline text) |

**Rule going forward:** when adding a variant class to an element that a descendant selector already styles, match or exceed that selector's specificity — `.photo figcaption.photo-chip`, not `.photo-chip`. Computed-style checks catch these; static review of the CSS does not.

---

# Direction change: CollegiateClub (2026-07-25)

**This section supersedes the Typography, Shape, Elevation and Components sections above.** Colour, contrast discipline, photography and motion rules carry over unchanged. The earlier sections are kept because they document real traps that still apply.

Source: the *Manhattan Grapple Club Design System* Claude Design project → `templates/collegiate-club/CollegiateClub.dc.html`. Sections and content are unchanged; only style is new.

## What defines this direction

1. **Archivo Black display, Archivo body**, both from Google Fonts.
2. **Hard corners.** Every radius is `0`. Photos keep the only radius in the system and it is **2px** — enough to soften a hard crop, not enough to read as a "card". The badge stays circular.
3. **Gold as structure, not decoration.** A **6px** gold rule under the header, under the hero, under every section heading, and above the final CTA. Gold is a rule and a fill, never a flourish.
4. **Numbered section headers.** `01`–`07` in gold display type, an uppercase heading, an optional right-aligned note, all sitting on the 6px rule.
5. **The panel grid.** The structural device: a parent with `gap: 2px; background: var(--hairline-2); border: 2px solid var(--hairline-2)` and children carrying an opaque background. The gap *becomes* the hairline. Used for the week board, the trial duo, the standards list, do/don't, hygiene, the steps and the FAQ.
6. **Numeral-forward.** 34px gold class times with a small meridiem, `clamp(64px, 8.4vw, 104px)` for "FREE", `decimal-leading-zero` counters throughout.
7. **Uppercase everywhere in display**, with negative tracking (`-0.03em`) and sub-1 line-height (`0.94`).

## The Archivo Black weight rule

**Archivo Black is a SINGLE-WEIGHT family that registers as 400.** `--weight-display: 400`, and it must never be raised. Requesting 700/800/900 from it triggers synthetic bolding — the exact failure the earlier system-stack build hit from the opposite direction. `font-synthesis-weight: none` makes any regression visible rather than silent. Archivo (the body face) *is* a real variable family, so 400/500/600/700 are all genuine there.

## Accepted trade-off: the site is no longer network-free

The previous build deliberately used only system fonts so the draft needed no network at all. This direction is defined by Archivo Black, so the page now makes a Google Fonts request. Mitigated with `preconnect` on both font hosts and `display=swap`, so text paints immediately in the fallback and swaps. **If offline-capability matters more than the typeface, self-host both faces as woff2 and drop the third-party request.**

## Two AA failures inherited from the template, and fixed

The template's closed-day greys do not meet the system's own binding contrast rules:

| Element | Template value | Measured | Fixed to | Now |
| --- | --- | --- | --- | --- |
| "CLOSED" text | `#4E4E58` on ink | **2.39:1** | `#7C7C87` | 4.77:1 |
| Rest-day header label | `#6A6A74` on a 3% wash | **3.50:1** | `#82828D` | 4.93:1 |

"CLOSED" is not decoration — it tells a visitor not to turn up on a Friday. Both replacements are the quietest values that clear 4.5:1 on *both* the page background and the wash the header sits on, and both stay visibly quieter than `--muted` (7.87:1).

## Hero art-direction pair

Two crops, swapped on **geometry rather than a round breakpoint**: the 4:3 landscape asset only gains vertical overflow — and therefore only responds to `object-position` — once its container exceeds `720 × 1.333 = 960px`. Below that the full frame renders and the hero is mostly ceiling and ductwork. The swap is at **1024px** (960 plus margin), and a dedicated 3:4 portrait crop takes over.

## Specificity trap, fourth instance

`.hero-bg img { display: block }` is (0,1,1) and out-specified `.hero-portrait { display: none }` (0,1,0) — so **both hero crops rendered, stacked on each other**, at every width. The computed-style check caught it; reading the CSS did not. Selectors are now `.hero-bg img.hero-portrait`.

That makes four: `.menu-cta`, `.photo-chip`, `.hero-portrait`, and the earlier `.std-list li` grid bug. **The rule stands: a variant class on an element a descendant selector already styles must match or exceed that selector's specificity.**
