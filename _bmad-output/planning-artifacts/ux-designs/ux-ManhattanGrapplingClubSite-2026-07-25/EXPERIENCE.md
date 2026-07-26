---
title: Manhattan Grapple Club — Experience Specification
status: final
created: 2026-07-25
updated: 2026-07-25
sources:
  - ../../briefs/brief-ManhattanGrapplingClubSite-2026-07-25/brief.md
  - ../../briefs/brief-ManhattanGrapplingClubSite-2026-07-25/addendum.md
  - ../../prds/prd-ManhattanGrapplingClubSite-2026-07-25/prd.md
  - ./DESIGN.md
---

# Manhattan Grapple Club — Experience Specification

Visual identity lives in [DESIGN.md](./DESIGN.md); tokens are referenced here as `{colors.gold}`, `{spacing.gutter}`, and so on. Where this document and any mock disagree, these two spines win.

## Foundation

- **Form factor:** responsive web, mobile-first. The design target is a 390×844 phone held one-handed. Desktop is a widened version of the same single page, never a different experience.
- **UI system:** none. Hand-written HTML and CSS, no framework, no build step. The draft opens directly from the filesystem.
- **JavaScript posture:** progressive enhancement only. Every fact in the PRD's Five Answers renders with JS disabled. JS adds the next-class highlight, the scroll-aware sticky bar, and nothing else load-bearing.
- **Surface count:** one page. Policy content may spill to secondary pages only if length demands it; the Five Answers never do.

## Information Architecture

One scroll, ordered by the sequence the visitor actually asks their questions — schedule, trial, cost, location, instructor — rather than by marketing-site convention.

| # | Section | Answers | Why here |
| --- | --- | --- | --- |
| 0 | Sticky header | — | Badge, "Manhattan, KS", and section navigation. Desktop shows an inline nav plus the trial CTA; below 768px both are replaced by a menu button. Always present. |
| 1 | Hero | Identity + offer | Name, discipline, city, free two-week trial, primary CTA. No scroll required. Sits over a **photograph of the actual training space** behind a measured scrim — see DESIGN.md → Photography. |
| 2 | **Schedule** | Answer 1 | The single most-wanted fact. Deliberately the first thing below the hero. Includes the next-class marker. |
| 3 | Women's BJJ | Differentiator | Attached directly beneath the schedule, where a reader who spotted the Wednesday row goes looking. |
| 4 | **Trial & Pricing** | Answers 2 + 3 | Trial explained, cost stated, then and only then the hand-off to Glofox. |
| 5 | **Location & Contact** | Answer 4 | Address, map, one-tap directions, one-tap call. |
| 6 | **Who You'll Train With** | Answer 5 | Instructor. Currently a placeholder; the slot is reserved and visible. |
| 7 | Your First Class | Beginner confidence | What to wear, what happens when you walk in. Drawn from the club's own FAQ voice. |
| 8 | Community Standards | Trust | Consent, safety, sparring etiquette — recovered from the PDFs. |
| 9 | FAQ | Residual questions | The remaining FAQ items as disclosures. |
| 10 | Footer | — | Address, socials, Glofox, copyright. |
| — | Sticky mobile CTA | — | Under 768px, docked, thumb-reachable. |

**Closure check:** every stated need has a section, and every section is reached by at least one of UJ-1, UJ-2, or UJ-3. No orphan surfaces.

## Voice and Tone

The club's existing FAQ voice is the best asset on the current site. It is warm, plain, and slightly informal — and it directly answers beginner fear. **Preserve it. Do not corporate-ify it.**

- Quote the club's own copy verbatim wherever it exists, including its quirks. "All classes are taught with beginners in mind, but Tuesday's are best!" ships exactly as written. It is a quotation of a real business, not prose to be corrected.
- Write new microcopy in that same register: second person, short sentences, no hype. "You don't need to be fit. You don't need experience. Wear something you can move in."
- Never use fight-promotion language. No "dominate", no "warrior", no "unleash". The differentiator is approachability.
- Say "Manhattan, Kansas" or "Manhattan, KS" — never bare "Manhattan", which reads as New York to anyone arriving from social.
- Never state a fact the club has not confirmed. When a fact is missing, the copy says so plainly rather than hedging around it.

