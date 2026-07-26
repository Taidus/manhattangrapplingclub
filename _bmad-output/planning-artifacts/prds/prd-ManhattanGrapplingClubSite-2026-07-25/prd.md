---
title: Manhattan Grapple Club Website Redesign
status: final
created: 2026-07-25
updated: 2026-07-25
---

# PRD: Manhattan Grapple Club Website Redesign

## 0. Document Purpose

This PRD is for whoever builds and reviews the redesigned site — in the first instance the implementing agent, then Taidus as reviewer, then the club as content owner. It builds on `_bmad-output/planning-artifacts/briefs/brief-ManhattanGrapplingClubSite-2026-07-25/brief.md` and its `addendum.md`; the addendum holds the verbatim source copy extracted from the live site and is the authoritative content source for the build. Nothing here duplicates the brief's reasoning — read that for *why*.

Structure: Glossary-anchored vocabulary, features grouped with globally-numbered FRs nested, assumptions tagged `[ASSUMPTION]` inline and indexed in §9. This PRD is deliberately right-sized for a single-page marketing site; it is not enterprise-weight.

## 1. Vision

A Manhattan, Kansas resident taps a Google Maps pin or an Instagram link, lands on their phone, and within one screen knows when classes run, that the first two weeks are free, what membership costs, where the gym is, and who will be teaching them. They tap once and are in the trial signup.

Today they get a GoDaddy template with a stock photo and none of those five answers. The club is genuinely welcoming — free community open mat, a women's-only class, a beginner-first ethos — and the site conveys none of it. This redesign closes the gap between what the club is and what the website says it is.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** find class days and times; confirm a beginner is welcome; learn the price; get directions; identify the instructor.
- **Emotional:** stop feeling intimidated. Decide "I could walk in there without embarrassing myself."
- **Social:** confirm there will be people like me — specifically, for the Wednesday class, that it is genuinely women-only.
- **Contextual:** all of the above on a phone, one-handed, in under a minute, often while physically near the gym.

### 2.2 Non-Users (v1)

- Existing members managing billing or bookings — they go to the Glofox portal, which this project does not replace.
- Parents shopping for kids' classes — the club publishes no youth programming, and we will not imply any exists. See §8.
- Out-of-state visitors seeking a drop-in — served incidentally by the Open Mat listing; not a design target.

### 2.3 Key User Journeys

- **UJ-1. Marcus checks from the parking lot.**
  Marcus, 26, stationed at Fort Riley, wrestled in high school and wants to get back on the mats. Unauthenticated, arriving from a Google Maps listing on his phone at 6:40pm on a Tuesday. He lands, sees the badge and a photo of an actual mat, and the schedule block tells him a class starts in twenty minutes and it is the Intro to Grappling session. He taps "Get directions" and drives over. **Climax:** the schedule answered a time-sensitive question without a single navigation click. **Resolution:** he trains that night and signs up for the free trial afterwards. **Edge case:** if no class is running today, the schedule surfaces the next one by name and day rather than showing an empty state.

- **UJ-2. Danielle needs to know it's really women-only.**
  Danielle, 34, has never done a martial art and is nervous about grappling with strangers. Arrives from an Instagram story on her phone. She scrolls past the schedule, stops on the Women's BJJ block, and finds it treated as a real offering with its own explanation — not a table row. She keeps scrolling to the instructor section and sees a named, photographed coach with a stated belt rank. **Climax:** the combination of a women-only space and a named, credentialed human is what converts her. **Resolution:** she taps the persistent trial button and books.

- **UJ-3. Trevor wants the price before he commits to anything.**
  Trevor, 20, a K-State sophomore on a tight budget. He has been burned by gyms that hide pricing behind a "contact us." He lands, scrolls to the pricing block, and sees real numbers and the two-week free trial stated plainly. **Climax:** the price is on the page, before any hand-off. **Resolution:** he taps through to Glofox already knowing what he will be charged. **Edge case:** until the club supplies confirmed pricing, this block renders a visibly-marked placeholder — never an invented number.

## 3. Glossary

- **Club** — Manhattan Grapple Club, the business. Singular "Grapple", never "Grappling", in user-facing copy.
- **Session** — one scheduled class occurrence. The Club runs five per week: Monday BJJ, Tuesday Introduction to Grappling, Wednesday Women's BJJ, Thursday BJJ, Sunday Open Mat.
- **Schedule** — the set of all Sessions, rendered as one unit.
- **Trial** — the free two-week trial membership. The site's primary conversion action.
- **Membership** — a paid recurring plan. Purchased in Glofox, never on this site.
- **Glofox** — the Club's third-party booking and payment portal. Branch `697ce60e0cc4cd375e0bf861`. Out of scope to replace.
- **Badge** — the Club's circular crest logo at `images/grapple club image.webp`. Source of the palette.
- **Arrival Moment** — a first-time mobile visitor from Google Maps or social, giving the site 10-40 seconds to answer five questions.
- **Five Answers** — Schedule, Trial, cost, location, instructor. The IA is ordered by these.
- **Placeholder** — a visibly-marked stand-in for a fact the Club has not yet supplied. Defined in §4.9.
- **Client Fact** — a fact only the Club can supply (pricing, instructor identity, phone, email, socials, end times, photography, age policy). Never inferred, never invented.

