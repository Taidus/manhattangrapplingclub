---
title: "Product Brief: Manhattan Grapple Club Website Redesign"
status: draft
created: 2026-07-25
updated: 2026-07-25
---

# Product Brief: Manhattan Grapple Club Website Redesign

## Executive Summary

Manhattan Grapple Club is a Brazilian Jiu-Jitsu gym at 511 Richards Drive, Suite A, in Manhattan, Kansas — a college-and-military town anchored by Kansas State University. The club runs five sessions a week, offers a women's-only BJJ class, hosts a free Sunday open mat with no drop-in fee, and gives every newcomer a free two-week trial. That is a genuinely welcoming offer.

The website does not say so. It is a stock GoDaddy template that answers none of it: no price, no instructor named, no low-friction contact. Its most important content — the community standards that tell a nervous beginner what they are walking into — is locked in PDFs that are close to unusable on a phone.

This matters because of *how people arrive*: from a Google Maps pin or a social post, on a phone, giving the site somewhere between ten and forty seconds, mid-decision, with one specific question — when are classes, what does it cost, can I try it, where is it, and who is teaching me. The current site answers one of those five. The redesign is a mobile-first rebuild — thumb-reachable throughout, with no hover states or downloads — that answers all five within one thumb-scroll and converts the answer into a booked trial.

## The Problem

The site is built for a desktop visitor who arrived with patience. The actual visitor has neither.

- **The price is invisible.** Cost is one of the top questions and it appears nowhere. The only path to it is an outbound link into a Glofox portal — a hand-off to a third-party SPA at the exact moment the visitor is deciding. Every click here leaks people.
- **Nobody is named.** No owner, no head instructor, no belt rank, no lineage. In a sport where a stranger will be putting hands on you, anonymity is a trust failure. It is disqualifying for the women's class, which is the club's most differentiated offering.
- **The hero image is stock.** The extracted homepage hero reads as generic office imagery on a jiu-jitsu site. The club has a genuinely good logo — a black, gold, and red badge — that the site barely uses.
- **Key content is a PDF download.** Community standards, safety and hygiene, and sparring etiquette are three separate PDFs. On a phone that is a download, an app switch, and a pinch-zoom.
- **There is no contact path with less friction than a form.** No tel: link, no email, no Instagram, no Google Maps embed. A visitor who wants to just *ask something* has to fill in a form and wait.
- **Schedule detail is thin.** Days and start times exist; end times, gi vs. no-gi for a given night, and what to bring do not — and the last two live in the FAQ, a page away from the schedule.

The status quo cost is measurable in the gap between "found on Google Maps" and "walked through the door."

## Who This Serves

**The K-State student.** Kansas State is in Manhattan; the student population is the town's demographic center of gravity. Price-sensitive, schedule-constrained, socially motivated, discovers things through Instagram and word of mouth. Needs to know it is affordable and that beginners are genuinely welcome. `[ASSUMPTION]` Students are a core segment — plausible from geography, not yet confirmed by the club.

**The military-adjacent adult.** Fort Riley is roughly twenty minutes west, and the local martial arts scene reflects it. Often has prior grappling or combatives exposure, values structure and directness, may be on a posting clock and wants to start now. `[ASSUMPTION]` Same caveat — inferred from the regional landscape, needs client confirmation.

**The complete beginner, and specifically the woman considering the Wednesday class.** Has never grappled. The barrier is not price, it is intimidation: who will be there, will I be the only new person, what happens if I do not know what I am doing, is this safe. The club's FAQ already answers this warmly — "No experience required," "we do jiu-jitsu to get in shape," "a warm welcome and a quick tour." That voice is the single best asset the current site has and it is buried on an FAQ page. Success for this person is walking in without dread.

## The Solution

A fast, mobile-first site — drafted and reviewed locally before it goes anywhere near production — organized around the five arrival questions in the order visitors ask them.

