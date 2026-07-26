# Manhattan Grapple Club — local redesign draft

A mobile-first redesign of [manhattangrappleclub.com](https://manhattangrappleclub.com/).

**Live draft:** <https://manhattangrapplingclub.vercel.app> — served `noindex`, and it does
not touch the club's live GoDaddy site.

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
├── first-class.html            "new here?" — day one + FAQ
├── standards.html              conduct, sparring etiquette, safety & hygiene
├── contact.html                phone, email, social, map, directions
├── assets/css/styles.css       design system + layout (shared)
├── assets/js/main.js           progressive enhancement only (shared)
├── assets/img/                 badge + photos
├── tools/list-placeholders.mjs launch-blocker manifest (walks all pages)
└── tools/check-chrome.mjs      chrome parity + link integrity
```

## Four pages, not one

The single page had grown to **16,511px on a phone — roughly 20 screens.** Reaching the community standards meant scrolling past 9,363px of everything else. So the long tail moved onto its own pages:

| Page | Mobile height | What's on it |
| --- | --- | --- |
| `index.html` | 8,168px | Hero, the week, Women's BJJ, trial & pricing, compact location, coaches, links out |
| `first-class.html` | 3,105px | Day one, then every FAQ |
| `standards.html` | 5,645px | Conduct, sparring do/don't, safety & hygiene |
| `contact.html` | 4,328px | Phone, email, social, contact form, map, directions, which door |

**Home is 51% shorter** than the original single page, and anything that used to be a 9,000px
scroll is now one tap from the menu — the first community standard sits **467px** from the top
of its own page. Heights measured at 390px wide, and they include the mobile spacing work
below.

Every page carries the same header, footer and sticky CTA, and marks itself with `aria-current="page"` in both navs.

### Why there's a checker instead of a build step

With no build step the chrome is physically duplicated in four files, which is the price of "open it and it works". `tools/check-chrome.mjs` is what keeps that honest — it asserts the header, footer and sticky-CTA blocks are byte-identical across pages (ignoring `aria-current`), that every internal link and asset reference resolves, and that no page is orphaned.

```bash
node site/tools/check-chrome.mjs   # exit code = number of problems
```

It has already earned its keep: it caught a stray temp file I'd left in `site/` that a manual read-through missed.

## Before this can go live

Three facts are missing. The page renders each one as a visible, deliberately ugly placeholder rather than guessing. Run:

```bash
node site/tools/list-placeholders.mjs
```

| Placeholder | What's needed | Priority |
| --- | --- | --- |
| `coach-details` | Who promoted Coach Hunter, his lineage, a short bio; any other coaches | **Highest** |
| `class-end-times` | End times + which weeks are Gi vs No-Gi | Medium |
| `age-policy` | Adults only, or are there kids' classes | Low |

**Pricing is now live on the page** — Founding Member $85/mo, Women's Only $50/mo, plus the free two-week trial — taken from a client-supplied Glofox screenshot. That closes the largest conversion leak the brief identified: the site now states its price *before* handing off to Glofox.

- **The instructor** was named nowhere online. The club's PDFs carry a personal name in their file metadata, but that identifies whoever built the file in Canva — it is not evidence of who teaches, so it was deliberately not used. Coach Hunter's name and rank came from the client directly.
- **The Founding Member cap** (20 members) is published as the club states it. It is not independently verified, and there is no longer a placeholder tracking it — if those places fill up, that line needs removing from the pricing card by hand.

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

**Section order follows the visitor, not marketing convention.** Someone arriving from Google Maps wants: schedule → trial → cost → location → instructor. That is exactly the scroll order.

**The schedule is a calendar, not a list.** The first draft showed only the five class days, so it ran Mon, Tue, Wed, Thu, **Sun** — and that jump read as a gap rather than a closed weekend. It now renders all seven days in order, with Friday and Saturday as explicit dashed "Closed" cells. Same markup, two views: an agenda below 1024px, and a true seven-column week grid above it. The grid waits until 1024px because below that a seventh of the content width is under 95px, which cannot hold "Introduction to Grappling". On mobile a compact week-at-a-glance strip carries the calendar shape instead — the whole week in one line, with the next class highlighted.

**The community standards were the biggest find.** Consent language, the explicit right to refuse a roll, tap-early instructions, and a zero-tolerance clause were all sitting inside three PDF downloads where nobody would read them on a phone. They are now a full section. For a nervous beginner — especially someone considering the Wednesday women's class — this is the most persuasive content the club owns.

**Nothing load-bearing depends on JavaScript.** Turn it off and you still get the schedule, the prices, the address, and every policy. JS only adds the "Next class" marker, the sticky mobile button, and a scroll fade.

## Content provenance

Every factual claim traces to the club's own live site as extracted on 2026-07-25 — schedule, class descriptions, FAQ answers, policy content, address, Glofox links. Social profiles were verified separately. Full source-by-source detail is in:

```
_bmad-output/planning-artifacts/briefs/brief-ManhattanGrapplingClubSite-2026-07-25/addendum.md
```

## Recommended next steps beyond the site

- **Create a Google Business Profile if one does not exist.** None was found. Google Maps is the club's primary arrival path, and this is the highest-leverage marketing action available — bigger than anything on this page.
- **Link the Instagram and Facebook accounts from the site.** Both exist; neither was linked.
- **Add analytics at launch** so the next iteration is measured rather than argued.