## Component Patterns

Behavioral contracts; visual specs live in DESIGN.md.

| Pattern | Behavior |
| --- | --- |
| **Week** | The schedule is a **calendar, not a list**. All seven days render in Monday→Sunday order, including Friday and Saturday as explicit "Closed" cells. Showing only the five class days made the jump from Thursday to Sunday read as a gap rather than a closed weekend, which is what made the original layout confusing. Two views of the same markup: an **agenda** below 1024px (day label in a fixed left column, one row per day) and a **true seven-column grid** at 1024px and up. The grid waits for 1024px because below that a seventh of the content width is under ~95px, which cannot hold "Introduction to Grappling". |
| **Week-at-a-glance strip** | Seven compact chips — day plus start time — shown only below 1024px, where the real grid cannot fit. It carries the calendar *shape* (four weeknights, closed weekend, Sunday morning) before any reading happens. `aria-hidden`, because it restates the agenda directly beneath it and a screen reader should hear the week once, not twice. The next-class mark is mirrored onto it so both views agree. |
| **Day cell** | Static, non-interactive. Day, time, and class name are readable in one fixation. Does not link anywhere — there is nothing to link to. Rest days are quieter (transparent fill, dashed border) but never omitted: the closed weekend is information. |
| **Next-class marker** | Computed client-side from the visitor's local time. Marks exactly one day — never a rest day, which carries `data-day` so the week renders complete but is excluded from selection. Rendered as a gold left border in agenda view and a gold top border in grid view, always with the text pill. On a day with no class, marks the next chronological session. Carries the visible text "Next class", so the meaning survives colour-blindness, greyscale, and JS being off (in which case no row is marked and nothing breaks). **"On now"** replaces "Next class" when a session is currently running — the parking-lot visitor at 7:15pm on a Monday must not be told the next class is Tuesday while one is happening three miles away. Class length is assumed at 90 minutes pending confirmed end times. A row that is "next" suppresses its own static tag so two pills never stack. |
| **Primary CTA** | Appears in hero, in the pricing block, in the footer, and in the sticky bar. All four point to the same Glofox trial URL. `target="_blank"` with `rel="noopener noreferrer"`, and a visually-hidden "opens in a new tab" for screen readers. |
| **Sticky CTA bar** | Mobile only. Appears after the hero scrolls out. Hides when the footer CTA enters the viewport, so the two never stack. Respects safe-area insets. |
| **Mobile menu** | Below 768px the inline nav and header CTA are hidden, so navigation lives in a menu button (44×44) that opens a panel of all eight sections plus the trial CTA. Built on native `<details>`/`<summary>`, so it opens, closes and is keyboard operable **with JavaScript off** — the browser owns the expanded state. JS adds only the three things `<details>` has no native answer for: Escape to close, outside-tap to close, and close-on-navigate so the panel never covers the section it just jumped to. Desktop nav and mobile menu are separate DOM, each `display: none` at the other's breakpoint, so exactly one is ever in the accessibility tree. **Two traps found in the build, both verified rather than assumed:** the panel must be explicitly hidden when closed (native `<details>` hiding does not survive an absolutely-positioned `display: grid` child, so it rendered permanently over the page); and the panel's link rule out-specifies `.btn-primary` on `color`, which painted the CTA white on gold — the one banned pairing — until the selector was matched. |
| **Disclosure** | Native `<details>`/`<summary>`. Content stays in the DOM when collapsed so in-page search and crawlers find it. One may be open by default: "What do I wear to my first class?" |
| **Map** | Lazy-loaded, never blocks first paint. Accompanied by a text address and a directions link, both of which work if the embed fails to load. |
| **Placeholder** | Renders wherever a client fact is missing. States which fact is missing and who must supply it. Carries `data-placeholder` so all instances are enumerable by one query. Never silently omitted — an absent section would hide the gap. |

