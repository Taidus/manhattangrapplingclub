#!/usr/bin/env node
/**
 * Launch-blocker manifest (PRD FR-18).
 *
 * Enumerates every `data-placeholder` across ALL pages of the site. Nothing ships to
 * production while this list is non-empty — each entry is a fact only the
 * club can supply, and inventing one would put a false claim about a real
 * business on a real website.
 *
 *   node site/tools/list-placeholders.mjs
 *
 * Exit code is the number of outstanding placeholders, so it can gate a
 * deploy step later if you want one.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return entry === 'tools' ? [] : htmlFiles(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

const strip = (s) =>
  s.replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&rsquo;/g, '’').replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

let total = 0;
const results = [];

for (const file of htmlFiles(siteRoot)) {
  const html = readFileSync(file, 'utf8');
  // Match the opening tag, then take text up to a heuristic close.
  const re = /<(\w+)[^>]*data-placeholder="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const [, , key, inner] = m;
    const line = html.slice(0, m.index).split('\n').length;
    const text = strip(inner);
    results.push({ file: relative(siteRoot, file), line, key, text });
    total++;
  }
}

const BOLD = '[1m', DIM = '[2m', RED = '[31m', RESET = '[0m';

console.log(`\n${BOLD}Outstanding placeholders — client input required${RESET}\n`);

if (!total) {
  console.log('  None. Every fact on the page is client-confirmed.\n');
  process.exit(0);
}

for (const r of results) {
  console.log(`  ${RED}●${RESET} ${BOLD}${r.key}${RESET}`);
  console.log(`    ${DIM}${r.file}:${r.line}${RESET}`);
  console.log(`    ${r.text.slice(0, 190)}${r.text.length > 190 ? '…' : ''}\n`);
}

console.log(`${BOLD}${total} placeholder${total === 1 ? '' : 's'} must be resolved before this goes live.${RESET}\n`);
process.exit(total);
