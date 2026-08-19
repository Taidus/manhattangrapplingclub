# Manhattan Grapple Club — website redesign

A redesign of [manhattangrappleclub.com](https://www.manhattangrappleclub.com/) for **Manhattan Grapple Club**, a Brazilian Jiu-Jitsu gym in Manhattan, **Kansas**.

**Live at <https://www.manhattangrappleclub.com/>.** Five static pages, no build step.

## Run it

No build step and no dependencies. It does make one network request — Google Fonts, for Archivo Black.

```bash
open site/index.html
# or, closer to production (the map embed behaves better over http):
cd site && python3 -m http.server 8080
```

## What's here

```
site/                 the site — five static pages, no build step
├── index.html          home: hero, about, the week, Women's BJJ, trial & pricing, location, coaches
├── about.html          the club, how we coach, who you'll train with
├── first-class.html    "new here?" — start here, then every FAQ
├── standards.html      conduct, sparring etiquette, safety & hygiene
├── contact.html        phone, email, social, contact form, map, directions
├── robots.txt          allows crawling, points at the sitemap
├── sitemap.xml         the five canonical URLs, nothing that redirects
└── tools/              launch-blocker manifest + chrome, link and SEO integrity checks

_bmad-output/         planning artifacts (brief → PRD → DESIGN.md + EXPERIENCE.md)
images/               original client assets
```

See [`site/README.md`](site/README.md) for the build notes: what's still missing, the design
direction, and the decisions worth knowing.

## Checks

```bash
node site/tools/list-placeholders.mjs   # facts the club must still supply; exit code = count
node site/tools/check-chrome.mjs        # header/footer parity + link integrity across pages
node site/tools/check-seo.mjs           # canonicals, unique metadata, JSON-LD, sitemap, robots
```

All three exit non-zero on failure, so they can gate a deploy. `check-seo.mjs` is the one
that catches the invisible drift — a canonical left pointing at a redirecting URL, a
duplicated `<title>`, a relative `og:image`, a stray `</div>`, or a sitemap that has fallen
out of step with the pages' own canonical tags.

## Deploying

`vercel.json` configures the deploy:

- **`outputDirectory: "site"`** — the pages live in `site/`, not the repo root.
- **`cleanUrls: true`** — `/contact` and `/contact.html` both work. Without this,
  extensionless URLs 404, which is what a visitor gets if they type or share `/contact`.
  Internal links stay written as `.html` so the site still opens straight from the
  filesystem; on Vercel those 308-redirect to the clean URL, which costs one hop.

### The canonical URL

There is exactly one address for every page: **`https://` + `www.` + no `.html`**.

| Variant | Behaviour (verified live) |
| --- | --- |
| `http://manhattangrappleclub.com/…` | 308 → `https://` |
| `https://manhattangrappleclub.com/…` | 308 → `https://www.` |
| `/contact.html` | 308 → `/contact` |
| `/index.html` | 308 → `/` |

Every page's `<link rel="canonical">`, `og:url`, JSON-LD `url`, and every entry in
`sitemap.xml` is the final form — never a variant that redirects. `check-seo.mjs` asserts
this, because a canonical tag naming a URL that 308s is the specific mistake this site had
before, and it is invisible in a browser.

## Status

The site is live and indexable. Two facts are still missing and are deliberately **not**
published rather than guessed at — Coach Annie's biography, and class end times. See
[`LOCAL-SEO-HANDOFF.md`](LOCAL-SEO-HANDOFF.md), which also carries the off-site local-SEO
work (Google Business Profile, reviews, citations, Search Console) that only the club can do.

## A note on the planning artifacts

`_bmad-output/` contains the research and design reasoning behind the build. Because this
repository is public, third-party personal details that appeared in the working research
(a name in file metadata, contact details of a co-located business, individuals at competing
gyms) have been redacted. The reasoning is intact; the identifiers are not needed for it.
