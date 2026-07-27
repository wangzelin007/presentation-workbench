import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT = 'C:\\Code\\presentation-workbench\\comparisons\\ai-native-cli\\slidev\\review';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const overflow = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

page.on('console', msg => {
  if (msg.type() === 'error') errors.push({ url: page.url(), text: msg.text() });
});
page.on('pageerror', err => {
  errors.push({ url: page.url(), text: 'PAGEERROR: ' + err.message });
});

for (let i = 1; i <= 11; i++) {
  const url = `http://localhost:3040/${i}?print`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  // Detect overflow inside slide container
  const clip = await page.evaluate(() => {
    const el = document.querySelector('.slidev-page') || document.querySelector('#slide-content') || document.body;
    const r = el.getBoundingClientRect();
    return { scrollH: el.scrollHeight, clientH: el.clientHeight, scrollW: el.scrollWidth, clientW: el.clientWidth };
  });
  if (clip.scrollH > clip.clientH + 4 || clip.scrollW > clip.clientW + 4) {
    overflow.push({ slide: i, ...clip });
  }
  const file = path.join(OUT, `slide-${String(i).padStart(2, '0')}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('Captured', i, file);
}

// Also verify presenter shows notes for slide 1
await page.goto('http://localhost:3040/presenter/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const notesText = await page.evaluate(() => {
  const el = document.querySelector('.slidev-notes') || document.querySelector('[class*="notes"]');
  return el ? el.innerText : null;
});
await page.screenshot({ path: path.join(OUT, 'presenter-slide-01.png'), fullPage: false });
console.log('Presenter notes preview:', notesText && notesText.slice(0, 200));

fs.writeFileSync(path.join(OUT, 'diagnostics.json'), JSON.stringify({ errors, overflow, presenterNotesSample: notesText }, null, 2));
console.log('Errors:', errors.length, 'Overflow:', overflow.length);

await browser.close();