## 4. Features

### 4.1 Arrival Header & Hero

**Description:** The first screen. Establishes identity, location, and the offer without scrolling. Uses the Badge as the anchor and the Club's real palette. Realizes UJ-1, UJ-2, UJ-3.

#### FR-1: Above-the-fold orientation
A first-time visitor on a 390×844 viewport can identify the Club's name, that it teaches Brazilian Jiu-Jitsu, that it is in Manhattan KS, and that a free two-week Trial exists — without scrolling.

**Consequences (testable):**
- Club name, discipline, city, and Trial offer are all within the first 844px at 390px width.
- The Badge renders at a legible size and is not cropped.
- Hero produces no cumulative layout shift: image dimensions are reserved before load.
- The city is written as "Manhattan, Kansas" or "Manhattan, KS" at least once above the fold, so a visitor never assumes NYC.

#### FR-2: Primary Trial call to action in the hero
The hero contains a Trial CTA linking to the Glofox trial plan URL.

**Consequences (testable):**
- Links to `https://app.glofox.com/portal/#/branch/697ce60e0cc4cd375e0bf861/memberships/69c059e136851fd01707d307/plan/1774213467171/buy`.
- Opens in a new tab with `rel="noopener"`.
- Tap target ≥ 44×44px.

### 4.2 Class Schedule

**Description:** The centerpiece. All five Sessions on one screen, scannable in a glance, with today's or the next Session surfaced. Session descriptions come verbatim from the addendum. Realizes UJ-1, UJ-2.

#### FR-3: Full Schedule on the homepage
All five Sessions are visible on the homepage without pagination, tabs, or navigation to another page.

**Consequences (testable):**
- Monday BJJ 7:00pm, Tuesday Introduction to Grappling 7:00pm, Wednesday Women's BJJ 7:00pm, Thursday BJJ 7:00pm, and Sunday Open Mat 9:30am all render.
- Each Session shows day, time, name, and the Club's own description.
- Open Mat is labelled as free with no drop-in fee.
- At 390px width the Schedule requires no horizontal scrolling.

#### FR-4: Next Session highlighting
The Schedule visually distinguishes the next upcoming Session based on the visitor's local date and time.

**Consequences (testable):**
- On a Tuesday at 6:00pm local, the Tuesday Session is marked as next.
- On a Friday (no Sessions), the Sunday Open Mat is marked as next.
- Highlighting is conveyed by more than colour alone — a text label such as "Next class" is present for screen readers and colour-blind users.
- If JavaScript is disabled, the Schedule still renders completely; only the highlight is absent.

#### FR-5: Women's BJJ given distinct treatment
The Wednesday Women's BJJ Session receives visual and copy treatment beyond a schedule row.

**Consequences (testable):**
- A dedicated block or card explains the women-only space in the Club's own words.
- It is reachable from the Schedule.

### 4.3 Trial & Membership Pricing

**Description:** Closes the largest conversion leak on the current site — cost is invisible. Realizes UJ-3.

#### FR-6: Trial explained on-page
The free two-week Trial is explained on the page: what it includes and how to start it.

**Consequences (testable):**
- States it is two weeks and free.
- Names what a newcomer should wear and expect, drawn from the FAQ copy.
- CTA links to the Glofox trial URL.

#### FR-7: Membership pricing displayed on-site
Membership pricing renders on the page, before any hand-off to Glofox.

**Consequences (testable):**
- Where the Club has supplied confirmed pricing, real amounts, billing period, and plan names render.
- Where pricing is not yet confirmed, a Placeholder renders per FR-17 — never an invented, estimated, or "typical" price.
- A link to the full Glofox membership list is present.

### 4.4 Instructor & Trust

**Description:** The trust section. In a contact sport, an anonymous gym is a disqualifier — most sharply for UJ-2. Realizes UJ-2.

#### FR-8: Named instructor with credentials
The head instructor is presented with name, belt rank, lineage or who promoted them, and a photograph.

**Consequences (testable):**
- All four fields render when supplied by the Club.
- Any field not yet supplied renders as a Placeholder per FR-17.
- No credential, rank, affiliation, or lineage is ever stated that the Club has not confirmed. `[ASSUMPTION]` None of this is known at time of writing; the entire section may launch as Placeholders.

### 4.5 Location & Contact

**Description:** Phone-native location handling. The visitor is often nearby and moving. Realizes UJ-1.

