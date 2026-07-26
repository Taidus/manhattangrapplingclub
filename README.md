# Manhattan Grapple Club — website redesign

A redesign of [manhattangrappleclub.com](https://manhattangrappleclub.com/) for **Manhattan Grapple Club**, a Brazilian Jiu-Jitsu gym in Manhattan, **Kansas**.

> **This is a draft.** It is not deployed and does not touch the club's live site.

## Run it

No build step and no dependencies. It does make one network request — Google Fonts, for Archivo Black.

```bash
open site/index.html
# or, closer to production (the map embed behaves better over http):
cd site && python3 -m http.server 8080
```

## What's here

```
site/                 the site — four static pages, no build step
├── index.html          home: hero, the week, Women's BJJ, trial & pricing, location, coaches
├── first-class.html    "new here?" — day one, then every FAQ
├── standards.html      conduct, sparring etiquette, safety & hygiene
├── contact.html        phone, email, social, contact form, map, directions
└── tools/              launch-blocker manifest + chrome/link integrity checks

_bmad-output/         planning artifacts (brief → PRD → DESIGN.md + EXPERIENCE.md)
images/               original client assets
```

See [`site/README.md`](site/README.md) for the build notes: what's still missing, the design
direction, and the decisions worth knowing.

## Checks

```bash
node site/tools/list-placeholders.mjs   # facts the club must still supply; exit code = count
node site/tools/check-chrome.mjs        # header/footer parity + link integrity across pages
```

Both exit non-zero on failure, so they can gate a deploy.

## Deploying

`vercel.json` configures the deploy:

- **`outputDirectory: "site"`** — the pages live in `site/`, not the repo root.
- **`cleanUrls: true`** — `/contact` and `/contact.html` both work. Without this,
  extensionless URLs 404, which is what a visitor gets if they type or share `/contact`.
  Internal links stay written as `.html` so the site still opens straight from the
  filesystem; on Vercel those 308-redirect to the clean URL, which costs one hop.
- **`X-Robots-Tag: noindex, nofollow`** — **this is a draft.** Without it, a deploy carrying
  visible "NEEDS CLIENT INPUT" placeholders could be indexed and compete with the club's
  live site in search. **Remove that one header line when this goes live.**

Every page also carries `<link rel="canonical">` pointing at `manhattangrappleclub.com`, so
even if a draft URL is discovered, search engines are told where the real site is.

## Status

Three facts are still outstanding and render on the page as deliberately obvious placeholders
rather than being guessed at — see `site/README.md`. Everything else on the site traces to
something the club published or told us directly.

## A note on the planning artifacts

`_bmad-output/` contains the research and design reasoning behind the build. Because this
repository is public, third-party personal details that appeared in the working research
(a name in file metadata, contact details of a co-located business, individuals at competing
gyms) have been redacted. The reasoning is intact; the identifiers are not needed for it.
