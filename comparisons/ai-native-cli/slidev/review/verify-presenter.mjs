import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3040/presenter/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const html = await page.content();
fs.writeFileSync('C:\\Code\\presentation-workbench\\comparisons\\ai-native-cli\\slidev\\review\\presenter-html.txt', html);

// Try many likely selectors
const candidates = ['.slidev-notes', '.slidev-notes-editor', '[class*="notes"]', '[class*="Note"]', '.slidev-page-notes', '#note', '.note'];
for (const sel of candidates) {
  const t = await page.evaluate(s => {
    const el = document.querySelector(s);
    return el ? el.innerText.slice(0, 400) : null;
  }, sel);
  console.log(sel, '=>', t);
}

// Just grab any element containing our expected text
const has = await page.evaluate(() => {
  const target = 'products we build now serve two users';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  const hits = [];
  while ((n = walker.nextNode())) {
    if (n.textContent && n.textContent.toLowerCase().includes(target)) {
      hits.push({ tag: n.parentElement.tagName, cls: n.parentElement.className, txt: n.textContent.slice(0, 200) });
    }
  }
  return hits;
});
console.log('Notes text found in presenter DOM:', JSON.stringify(has, null, 2));

await page.screenshot({ path: 'C:\\Code\\presentation-workbench\\comparisons\\ai-native-cli\\slidev\\review\\presenter-slide-01.png' });

await browser.close();
