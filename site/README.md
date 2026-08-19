# Manhattan Grapple Club — the site

A mobile-first redesign of [manhattangrappleclub.com](https://www.manhattangrappleclub.com/).

**Live:** <https://www.manhattangrappleclub.com/>

## Run it

No build step and no dependencies. It does make one network request — Google Fonts, for Archivo Black (see *Style* below); everything else is local.

```bash
# either just open it
open site/index.html

# or serve it, which is closer to production (the map embed behaves better over http)
cd site && python3 -m http.server 8080
# → http://localhost:8080
```

## What's here

```
site/
├── index.html                  home — the arrival moment
├── about.html                  the club, how we coach, who you'll train with
├── gallery.html                14 photos + a native-<dialog> lightbox
├── first-class.html            "new here?" — start here + FAQ
├── standards.html              conduct, sparring etiquette, safety & hygiene
├── contact.html                phone, email, social, map, directions
├── robots.txt                  allows crawling, points at the sitemap
├── sitemap.xml                 the five canonical URLs
├── assets/css/styles.css       design system + layout (shared)
├── assets/js/main.js           progressive enhancement only (shared)
├── assets/img/                 badge + photos
├── tools/list-placeholders.mjs launch-blocker manifest (walks all pages)
├── tools/check-chrome.mjs      chrome parity + link integrity
└── tools/check-seo.mjs         canonicals, metadata, JSON-LD, sitemap, robots
```

## Six pages, not one

The single page had grown to **16,511px on a phone — roughly 20 screens.** Reaching the community standards meant scrolling past 9,363px of everything else. So the long tail moved onto its own pages:

| Page | Mobile height | What's on it |
| --- | --- | --- |
| `index.html` | 8,690px | Hero, about, the week, Women's BJJ, trial & pricing, compact location, coaches, links out |
| `about.html` | 5,396px | The club's story, how we coach, coach biographies, where to go next |
| `gallery.html` | 5,930px | 14 photos, tap any to open the lightbox |
| `first-class.html` | 2,685px | Start here, then every FAQ |
| `standards.html` | 5,645px | Conduct, sparring do/don't, safety & hygiene |
| `contact.html` | 4,328px | Phone, email, social, contact form, map, directions, which door |

**Home is 47% shorter** than the original single page, and anything that used to be a 9,000px
scroll is now one tap from the menu — the first community standard sits **467px** from the top
of its own page. Heights measured at 390px wide, and they include the mobile spacing work
below.

Every page carries the same header, footer and sticky CTA, and marks itself with `aria-current="page"` in both navs.

`about.html` is generated from `index.html`'s chrome rather than hand-copied, which is why
its header and footer are byte-identical to the other four.

### Why there's a checker instead of a build step

With no build step the chrome is physically duplicated in four files, which is the price of "open it and it works". `tools/check-chrome.mjs` is what keeps that honest — it asserts the header, footer and sticky-CTA blocks are byte-identical across pages (ignoring `aria-current`), that every internal link and asset reference resolves, and that no page is orphaned.

```bash
node site/tools/check-chrome.mjs   # exit code = number of problems
node site/tools/check-seo.mjs      # the invisible half: canonicals, metadata, JSON-LD, sitemap
```

It has already earned its keep: it caught a stray temp file I'd left in `site/` that a manual read-through missed.

`check-seo.mjs` covers what a browser will never show you — a canonical pointing at a URL
that 308s, a duplicated `<title>`, a relative `og:image` (crawlers ignore those, which is
why these pages used to preview with no image at all), a sitemap that has drifted from the
pages' own canonicals, and unbalanced `<div>` tags. It found a stray `</div>` in
`index.html`'s location section, left behind when the map embed moved to `contact.html`.

## Live

The draft markers are gone: no placeholder boxes, no "not the live site" footer, and the
`noindex` header has been removed so the pages can be indexed.

### Facts the club still owes (no longer shown on the page)

These were rendering as visible placeholders while this was a draft. They have been removed
from the pages — the surrounding content reads correctly without them, and none of their
absence implies anything false — but the facts are still missing and worth adding:

| Was | What's needed | Where it would go |
| --- | --- | --- |
| `coach-details` | **Partly resolved.** Coach Hunter's biography, belt and lineage were supplied and are published. **Coach Annie's biography has not been** — the markup carries a `TODO — COACH ANNIE` comment, and the coach grid is `repeat(auto-fit, …)` so her card drops in beside Hunter's with no layout change | `index.html` → section 05, `about.html` → section 03 |
| `class-end-times` | Class end times, and which weeks are Gi vs No-Gi. This is what blocks `openingHoursSpecification` in the structured data | `index.html` → section 02 |
| `age-policy` | Adults only, or are there kids' classes | `first-class.html` → FAQ |

`tools/list-placeholders.mjs` now reports zero, which is what makes the site safe to publish.
If you add a placeholder back while drafting a change, it will start reporting again.

**Pricing is live on the page** — Founding Member $85/mo, Women's Only $50/mo, plus the free
two-week trial — from a client-supplied Glofox screenshot. That closes the largest conversion
leak the brief identified: the site states its price *before* handing off to Glofox.

### The domain

**Done.** `www.manhattangrappleclub.com` resolves to this deployment, and the non-`www`,
`http`, `index.html` and `.html` variants all 308 to the canonical form. Every
`<link rel="canonical">`, `og:url`, JSON-LD `url` and `sitemap.xml` entry names that final
form — never a variant that redirects. `tools/check-seo.mjs` asserts it on every run.

### The contact form is interim

`contact.html` has the contact form the original site had — Name, Email, Phone, Message — properly labelled, with real `autocomplete`/`inputmode` hints and native validation.

It currently submits by **`mailto:` to `info@manhattangrappleclub.com`**, which hands the message to the visitor's own email client rather than sending it server-side. That reaches the right inbox with zero backend, but a visitor with no mail app configured (common on desktop Chrome) will not complete it. The form note says "Sending opens your email app" so nobody is surprised, and the address is offered as a direct link beside it.

**For the final version**, point it at a form service (Formspree, Basin, Netlify Forms) delivering to the same address, and add a thank-you state. Two details worth keeping when you do:

- `method="post"` with `enctype="text/plain"` — a GET submit would put a visitor's name, email and phone number into a URL, where it lands in history and logs.
- The old site used Google reCAPTCHA. A server-side honeypot or the form service's own filtering does the same job without loading Google's script onto a page where people are typing personal details.

### Two traps to avoid

1. **The club trains inside the 785 Athletics / CrossFit 785 facility** — confirmed, and now stated on the page with the exterior photo as the wayfinding cue. But CrossFit 785's *own* phone and email belong to a different business: the club's real details are `(620) 491-8278` and `info@manhattangrappleclub.com`, and the CrossFit 785 ones must never appear here.
2. Do not fill a placeholder with a plausible guess to make the draft look finished. An obviously incomplete draft is the correct output while facts are missing.

## Craft review

The build was reviewed against the `review-animations` and `emil-design-eng` skills and came back **Block**, with four blocking findings. All are fixed:

1. **The hero CTAs wrapped and left-aligned on mobile** — ~231px + ~186px cannot share a 350px line, so the second button sat `flex-start` under centre-aligned hero text. Now stacked full-width below 480px. This was visible in the first screenshot and I had missed it.
2. **The display typeface never loaded.** `Archivo Black` was named but never shipped, and the fallback stack had no `system-ui` — so on iOS it fell to Helvetica Neue (max weight 700) while asking for 900, triggering synthetic bolding on every heading, on the dominant device for a Maps-referred visitor. Was fixed with the system stack at weight 800 — **since superseded** by the CollegiateClub restyle, which loads Archivo Black properly at its real weight of 400.
3. **The placeholder label failed contrast.** Red on charcoal measures 3.46:1; at 16px bold WCAG requires 4.5:1 (the bold "large text" exemption only starts at 18.66px). The original code even carried a comment asserting an exemption that does not exist. Added `--red-hi` at 4.81:1.
4. **The scroll reveal was decoration that a fast scroll outran** — 400ms fade-and-rise, plus a safety net that silently switched the effect off 1.5s after load, plus a nested double-fade on the Women's section. Now opacity-only at 220ms, un-nested, with a net that only fires if the observer genuinely failed.

Also removed: two `backdrop-filter`s and a badge `drop-shadow` that were invisible against near-black but re-composited every scroll frame; a dead transition that could never run; a `transition: top` on the skip link (layout-triggering, and keyboard reveals should be instant). The badge went from 84KB to 42KB, with an 18KB variant for the header and footer.

Added on the review's suggestion: the schedule now says **"On now"** rather than "Next class" when a session is actually running — the 7:15pm parking-lot case.

One flagged item was kept deliberately: `scroll-behavior: smooth`. It's conventional, and it's already disabled under reduced-motion. Taste, not defect.

## Style: the CollegiateClub direction

The site now follows the **CollegiateClub** template from the *Manhattan Grapple Club Design System* Claude Design project. **Every section and all content is unchanged** — only the styling is new.

- **Archivo Black** display type, **Archivo** body, both uppercase-forward with tight negative tracking
- **Hard corners.** Every radius is `0`; photos keep the only radius in the system and it's 2px
- **Gold as structure** — 6px gold rules under the header, the hero, every section heading, and above the final CTA
- **Numbered section headers** — `01` through `07`
- **The panel grid** — a 2px gap over a hairline-coloured parent, so the gap *becomes* the divider. Used for the week board, the trial duo, the standards, do/don't, hygiene, steps and FAQ
- **Numeral-forward** — 34px gold class times, a 104px "FREE", leading-zero counters throughout

**One trade-off you should know about.** Archivo Black is central to this direction, so the page now makes a Google Fonts request — the previous build was deliberately network-free. It's mitigated with `preconnect` and `display=swap` so text paints immediately in the fallback. If offline capability matters more than the exact typeface, self-host both faces as woff2 and drop the third-party request.

**Two accessibility failures in the template were fixed rather than copied.** Its closed-day greys measure **2.39:1** ("CLOSED") and **3.50:1** (the rest-day header) — both fail AA, and "CLOSED" is real information telling you not to turn up. They're raised to 4.77:1 and 4.93:1, still visibly quieter than active days.

## Mobile spacing

Every vertical value in the top-of-page stack and the section rhythm is clamped, so mobile
scales down and desktop keeps the CollegiateClub proportions. Two mistakes were fixed here,
both caused by porting desktop values verbatim:

- **`.hero` and `.hero-inner` were both applying padding** — 64px + 84px, so there was
  **148px of nothing** above the badge and the hero stood 983px tall inside an 844px
  viewport. It could not be seen in one screen. `.hero-inner` now owns the padding alone.
- **`--section-y` was a flat 88px**, i.e. **176px between every section on a phone**. The
  design system's own token was `clamp(56px, 10vw, 112px)`; flattening it to the template's
  desktop number is what charged mobile for desktop rhythm.

Measured at 390px, before → after:

| | Before | After |
| --- | --- | --- |
| Home page height | 9,250px | **8,168px** (−12%) |
| Hero height | 983px | **635px** (fits the viewport) |
| Dead space above the badge | 148px | **36px** |
| Between sections | 176px | **88px** |

At 1280px the section padding is still 88px and the home page is 6,316px, versus 6,324px
before — desktop is unchanged.

## Design decisions worth knowing

**The palette is sampled from the badge, not invented.** Gold `#FDB71B`, red `#E81D2E`, near-black, white — measured from the image's actual pixels.

**The site is dark because the maths forced it.** Gold text on white measures 1.76:1 contrast, which is unreadable. Gold on near-black measures 11.21:1. So gold became a *fill* colour — the primary button is a gold block with black text at 11.21:1 — and the page went dark. That happens to match the badge's own construction and suits the sport.

**Section order follows the visitor, not marketing convention.** Someone arriving from Google Maps wants: schedule → trial → cost → location → instructor. That is still the scroll order, with one deliberate addition ahead of it: a short **About** section directly under the hero. The `<h1>` is the conversion promise ("You don't have to be ready to start"); the `<h2>` immediately below it is *"Brazilian Jiu-Jitsu in Manhattan, Kansas"*. Naming the sport and the town in the first heading after the `<h1>` is the strongest local-relevance signal the page can send, and the hero keeps its own CTA and its "See the schedule" jump link, so nothing is taken from it. The full version of that copy lives on `/about`.

**The schedule is a calendar, not a list.** The first draft showed only the five class days, so it ran Mon, Tue, Wed, Thu, **Sun** — and that jump read as a gap rather than a closed weekend. It now renders all seven days in order, with Friday and Saturday as explicit dashed "Closed" cells. Same markup, two views: an agenda below 1024px, and a true seven-column week grid above it. The grid waits until 1024px because below that a seventh of the content width is under 95px, which cannot hold "Introduction to Grappling". On mobile a compact week-at-a-glance strip carries the calendar shape instead — the whole week in one line, with the next class highlighted.

**The community standards were the biggest find.** Consent language, the explicit right to refuse a roll, tap-early instructions, and a zero-tolerance clause were all sitting inside three PDF downloads where nobody would read them on a phone. They are now a full section. For a nervous beginner — especially someone considering the Wednesday women's class — this is the most persuasive content the club owns.

**Nothing load-bearing depends on JavaScript.** Turn it off and you still get the schedule, the prices, the address, and every policy. JS only adds the "Next class" marker, the sticky mobile button, and a scroll fade.

## Content provenance

Every factual claim traces to the club's own live site as extracted on 2026-07-25 — schedule, class descriptions, FAQ answers, policy content, address, Glofox links — plus a second round of copy supplied directly by the club on 2026-08-19: the About/mission text, rewritten class descriptions, the "Start Here" bullets, the rewritten FAQ, and Coach Hunter's biography. Social profiles were verified separately. Full source-by-source detail is in:

```
_bmad-output/planning-artifacts/briefs/brief-ManhattanGrapplingClubSite-2026-07-25/addendum.md
```

## Recommended next steps beyond the site

These moved into [`../LOCAL-SEO-HANDOFF.md`](../LOCAL-SEO-HANDOFF.md), which is the full
off-site list: Google Business Profile, honest review collection, Apple/Bing/Facebook
listings, local links, Search Console, and what to measure.

The headline is unchanged: **create a Google Business Profile if one does not exist.** None
was found. Google Maps is the club's primary arrival path, and it is the highest-leverage
marketing action available — bigger than anything on this page.

Instagram and Facebook are now linked from every page's footer and from the contact page.

## Round two — 2026-08-19

The club supplied new copy, and an SEO audit found real defects. Both are addressed.

**Content.** New About section on the home page and a dedicated `/about`. Class descriptions,
the "Start Here" list and the whole FAQ replaced with the club's own supplied wording. Coach
Hunter's biography added — Chicago 2016, Purple Belt under Jeff Serafin, seminars. Coach
Annie has photos but **no supplied biography**, so she is not published: the markup carries a
`TODO — COACH ANNIE` comment and the coach grid already reserves space for her card.

**"Start Here" is bullets now, not numbered steps.** The four items are things to know, not a
sequence, and numbering them implied an order a first-timer would then worry about getting
wrong. The new `.bullets` component is `.ticks`' rhythm with the hygiene list's gold bar
instead of a `decimal-leading-zero` counter.

**Class descriptions stay in the HTML.** They render in the schedule board on every viewport
with JavaScript off. The FAQ still uses `<details>`, but that is a *native* disclosure —
every question and answer is in the DOM and readable by a crawler whether it is open or not.

**Canonicals were pointing at URLs that redirect.** Every page named
`https://manhattangrappleclub.com/first-class.html` — non-`www` *and* `.html` — when the
server 308s both. All five now name the final `https://www.…/first-class` form, as do
`og:url`, the JSON-LD `url`, and `sitemap.xml`. This is invisible in a browser, so
`tools/check-seo.mjs` asserts it.

**`robots.txt` and `sitemap.xml` were both 404.** Now present, with the sitemap listing only
the five canonical URLs.

**Open Graph images were relative** (`content="assets/img/badge.webp"`), which crawlers
ignore — every share of this site previewed with no image. Now absolute, with dimensions and
alt text, and pointing at a photo rather than the square badge, since the card is
`summary_large_image`.

**Structured data.** The `SportsActivityLocation` gained a stable `@id`, absolute crawlable
images, a logo, and `sport`. `/about` and `/first-class` reference that `@id` rather than
re-declaring the business, so the site describes one entity rather than five. `FAQPage`
added, verbatim against the rendered answers. Still deliberately absent:
`openingHoursSpecification` (class *end* times have never been published, and inferring one
would put a false claim about a real business into structured data), `geo`, `hasMap`, and
`aggregateRating`.

**The header nav breakpoint moved from 1025px to 1100px.** A sixth item ("About") does not
fit: measured, the row needs about 1060px of content width, and below ~1100px the lockup was
squeezed into a third line. Between 1025 and 1100 the hamburger takes over — it already
carries every link the desktop nav does and more — while the header's trial button stays
visible from 1025px so the desktop conversion path is never absent. The 1025px case was
*already* broken before this change, with five items; it is fixed now too.

**One stray `</div>`** in `index.html`'s location section, left behind when the map embed
moved to `contact.html`, was silently reparenting everything after it.

## Round three — photos and the gallery

The club sent 24 photographs. They are a large upgrade on what was here: the previous
Women's BJJ image was a distant sideline shot of people's backs, in the section aimed at
the audience most likely to be nervous about walking in.

**A `/gallery` page**, 14 photos in the panel grid — the same 2px-gap-over-a-hairline
idiom as the week board and the standards. Three columns above 1025px, two above 620px,
one below.

**The lightbox is a native `<dialog>`.** No library. The browser supplies the parts that
are easy to get wrong and expensive to reimplement: focus is trapped inside the dialog,
the rest of the page goes inert, Escape closes it, and focus returns to the thumbnail that
opened it. What `main.js` adds is only what `<dialog>` has no answer for — moving between
photos, and swapping the image in. About 70 lines.

**Every thumbnail is a link, not a button.** `href` points at the full-size encode, so with
JavaScript off the gallery still works: the click just opens the photo. That is verified,
not assumed — the test suite loads the page with page scripting disabled and confirms the
href resolves to a real `image/webp` response.

**Two bugs worth recording, both found by measuring rather than looking:**

- The arrows were children of `.lb-stage` and absolutely positioned, returning to
  `position: static` on mobile. That made them grid *items* of a two-row grid that now had
  four in-flow children — so they stretched into full-width gold blocks covering the photo.
  They are markup children of the caption bar now, and only lifted out above 641px.
- `max-height: 100%` on the lightbox image did nothing. The percentage resolves against a
  grid area whose height comes from an `fr` track, and the image rendered at its full
  1033px inside an 863px row, overflowing the viewport and covering the caption. It now
  fills a definite box with `object-fit: contain`, which removes the percentage entirely.
  (The row also needed `minmax(0, 1fr)`: a bare `1fr` is `minmax(auto, 1fr)`, and that auto
  floor let the row grow to the image's natural height.)

**Cleanup does not depend on the `close` event.** It fires unreliably in headless Chrome —
a freshly attached listener never ran — so releasing the full-size image happens in every
close path directly, with `cancel` and `close` as belt-and-braces.

**The coach photos are client-chosen.** Hunter's card is a group shot at **Serafin
Jiu-Jitsu** — he is second from left, and the caption says so. The wall is the reason it
was chosen: it corroborates the bio line about earning his Purple Belt under Jeff Serafin.
Its source is a 1350x1800 phone JPEG, already exactly 3:4, so it is used uncropped —
cropping to Hunter alone would mean roughly 560x750 of real pixels upscaled into a 900w
slot. It is also the heaviest image on the site at 185KB for the 900w encode: a noisy
JPEG of a heavily textured brick wall is the worst case for WebP. It is lazy-loaded and
below the fold, and it was re-encoded at a lower quality than every other photo (0.62 vs
0.80) to get it that low.

Annie's card carries her photo and her name and nothing else — her biography still has not
been supplied, and the card is deliberately short rather than filled with invented copy.

**Not published: the names of the other three people in Hunter's photo.** They were
supplied, but three names for four people is ambiguous about who is who, and misattributing
a private individual on a public page is not a mistake worth risking. Add them to the
figcaption if you can confirm the left-to-right order.

**The header nav lost "Pricing".** With Gallery added it would have been seven items, and
seven do not fit at *any* width: `--max` caps the header's content box at 1136px and the
row needs 1164px. Pricing is a same-page anchor, the trial button sits immediately beside
it, and it is still in the footer, the mobile menu, and the home page itself. Six items fit
from 1140px, so the nav breakpoint moved to 1160px for real slack.

**Weights.** 400w thumbs are 8–24KB, 800w are 19–75KB, 1600w are 36–178KB. The gallery's
first paint is 46KB (the three above-the-fold cells, which are `loading="eager"` — a lazy
LCP image is a self-inflicted delay); the other eleven are lazy. Full-size encodes load only
when a photo is opened. Every photo on disk totals 2.6MB, against 74MB of source JPEGs.