## State Patterns

| State | Behavior |
| --- | --- |
| **Default** | Everything renders. There is no loading state — the page is static HTML. |
| **JS disabled** | Full content, no next-class marker, no sticky bar auto-hide. Nothing is lost but convenience. |
| **Missing data** | Placeholder component. Never an empty section, never a guess, never "Coming soon" in a way that implies the fact exists. |
| **Map embed blocked** | Text address and directions link remain functional. The embed container collapses rather than leaving a broken frame. |
| **Offline / slow** | Text and layout render before any image. Images carry explicit dimensions so nothing shifts when they arrive. |
| **Reduced motion** | All non-essential motion removed. Nothing becomes unreadable or unreachable. |
| **No class today** | Schedule shows the next upcoming session marked instead. Never an empty state — the schedule is always fully rendered regardless. |

## Interaction Primitives

- **Tap** is the only required input. Nothing depends on hover, right-click, drag, or long-press.
- **Hover** states exist on pointer devices as enhancement only, gated behind `@media (hover: hover)`.
- **Scroll** is the primary navigation. Header links are same-page anchors with `scroll-behavior: smooth`, disabled under reduced-motion.
- **Focus** is fully keyboard-traversable in DOM order, with a visible 3px outline on every interactive element. A skip-to-content link is the first focusable element.
- **Tap targets** are 44px minimum, 48px for list rows and disclosures, with at least 8px between adjacent targets.

### Motion Specification

Motion supports comprehension. It is never decorative, and nothing on the critical path waits for it.

Revised after the craft review — the original durations were at or over the ceiling and read as sluggish for a visitor thumb-flicking for a class time.

| Element | Motion | Duration | Easing |
| --- | --- | --- | --- |
| Section reveal on scroll | Fade only, no translate | 220ms | `cubic-bezier(0.16, 1, 0.3, 1)` — ease-out |
| Sticky bar enter | Slide up from below | 260ms | ease-out |
| Sticky bar exit | Slide down | 180ms | ease-in |
| Disclosure chevron | Rotate 180° | 150ms | ease-out |
| Button press | `scale(0.97)` (`0.96` on `.btn-lg`) | 100ms | ease-out |
| Skip link | None — keyboard-initiated reveals are instant | — | — |
| Next-class marker | None. It is state, not an event. | — | — |

**Why the reveal lost its rise.** A 12px translate over 400ms with this easing is ~90% complete in the first 100ms and then creeps the last pixel for 300ms — the tail is the perceived sluggishness. A fast scroll outruns it and the visitor sees sections still fading as they pass. Opacity-only at 220ms survives a flick.

**Rules, and these are enforced at review:**
- Enters use ease-out; exits use ease-in and are always *faster* than their enter. Things arrive gently and leave decisively.
- Transform and opacity only. Never animate `width`, `height`, `top`, `left`, or anything that triggers layout.
- Nothing exceeds 400ms.
- Scroll-reveal must be self-healing: if the observer never fires, content is visible anyway. Content is visible by default and the animation is additive — never `opacity: 0` with JS required to restore it.
- `@media (prefers-reduced-motion: reduce)` removes reveals and press-scales, keeps instantaneous state changes, and disables smooth scrolling.

## Accessibility Floor

Non-negotiable, and verified at review rather than asserted.

