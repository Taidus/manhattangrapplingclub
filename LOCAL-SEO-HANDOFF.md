# Local SEO — the work that isn't on the website

Everything in this list is **off-site**. None of it can be done from this repository, and
for a gym in a town the size of Manhattan, most of it outranks anything further that could
be changed on the pages themselves.

The site is now technically in order: unique titles and descriptions, correct canonicals,
`robots.txt`, `sitemap.xml`, and `SportsActivityLocation` structured data carrying the
club's real name, address, phone, email and social profiles. What follows is what turns
that into people walking through the door.

> **One rule underneath all of it.** Never publish a claim about the club that isn't true —
> not hours you haven't confirmed, not a category you don't actually fit, not a review you
> asked a friend to leave. Google penalises it, and prospective members notice faster than
> Google does.

---

## 1. Google Business Profile — do this first

No Google Business Profile was found for the club during research. If that's still true,
**creating one is the single highest-leverage marketing action available**, ahead of
anything else in this document. Google Maps is how most people find a gym.

1. **Claim and fully complete the profile** at
   [business.google.com](https://business.google.com). Expect a postcard or phone
   verification to the club's real address.
2. **Choose the most specific accurate category.** "Brazilian jiu-jitsu school" or
   "Martial arts school" — not "Gym" or "Fitness center", which put the club in a pool it
   can't win and describe something it isn't. Add secondary categories only where they are
   genuinely accurate.
3. **Keep name, address and phone identical everywhere.** Exactly this, character for
   character, on every listing and every page:

   > Manhattan Grapple Club
   > 511 Richards Drive, Suite A, Manhattan, KS 66502
   > (620) 491-8278

   Do not use the 785 Athletics / CrossFit 785 phone number or email. They share the
   building; they are a different business, and mixing the two corrupts both listings.
4. **Fill in the rest**, accurately:
   - **Hours** — the real ones. If the club is only open for class times, set those; do
     not invent a 9-to-5. (The website deliberately publishes no opening-hours structured
     data because class *end* times have never been confirmed. Once you know them, they can
     be added to both the profile and the site.)
   - **Services** — Brazilian Jiu-Jitsu, Introduction to Grappling, Women's BJJ, open mat.
   - **Photos** — real class photos, the mats, the exterior with the 785 signs so people
     can find the door. Add new ones regularly; profiles with fresh photos get more views.
   - **Website URL** — `https://www.manhattangrappleclub.com/`
   - **Appointment / booking link** — the free-trial Glofox URL, so the trial is reachable
     directly from Maps.

## 2. Reviews — honestly

Review count and recency are among the strongest local ranking factors, and the most
commonly abused.

5. **Ask.** Use the profile's own short review link, or print it as a QR code on the wall
   near the door. The best moment is right after someone's first good class or a promotion.
6. **Never incentivise, and never filter.** No discounts, free months, or merch in exchange
   for a review. Do not ask only the people you expect to be positive, or screen members
   before asking — "review gating" is against Google's policy and can get the profile
   suspended. Ask everyone, or ask no one.
7. **Respond to every review, naturally.** A short, specific, human reply. On a negative
   one: acknowledge it, say what you'll do, offer to talk offline. Do not argue, and do not
   paste the same sentence under twenty reviews.

## 3. Other listings — consistent NAP

8. **Create or correct listings on:**
   - Apple Business Connect (Apple Maps — this is how iPhone users get directions)
   - Bing Places
   - Facebook (the page exists at `facebook.com/61578537733611`; make sure its address,
     phone, hours and website match the profile above exactly)
   - Grappling and martial-arts directories where a listing is genuinely warranted

   The value here is **consistency**, not volume. Five listings that agree beat thirty that
   contradict each other. Do not buy a bulk citation service.

## 4. Links from the local community

9. **Pursue legitimate local links** — real relationships, not link buying:
   - **785 Athletics / CrossFit 785** — the club trains in their building. A link from
     their site is accurate, relevant and easy to ask for.
   - **Event and seminar partners**, and any gym whose members come to Sunday open mat.
   - **Manhattan-area organizations** — chamber of commerce, community and recreation
     listings, downtown business associations.
   - **K-State groups** — clubs, intramurals, student organizations, Greek life. A large
     share of the town's under-25 population is on that campus.
   - **Local media** — the Manhattan Mercury, K-State Collegian, local radio. A new gym, a
     free community open mat, or a women's-only class are all real stories.

   Anchor text should be natural ("Manhattan Grapple Club", "their free open mat"), never
   keyword-stuffed.

## 5. Measurement

10. **Connect Google Search Console** for `https://www.manhattangrappleclub.com/`:
    - verify the property (DNS TXT record, or the Vercel domain integration)
    - submit `https://www.manhattangrappleclub.com/sitemap.xml`
    - use **URL Inspection → Request indexing** for the five pages, especially the new
      `/about`
    - check **Page indexing** after a week or two: every page should read "Indexed", and
      nothing should be sitting in "Page with redirect" or "Duplicate, Google chose a
      different canonical"
11. **Track what actually converts**, not just traffic:
    - **Free-trial clicks** — every trial button leaves for Glofox, so site analytics stop
      at the click. Add an analytics tool (Plausible, Fathom, or GA4) and record outbound
      clicks to `app.glofox.com` as the primary conversion.
    - **Calls and directions requests** — both are counted for you in the Google Business
      Profile "Performance" tab. This is usually the largest source of contact for a gym,
      and it never appears in website analytics.
    - **Organic queries** — Search Console's Performance report. Watch the phrases that
      matter locally: *jiu-jitsu Manhattan KS*, *BJJ gym Manhattan KS*, *beginner BJJ
      Manhattan KS*, *women's BJJ Manhattan KS*.

---

## Two things only the club can supply

These are blocking real improvements to the site, and neither can be guessed:

| Missing | What it unblocks |
| --- | --- |
| **Coach Annie's biography** — belt rank, who promoted her, when she started, a few sentences in her own voice | Her coach card on `/` and `/about`. The layout already has space for it; the markup carries a `TODO — COACH ANNIE` comment showing exactly where it goes. Nothing about her is published until it's confirmed. |
| **Class end times**, and which weeks are Gi vs No-Gi | `openingHoursSpecification` in the structured data, which is what lets Google show "Open now" / "Closes at…" in local results. It is deliberately absent today because inferring an end time would publish a false claim. |

## One thing to fix outside this repo

The club's own Glofox checkout page — the page every trial button on this site leads to —
spells the plan **"2-Week Free Trail"** (*trail*, not *trial*), in both the section heading
and the plan card. The website says "trial" correctly throughout. **Only the club can edit
the Glofox plan name.**
