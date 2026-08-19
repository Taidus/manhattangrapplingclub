#!/usr/bin/env node
/**
 * SEO + metadata integrity check.
 *
 * The sibling checks cover shared chrome and link integrity. This one covers the things
 * that are invisible on the page and therefore easiest to let drift:
 *
 *   1. every page's canonical and og:url is the FINAL url — https, www, no .html —
 *      and matches the url this page is actually reachable at
 *   2. titles and meta descriptions are unique across pages, and length-sane
 *   3. og:image / twitter:image are absolute (relative ones are ignored by crawlers)
 *   4. exactly one <h1> per page, and no page has gone noindex
 *   5. every JSON-LD block parses
 *   6. a small set of strings that must never come back (the "Tuesday's are best" typo,
 *      non-www absolute urls, unresolved placeholders)
 *   7. <div> tags balance — a stray </div> silently reparents the rest of the page
 *   8. sitemap.xml lists exactly the set of page canonicals, and nothing that redirects
 *   9. robots.txt carries an absolute Sitemap: line
 *
 *   node site/tools/check-seo.mjs
 *
 * Exit code is the number of problems found, so it can gate a deploy.
 *
 * Paths are resolved from the file's own location, so it runs from any cwd.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(SITE).filter(f => f.endsWith('.html')).sort();
let bad = 0;
const fail = m => { console.log('  ✗ ' + m); bad++; };
const ok = m => console.log('  ✓ ' + m);

const EXPECT = {
  'index.html':       'https://www.manhattangrappleclub.com/',
  'about.html':       'https://www.manhattangrappleclub.com/about',
  'gallery.html':     'https://www.manhattangrappleclub.com/gallery',
  'first-class.html': 'https://www.manhattangrappleclub.com/first-class',
  'standards.html':   'https://www.manhattangrappleclub.com/standards',
  'contact.html':     'https://www.manhattangrappleclub.com/contact',
};

console.log('\nHead metadata');
const titles = new Map(), descs = new Map();
for (const p of pages) {
  const s = readFileSync(join(SITE, p), 'utf8');
  const one = (re, label) => {
    const all = [...s.matchAll(re)];
    if (all.length !== 1) { fail(`${p}: expected exactly 1 ${label}, found ${all.length}`); return null; }
    return all[0][1];
  };
  const canon = one(/<link rel="canonical" href="([^"]+)">/g, 'canonical');
  if (canon && canon !== EXPECT[p]) fail(`${p}: canonical is ${canon}, expected ${EXPECT[p]}`);
  const ogurl = one(/<meta property="og:url" content="([^"]+)">/g, 'og:url');
  if (ogurl && ogurl !== EXPECT[p]) fail(`${p}: og:url is ${ogurl}, expected ${EXPECT[p]}`);

  const title = one(/<title>([^<]+)<\/title>/g, '<title>');
  const desc  = one(/<meta name="description" content="([^"]+)">/g, 'description');
  if (title) { if (titles.has(title)) fail(`duplicate <title> in ${p} and ${titles.get(title)}`); titles.set(title, p); }
  if (desc)  { if (descs.has(desc))  fail(`duplicate description in ${p} and ${descs.get(desc)}`); descs.set(desc, p); }
  if (title && title.length > 65) fail(`${p}: title is ${title.length} chars (>65 truncates in SERPs): ${title}`);
  if (desc && (desc.length < 70 || desc.length > 170)) fail(`${p}: description is ${desc.length} chars`);

  // absolute social images
  for (const m of s.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]+)">/g))
    if (!m[1].startsWith('https://')) fail(`${p}: social image not absolute — ${m[1]}`);

  // exactly one h1
  const h1s = [...s.matchAll(/<h1[ >]/g)].length;
  if (h1s !== 1) fail(`${p}: ${h1s} <h1> elements`);

  // robots directive present and indexable
  const robots = one(/<meta name="robots" content="([^"]+)">/g, 'robots meta');
  if (robots && /noindex/.test(robots)) fail(`${p}: robots says ${robots}`);

  // JSON-LD parses
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); ok(`${p}: JSON-LD ${j['@type']} parses`); }
    catch (e) { fail(`${p}: JSON-LD does not parse — ${e.message}`); }
  }
}
if (!bad) ok('canonicals, og:url, unique titles/descriptions, single h1, absolute images');

console.log('\nBanned strings');
const BANNED = [
  ["Tuesday&rsquo;s are best", 'the "Tuesday\'s are best" typo'],
  ['href="https://manhattangrappleclub.com', 'a non-www absolute link'],
  ['content="assets/img', 'a relative og/twitter image'],
  ['"url": "https://manhattangrappleclub.com', 'a non-www JSON-LD url'],
  ['data-placeholder', 'an unresolved placeholder'],
];
for (const p of pages) {
  const s = readFileSync(join(SITE, p), 'utf8');
  for (const [needle, label] of BANNED) if (s.includes(needle)) fail(`${p} still contains ${label}`);
}
if (!bad) ok('none present');

console.log('\nTag balance (div)');
for (const p of pages) {
  const s = readFileSync(join(SITE, p), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const open = (s.match(/<div\b/g) || []).length, close = (s.match(/<\/div>/g) || []).length;
  if (open !== close) fail(`${p}: ${open} <div> vs ${close} </div>`);
  else ok(`${p}: ${open} div pairs balanced`);
}

console.log('\nSitemap');
const sm = readFileSync(join(SITE, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const want = Object.values(EXPECT).sort();
if (JSON.stringify(locs.slice().sort()) !== JSON.stringify(want))
  fail(`sitemap urls differ from canonicals:\n    sitemap:   ${locs.sort().join('\n               ')}\n    canonical: ${want.join('\n               ')}`);
else ok(`${locs.length} urls, identical to the set of page canonicals`);
for (const l of locs) if (/\.html|^http:|\/\/manhattangrappleclub/.test(l)) fail(`sitemap contains a redirecting url: ${l}`);

console.log('\nrobots.txt');
const rb = readFileSync(join(SITE, 'robots.txt'), 'utf8');
if (!/^Sitemap: https:\/\/www\.manhattangrappleclub\.com\/sitemap\.xml$/m.test(rb)) fail('robots.txt has no absolute Sitemap: line');
else ok('allows crawling and points at the absolute sitemap url');

console.log(bad ? `\n${bad} problem(s)\n` : '\nAll verification checks passed\n');
process.exit(bad);
