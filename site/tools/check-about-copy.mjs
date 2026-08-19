#!/usr/bin/env node
/**
 * About-copy exactness check.
 *
 * The About text is client-supplied and was asked for VERBATIM — including the
 * lowercase "Manhattan grapple club" in paragraphs 2 and 3, and the spaced hyphens.
 * Those look like typos, which makes them exactly the kind of thing a later edit
 * "tidies up" without meaning to. This asserts they survive.
 *
 * It compares RENDERED text, not source: entity encoding, source line wrapping and
 * indentation all disappear at textContent, so this is the only comparison that
 * actually proves the published words match what was asked for. It also checks BOTH
 * places the copy appears — the home page and /about — so they cannot drift apart.
 *
 * Needs a local server and a headless Chrome with remote debugging:
 *   cd site && python3 -m http.server 8123 --bind 127.0.0.1 &
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless --disable-gpu --remote-debugging-port=9222 --user-data-dir=/tmp/cdp &
 *   node site/tools/check-about-copy.mjs
 *
 * Exit code is the number of mismatches.
 */
// Compare the RENDERED text of the About block, on both pages, against the exact
// client-supplied copy. Entity encoding, source line wrapping and indentation all
// disappear at this level, so this is the only comparison that actually proves the
// published words match what was asked for.
const EXPECTED = [
"At Manhattan Grapple Club we know that, regardless of who you are, life has a way of forcing you to grapple with something. Our mission at MGC is to provide a space where our members can leave whatever they’re wrestling with in life at the door, step on the mats, and be part of a community.",
"We aim to offer excellent martial arts coaching for everyone - from the beginner to the seasoned grappler in a welcoming and focused environment. Manhattan grapple club is dedicated to excellence in how we serve our members, the education we provide, and in our commitment to continue to grow and learn alongside our athletes.",
"If your goal is to learn new skills, sharpen old ones, develop confidence, or find community, Manhattan grapple club has got your back. Don’t just take our word for it - sign up and try two weeks free on us.",
"See you on the mats!",
];

const t=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(t.find(x=>x.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r));
let id=0;const p=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}});
const send=(m,params={})=>new Promise(res=>{const i=++id;p.set(i,res);ws.send(JSON.stringify({id:i,method:m,params}));});
const ev=e=>send('Runtime.evaluate',{expression:e,returnByValue:true}).then(r=>r.result.result.value);
await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});

let bad=0;
for (const route of ['index.html','about.html']) {
  await send('Page.navigate',{url:'http://127.0.0.1:8123/'+route});
  await new Promise(r=>setTimeout(r,900));
  const got = await ev(`[...document.querySelectorAll('.prose p')].map(p => p.textContent.replace(/\\s+/g,' ').trim())`);
  console.log(`\n${route}  (${got.length} paragraphs)`);
  if (got.length !== EXPECTED.length) { console.log(`  ✗ expected ${EXPECTED.length} paragraphs`); bad++; }
  EXPECTED.forEach((want, i) => {
    const g = got[i];
    if (g === want) console.log(`  ✓ para ${i+1} matches exactly (${want.length} chars)`);
    else {
      bad++;
      console.log(`  ✗ para ${i+1} differs`);
      // show the first differing character
      const n = Math.min(g?.length||0, want.length);
      let k = 0; while (k < n && g[k] === want[k]) k++;
      console.log(`      at char ${k}: got …${JSON.stringify((g||'').slice(Math.max(0,k-25), k+25))}`);
      console.log(`                  want …${JSON.stringify(want.slice(Math.max(0,k-25), k+25))}`);
    }
  });
}
ws.close();
console.log(bad ? `\n${bad} mismatch(es)` : '\nRendered copy is character-for-character identical to the supplied text, on both pages');
process.exit(bad);