#### FR-9: Address and map
The full street address renders as text, with an embedded or linked map.

**Consequences (testable):**
- Renders "511 Richards Drive, Suite A, Manhattan, KS 66502".
- A "Get directions" affordance opens the platform's maps app with the Club as destination.
- Any embedded map is lazy-loaded and does not block first paint.

#### FR-10: One-tap contact
Contact channels are tappable, not form-gated.

**Consequences (testable):**
- Phone, when supplied, renders as a `tel:` link.
- Email, when supplied, renders as a `mailto:` link.
- Social profiles, when supplied, render as links.
- Unsupplied channels render as Placeholders and are not fabricated.
- A contact form is permitted but must not be the only channel.

### 4.6 Beginner Confidence

**Description:** Promotes the FAQ voice — the best asset on the current site — out of a buried page and next to the decisions it unblocks. Converts three PDF policies into readable web content. Realizes UJ-2, UJ-3.

#### FR-11: FAQ content inline and expandable
All seven existing FAQ items render on the homepage in an expand/collapse pattern.

**Consequences (testable):**
- All seven questions and answers from the addendum are present, verbatim, including original punctuation.
- Implemented with native `<details>`/`<summary>` or an ARIA-correct disclosure; keyboard operable; expanded state announced.
- Content is present in the DOM when collapsed, so it is findable by in-page search and by crawlers.

#### FR-12: No PDF-gated content
No content required to make a first-visit decision sits behind a PDF download.

**Consequences (testable):**
- Community standards, safety and hygiene, and sparring etiquette render as web content. `[ASSUMPTION]` The PDF bodies have not been read; if their text cannot be obtained, this renders as a Placeholder section rather than invented policy text.

### 4.7 Persistent Trial CTA

#### FR-13: Trial reachable from any scroll position
A Trial CTA is reachable in one tap regardless of scroll position on viewports under 768px.

**Consequences (testable):**
- A sticky or docked CTA is present and thumb-reachable on mobile.
- It never obscures the Schedule or the footer's final CTA.
- It respects safe-area insets on notched devices.
- Tap target ≥ 44×44px.

### 4.8 Design System & Motion

#### FR-14: Palette derived from the Badge
The visual system derives from the Badge: near-black, gold/amber, red, and white/off-white.

**Consequences (testable):**
- Tokens are defined once as CSS custom properties and reused; no ad-hoc hex values scattered through the stylesheet.
- Red is reserved as an accent, not used for large fills, and never used as the sole carrier of meaning.
- All text meets WCAG AA contrast (4.5:1 body, 3:1 large text) against its actual background.

#### FR-15: Motion is purposeful and accessible
Animation supports comprehension and is never decorative noise.

**Consequences (testable):**
- Enter animations use ease-out or a spring; exits are faster than enters.
- No animation exceeds ~400ms for a UI transition.
- Transforms and opacity only — no animating layout-triggering properties.
- `@media (prefers-reduced-motion: reduce)` disables or reduces all non-essential motion.
- Nothing on the critical path (Schedule, pricing, CTA) depends on an animation completing to become readable.

### 4.9 Content Integrity

**Description:** This site represents a real business. A plausible-sounding invented price or belt rank shipped to production is a material harm, not a cosmetic bug. This section exists because that risk is the dominant one in this project.

#### FR-16: Only verified content ships as fact
Every user-facing factual claim traces to the addendum's Verified sections or to a Client Fact the Club has explicitly supplied.

**Consequences (testable):**
- No price, phone number, email, instructor name, belt rank, affiliation, testimonial, review, star rating, or class end time appears unless sourced.
- No stock photography depicting people is presented as the Club's own members or facility.

#### FR-17: Placeholders are visually unmistakable
Every Placeholder is obvious to any human looking at the page.

**Consequences (testable):**
- Rendered with distinct styling that cannot be mistaken for finished content.
- Names the missing Client Fact and who must supply it.
- Carries a machine-findable marker (for example `data-placeholder`) so all Placeholders can be enumerated before launch.

#### FR-18: Launch blocker manifest
The draft ships with an enumerable list of every Placeholder that must be resolved before the site goes live.

**Consequences (testable):**
- A single command or document lists all outstanding Placeholders.
- The list matches what actually renders on the page.

### 4.10 Local Discovery

**Description:** The Arrival Moment usually begins in Google Maps, so structured data and metadata are functional requirements, not polish.

#### FR-19: LocalBusiness structured data
The page emits valid `LocalBusiness` (or `SportsActivityLocation`) JSON-LD.

**Consequences (testable):**
- Includes name, full postal address, geo-appropriate fields, and URL.
- Includes only verified fields — no invented phone, price range, or rating.
- Validates against Schema.org without errors.

#### FR-20: Share and search metadata
The page carries title, description, Open Graph, and Twitter card metadata.