- One `<h1>`. Heading levels descend without skipping.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>` with accessible names, `<footer>`.
- All interactive elements reachable and operable by keyboard, in a sensible order.
- Visible focus indicator on every interactive element — never `outline: none` without a replacement.
- Contrast meets WCAG AA: 4.5:1 body, 3:1 large text. The measured pairs in DESIGN.md are binding.
- No information carried by colour alone. The next-class marker is the test case: it has a text label.
- The badge image has a real `alt`; purely decorative images have `alt=""`.
- The map iframe has a `title`.
- `lang="en"` on `<html>`. Correct viewport meta with no `maximum-scale` and no `user-scalable=no` — pinch zoom must work.
- Touch targets 44px minimum.
- `prefers-reduced-motion` honored.

## Responsive & Platform

| Width | Layout |
| --- | --- |
| 320px | Floor. Single column, reduced gutters. Must not break or scroll horizontally. |
| 390px | **Design target.** Single column, 20px gutters, sticky CTA visible. |
| 768px | Location goes map-beside-text. Sticky CTA disappears — the header CTA is always visible at this width. Schedule stays in agenda view. |
| 1024px | **Schedule becomes the seven-column week grid** and the glance strip is retired. Content centres, max-width engages. |
| 1280px+ | Capped at 1120px with generous side space. Never full-bleed text. |

- iOS safe-area insets respected on the sticky bar and footer.
- `-webkit-tap-highlight-color` set deliberately rather than left to the browser default.
- Form inputs, if any, use 16px minimum font-size to prevent iOS zoom-on-focus.
- Test matrix: iOS Safari, Android Chrome, desktop Chrome, desktop Safari.

## Content Integrity Behavior

An invented section, because this project's dominant risk is not a UX failure — it is publishing a false fact about a real business.

- Every factual claim traces to the addendum's Verified sections or to a client-supplied fact.
- Missing facts render as the Placeholder component. Visible, ugly, and labelled.
- **Specifically forbidden without client confirmation:** any price, any phone number, any email, any instructor name or belt rank, any lineage or affiliation, any testimonial, any star rating, any class end time.
- **Named trap:** the three policy PDFs carry a personal name in their author metadata *(redacted from this repository)*. That is a Canva account name, not evidence of who owns or teaches at the club. It must not appear on any rendered page.
- **Second named trap:** CrossFit 785 / 785 Athletics shares the street address and has a published phone and email. Those belong to a different business and must never be rendered as the club's contact details.
- The draft ships with a command that enumerates every outstanding placeholder, so nothing goes live by being forgotten.

## Key Flows

Mirrors the PRD's UJ IDs verbatim.

**UJ-1. Marcus checks from the parking lot.**
1. Arrives from a Google Maps listing, 6:40pm Tuesday, phone in hand.
2. Hero confirms in one glance: Manhattan Grapple Club, Brazilian Jiu-Jitsu, Manhattan KS.
3. Scrolls once. The schedule is right there, and the Tuesday row carries a gold "Next class" marker.
4. **Climax:** he learns a class starts in twenty minutes without a single navigation click.
5. Taps "Get directions", which opens his maps app with the club as destination.
6. **Resolution:** he trains that night. *Edge case:* had it been Friday, the Sunday Open Mat would carry the marker instead — never an empty schedule.

**UJ-2. Danielle needs to know it's really women-only.**
1. Arrives from an Instagram story, unhurried, sceptical.
2. Scrolls past the schedule, registers the Wednesday row, and lands on the Women's BJJ block — a real section, not a table row.
3. Continues to "Who You'll Train With" looking for a name and a face.
4. Continues to Community Standards and finds explicit language: consent is non-negotiable, anyone may refuse a roll, zero tolerance for harassment.
5. **Climax:** the combination of a women-only space and a published, unambiguous conduct standard is what converts her — not the price and not the schedule.
6. **Resolution:** taps the sticky trial CTA. *Current gap:* step 3 renders a placeholder today. This is the highest-value client input outstanding, and step 4 is doing the trust work in its absence.

**UJ-3. Trevor wants the price before he commits.**
1. Arrives from a search, K-State sophomore, tight budget, wary of hidden pricing.
2. Scrolls to Trial & Pricing.
3. Reads that the first two weeks are free, and — once the client supplies numbers — what membership costs after that.
4. **Climax:** the price is on the page, before any hand-off.
5. **Resolution:** taps through to Glofox already knowing the number. *Current gap:* renders a placeholder today. Until it is filled, this journey completes only partially, and that is stated on the page rather than hidden.