1. **Instant orientation.** Real photography of the actual mats and actual people, the club's badge as the visual anchor, and the one-line answer to "what is this and is it for me."
2. **The schedule as the centerpiece.** All five sessions on one screen, scannable, with the next upcoming class surfaced. No pagination, no separate page.
3. **Price stated on the page.** Membership tiers rendered as real numbers in the design, with the free two-week trial as the primary call to action. Glofox stays as the checkout, but the visitor knows the cost *before* the hand-off.
4. **A named, photographed instructor with credentials.** Who runs the club, what belt, promoted by whom, how long training. This is a trust section, not a bio section.
5. **Location that behaves like a phone should.** Embedded map, one-tap directions, one-tap call, parking and door instructions, and what the building looks like when you pull up.
6. **The FAQ voice, promoted.** Move the existing warm answers out of a buried page and into the flow, next to the decisions they unblock. Convert the three policy PDFs to real, readable web pages.
7. **A persistent trial call to action.** Thumb-reachable, present throughout, never more than one tap from anywhere.

## What Makes This Different

The club's real advantages already exist — they are simply not being communicated.

- **A women's-only BJJ class.** Uncommon in a town this size and a genuine differentiator. It deserves its own treatment, not a row in a table.
- **A free Sunday open mat, no drop-in fee, open to the whole community.** This is an unusually generous, community-first posture. It is a positioning statement and it currently reads as a schedule line item.
- **Beginner-first by design.** "Every class is taught with beginners in mind, but Tuesday's are best" is a better beginner promise than most gyms make, and it is specific enough to be credible.
- **A consistent 7pm weeknight slot.** Trivially memorable, and it fits both a student's and a shift worker's day.

## Success Criteria

- A first-time mobile visitor can answer all five arrival questions — schedule, trial, cost, location, instructor — without leaving the homepage.
- Membership pricing is visible on-site, before any hand-off to Glofox.
- Trial signup is reachable in one tap from any scroll position.
- The head instructor is named, pictured, and credentialed.
- Location supports one-tap directions and one-tap call.
- Loads fast on a mid-range phone over cellular; no layout shift on the hero.
- Meets WCAG AA contrast, has visible focus states, honors `prefers-reduced-motion`, and uses tap targets of at least 44px.
- Zero PDF-gated content.

`[ASSUMPTION]` No analytics exist on the current site, so these are qualitative-by-inspection rather than measured against a baseline. Recommend adding basic analytics at launch so the next iteration has real numbers.

## Scope

**In, for this draft:** a single-page mobile-first homepage carrying all five answers; a real schedule component; a pricing section; an instructor section; a location section with map and tap-to-call; policy content converted from PDF to web; the design system derived from the club badge; local draft only, running from the filesystem with no build step.

**Out, for now:** a CMS or admin UI; replacing Glofox as the booking and payment system; e-commerce or merchandise; a blog or news feed; member login; multi-language; production deployment and DNS changes.

## Open Questions — Client Input Required

These are content gaps, not design gaps. The build proceeds with clearly-marked placeholders where an answer is missing, but each one must be filled before the site goes live, and none may be invented.

1. **Membership pricing** — tier names, amounts, billing period, contract terms.
2. **Owner / head instructor** — name, belt rank, who promoted them, lineage, years training, competition record, and a usable photo.
3. **Phone number and public email.**
4. **Instagram and Facebook** — do they exist, and at what handles.
5. **Class end times**, and how the gi / no-gi weekly rotation is published.
6. **Photography** — real photos of the mats, the building exterior, and training. `[ASSUMPTION]` The only asset currently on hand is the logo. Stock imagery of people who do not train there would undo the trust the rest of the page is trying to build.
7. **Age policy** — adults only, or are there youth classes.

## Vision

Manhattan Grapple Club becomes the obvious first search result and the obvious first visit for anyone in the Little Apple curious about grappling — the gym that a K-State freshman, a soldier posted to Fort Riley, and a thirty-eight-year-old who has never done a martial art all find equally easy to walk into. The site is the front door: honest about price, specific about time and place, and unmistakably staffed by real people who want you there. Everything after that happens on the mats.
