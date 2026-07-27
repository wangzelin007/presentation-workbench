// verify-frontend-slides.mjs — screenshot each slide at 1600x900, check console errors & overflow
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVE_DIR = __dirname;
const REVIEW_DIR = join(__dirname, 'review');
mkdirSync(REVIEW_DIR, { recursive: true });

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.json': 'application/json' };
const server = createServer((req, res) => {
  const decoded = decodeURIComponent(req.url);
  let filePath = join(SERVE_DIR, decoded === '/' ? 'index.html' : decoded);
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(content);
  } catch { res.writeHead(404); res.end('not found'); }
});
const port = await new Promise(r => server.listen(0, () => r(server.address().port)));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push('pageerror: ' + err.message));

await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log('Slide count:', slideCount);

const overflowReport = [];
for (let i = 0; i < slideCount; i++) {
  if (i > 0) {
    // Real keyboard navigation (ArrowRight) via the actual SlidePresentation controller
    await page.keyboard.press('ArrowRight');
  }
  await page.waitForTimeout(850); // allow reveal animation to finish
  const shot = join(REVIEW_DIR, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: shot });

  const check = await page.evaluate((idx) => {
    const slide = document.querySelectorAll('.slide')[idx];
    const stage = document.querySelector('.deck-stage');
    const stageRect = { width: 1920, height: 1080 };
    let overflowing = [];
    slide.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      // Compare against un-scaled stage coords isn't trivial post-transform; check scrollWidth/Height vs slide bounds instead
    });
    const sh = slide.scrollHeight, sw = slide.scrollWidth;
    return { scrollHeight: sh, scrollWidth: sw, clientHeight: slide.clientHeight, clientWidth: slide.clientWidth };
  }, i);
  if (check.scrollHeight > check.clientHeight + 2 || check.scrollWidth > check.clientWidth + 2) {
    overflowReport.push({ slide: i + 1, ...check });
  }
}

await browser.close();
server.close();

console.log('Console errors:', JSON.stringify(consoleErrors, null, 2));
console.log('Overflow report:', JSON.stringify(overflowReport, null, 2));

if (consoleErrors.length > 0) process.exitCode = 2;
if (overflowReport.length > 0) process.exitCode = 3;
