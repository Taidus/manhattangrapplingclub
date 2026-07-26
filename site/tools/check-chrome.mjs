#!/usr/bin/env node
/**
 * Shared-chrome + link integrity check.
 *
 * The site is four plain static HTML files with no build step, which means the
 * header, footer and sticky CTA are physically duplicated in each one. That is the
 * price of "open it and it works" — this script is what keeps the duplication honest.
 *
 * It asserts:
 *   1. the <header>, <footer> and sticky-CTA blocks are identical across all pages
 *      (ignoring aria-current, which is legitimately per-page)
 *   2. every internal href resolves — the file exists, and any #fragment exists in it
 *   3. no page links to an anchor that lives on a different page without naming the file
 *
 *   node site/tools/check-chrome.mjs
 *
 * Exit code is the number of problems found, so it can gate a deploy.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(SITE).filter((f) => f.endsWith('.html')).sort();
const src = Object.fromEntries(pages.map((p) => [p, readFileSync(join(SITE, p), 'utf8')]));

const BOLD = '\x1b[1m', DIM = '\x1b[2m', RED = '\x1b[31m', GREEN = '\x1b[32m', RESET = '\x1b[0m';
let problems = 0;
const fail = (m) => { console.log(`  ${RED}✗${RESET} ${m}`); problems++; };
const ok = (m) => console.log(`  ${GREEN}✓${RESET} ${m}`);

// ---------------------------------------------------------------- 1. chrome parity
const slice = (html, start, end) => {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a);
  return a === -1 || b === -1 ? null : html.slice(a, b + end.length);
};

// aria-current is per-page by design; normalise it away before comparing.
const normalise = (s) => s.replace(/ aria-current="page"/g, '');

const BLOCKS = [
  ['header', '<header class="site-header"', '</header>'],
  ['footer', '<footer class="site-footer"', '</footer>'],
  ['sticky CTA', '<div class="sticky-cta"', '</div>\n\n<script'],
];

console.log(`\n${BOLD}Shared chrome${RESET}`);
for (const [label, start, end] of BLOCKS) {
  const got = {};
  for (const p of pages) {
    const block = slice(src[p], start, end);
    if (!block) { fail(`${p} is missing its ${label} block`); continue; }
    got[p] = normalise(block);
  }
  const names = Object.keys(got);
  if (names.length < 2) continue;
  const ref = got[names[0]];
  const drifted = names.filter((p) => got[p] !== ref);
  if (drifted.length) fail(`${label} differs in: ${drifted.join(', ')} (reference: ${names[0]})`);
  else ok(`${label} identical across ${names.length} pages`);
}

// --------------------------------------------------------------- 2. link integrity
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const ids = Object.fromEntries(pages.map((p) => [p, idsOf(src[p])]));

console.log(`\n${BOLD}Internal links${RESET}`);
let navCount = 0, assetCount = 0;
const before = problems;
for (const p of pages) {
  // href AND src, so stylesheets, scripts and images are covered too
  for (const m of src[p].matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:|#$)/.test(ref)) continue;

    const [file, frag] = ref.split('#');
    // Navigational: a bare fragment, or a .html page with or without a fragment.
    if (file === '' || file.endsWith('.html')) {
      navCount++;
      const target = file === '' ? p : file;
      if (!pages.includes(target)) { fail(`${p} → ${ref} (no such page)`); continue; }
      if (frag && !ids[target].has(frag)) fail(`${p} → ${ref} (#${frag} not found in ${target})`);
      continue;
    }
    // Everything else is an asset reference — just confirm the file is on disk.
    assetCount++;
    try { readFileSync(join(SITE, file)); }
    catch { fail(`${p} → ${ref} (asset missing on disk)`); }
  }
}
if (problems === before) ok(`${navCount} navigational links resolve, ${assetCount} asset refs exist`);

// ------------------------------------------------------- 3. every page is reachable
console.log(`\n${BOLD}Reachability${RESET}`);
for (const p of pages) {
  const linkedFrom = pages.filter((q) => q !== p && src[q].includes(`href="${p}`));
  if (!linkedFrom.length) fail(`${p} is orphaned — nothing links to it`);
  else ok(`${p} linked from ${linkedFrom.length} page(s)`);
}

console.log(problems
  ? `\n${BOLD}${RED}${problems} problem(s)${RESET}\n`
  : `\n${BOLD}${GREEN}All checks passed${RESET} ${DIM}(${pages.length} pages)${RESET}\n`);
process.exit(problems);