**Consequences (testable):**
- Title and description name both the discipline and "Manhattan, Kansas".
- An Open Graph image is set. `[ASSUMPTION]` Until real photography exists, the Badge serves as the OG image.
- A favicon derived from the Badge is present.

### Cross-Cutting NFRs

- **Performance:** usable on a mid-range Android over 4G. No render-blocking third-party JS. Images served in modern formats with explicit dimensions. Local draft has no build step — it opens from the filesystem.
- **Responsive:** designed at 390px first; verified at 320, 390, 768, and 1280px. No horizontal scroll at any width.
- **Accessibility:** WCAG AA contrast; visible focus states on every interactive element; semantic landmarks and one `<h1>`; all interactive elements keyboard-reachable; tap targets ≥ 44px; `prefers-reduced-motion` honored.
- **Resilience:** all critical content (Schedule, pricing, address, instructor) renders with JavaScript disabled. JS is progressive enhancement only.
- **Privacy:** no third-party trackers in the local draft.

## 5. Non-Goals

- Not replacing Glofox for booking, payment, or member management.
- Not building a CMS, admin UI, or member login.
- Not a blog, news feed, or event calendar.
- Not e-commerce or merchandise.
- Not multi-language.
- Not deploying to production, changing DNS, or touching the live GoDaddy site. This is a local draft.
- Not a multi-page site — the Five Answers belong on one page. Secondary pages only if content volume forces it.

## 6. MVP Scope

### 6.1 In Scope

Single-page mobile-first homepage carrying all Five Answers; Schedule with next-Session highlighting; pricing block; instructor block; location with map and tap-to-call; FAQ inline; policy content de-PDF'd; Badge-derived design system; structured data and metadata; Placeholder system with a launch-blocker manifest; runs locally with no build step.

### 6.2 Out of Scope for MVP

- Online booking on-site — Glofox owns this. Deferred indefinitely.
- Testimonials and Google review pull-through — no verified source yet. `[NOTE FOR PM]` High conversion value; revisit as soon as the Club confirms its Google listing.
- Instructor roster beyond the head coach — unknown whether other coaches exist.
- Live "next class starts in…" countdown — deferred to v2; the static next-Session highlight covers the need.
- Analytics — recommended at launch, not required for the draft.

## 7. Success Metrics

Right-sized: the Club has no analytics today, so v1 metrics are pass/fail by inspection rather than measured.

**Primary**
- **SM-1:** A first-time mobile visitor answers all Five Answers without leaving the homepage. Validates FR-1, FR-3, FR-7, FR-8, FR-9.
- **SM-2:** Membership cost is visible on-site before any Glofox hand-off. Validates FR-7.
- **SM-3:** Zero unverified facts render as fact; every Placeholder is visibly marked and enumerated. Validates FR-16, FR-17, FR-18.

**Secondary**
- **SM-4:** Trial CTA reachable in one tap from any scroll position at 390px. Validates FR-2, FR-13.
- **SM-5:** Passes WCAG AA contrast, keyboard traversal, and reduced-motion checks. Validates FR-14, FR-15.

**Counter-metrics (do not optimize)**
- **SM-C1:** Do not maximize time-on-page. The Arrival Moment is a success when it is *short* — the visitor got their answer and left to train. Counterbalances SM-1.
- **SM-C2:** Do not maximize animation or visual richness. Every effect must survive the question "does this help someone decide?" Counterbalances SM-5.
- **SM-C3:** Do not fill Placeholders to make the draft look finished. An obviously-incomplete draft is the correct output when facts are missing. Counterbalances SM-3.

## 8. Open Questions

1. Membership pricing — plan names, amounts, billing period, contract terms. **Phase-blocker for launch, not for the draft.**
2. Owner / head instructor — name, belt rank, promoting instructor, lineage, years training, photo. **Phase-blocker for launch.**
3. Phone number and public email.
4. Instagram and Facebook handles — do they exist?
5. Class end times, and how the gi/no-gi weekly rotation gets published.
6. Real photography of the mats, the building exterior, and training.
7. Age policy — adults only, or is there youth programming?
8. Do the three policy PDFs have extractable text, and may it be republished as web content?
9. Does the Club have a Google Business listing, and may its reviews be surfaced?

## 9. Assumptions Index

- §2.3 UJ-1 / §2.1 — K-State students and Fort Riley-adjacent adults are core segments. Inferred from geography; unconfirmed by the Club.
- §4.4 FR-8 — No instructor information is currently known; the section may launch entirely as Placeholders.
- §4.6 FR-12 — Policy PDF bodies have not been read; content may be unobtainable.
- §4.10 FR-20 — The Badge serves as the Open Graph image until real photography exists.
- §7 — No analytics baseline exists, so success is assessed by inspection.
- §6.2 — Assumed no coaches beyond the head instructor need presenting in v1.
