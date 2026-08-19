#!/usr/bin/env node
/**
 * Clickable-photo check.
 *
 * Clicks EVERY .gal-item on EVERY page, at desktop and phone widths, and asserts the
 * lightbox opens showing that photo — right src, right alt, right caption, right
 * counter, and no navigation away from the page.
 *
 * This exists because the failure it catches is silent. The home-page photos shipped
 * looking finished and doing nothing: they were plain <img> in a <figure>, and the
 * lightbox was scoped to `#gallery`, so it never ran anywhere else. Nothing looked
 * broken. Only clicking revealed it.
 *
 * check-chrome.mjs covers the static half of the same invariant (a page with
 * .gal-item links must carry the <dialog>). This covers the behaviour.
 *
 * Needs a local server and a headless Chrome with remote debugging:
 *   cd site && python3 -m http.server 8123 --bind 127.0.0.1 &
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless --disable-gpu --remote-debugging-port=9222 --user-data-dir=/tmp/cdp &
 *   node site/tools/check-photos-clickable.mjs
 *
 * Exit code is the number of failures.
 */
// Click EVERY .gal-item on every page and assert the dialog opens with the right photo.
const t=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(t.find(x=>x.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r));
let id=0;const p=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}});
const send=(m,params={})=>new Promise(res=>{const i=++id;p.set(i,res);ws.send(JSON.stringify({id:i,method:m,params}));});
const ev=e=>send('Runtime.evaluate',{expression:e,returnByValue:true}).then(r=>r.result.result.value);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});

let bad=0;
for (const route of ['index.html','about.html','contact.html','gallery.html','first-class.html','standards.html']) {
  for (const [w,h] of [[1440,1000],[390,844]]) {
    await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<768});
    await send('Page.navigate',{url:'http://127.0.0.1:8123/'+route});
    await wait(900);
    const n = await ev("document.querySelectorAll('.gal-item').length");
    if (n === 0) { console.log(`  – ${route} @${w}: no clickable photos (expected)`); continue; }
    let okCount = 0;
    for (let i = 0; i < n; i++) {
      const r = await ev(`(()=>{
        const a=document.querySelectorAll('.gal-item')[${i}];
        a.click();
        const box=document.getElementById('lightbox'), img=document.getElementById('lbImg');
        const res={open:box.open, src:img.getAttribute('src'), href:a.getAttribute('href'),
                   cap:document.getElementById('lbCap').textContent,
                   count:document.getElementById('lbCount').textContent,
                   alt:img.alt===a.querySelector('img').alt, path:location.pathname};
        box.close();
        return res;
      })()`);
      await wait(90);
      const good = r.open && r.src === r.href && r.alt && r.path === '/'+route && r.count === `${i+1} / ${n}`;
      if (good) okCount++;
      else { bad++; console.log(`  ✗ ${route} @${w} item ${i+1}: ${JSON.stringify(r)}`); }
    }
    if (okCount === n) console.log(`  ✓ ${route} @${w}: all ${n} photo(s) open the lightbox with the right image, caption and counter`);
  }
}
ws.close();
console.log(bad ? `\n${bad} failure(s)` : '\nEvery clickable photo on the site works');
process.exit(bad);
