// Playwright verification for the reveal.js deck.
// Reuses the workspace-root playwright install.
const path = require('path');
const fs = require('fs');

// Resolve playwright from the repo root install so we don't duplicate it here.
const repoRoot = 'C:\\Code\\presentation-workbench';
const playwrightPath = path.join(repoRoot, 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5178';
const OUT  = path.resolve(__dirname, '..', 'review');
const DIST_OUT = path.resolve(__dirname, '..', 'review-dist');

function log(...args) { console.log('[verify]', ...args); }

async function waitForReveal(page) {
  await page.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 15000 });
}

async function gotoSlide(page, idx /* 1-based */) {
  await page.evaluate((i) => new Promise((resolve) => {
    const onChange = () => { window.Reveal.off('slidechanged', onChange); resolve(); };
    if (window.Reveal.getIndices().h === i - 1) return resolve();
    window.Reveal.on('slidechanged', onChange);
    window.Reveal.slide(i - 1, 0, 0);
  }), idx);
  await page.waitForTimeout(80);
}

async function captureSlides(context, baseUrl, outDir, prefix) {
  const errors = [];
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push({ where: prefix + ':pageerror', message: e.message }));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push({ where: prefix + ':console', message: msg.text() }); });
  await page.goto(baseUrl + '/index.html', { waitUntil: 'load' });
  await waitForReveal(page);
  const total = await page.evaluate(() => window.Reveal.getTotalSlides());
  log(`[${prefix}] total slides =`, total);
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 1; i <= total; i++) {
    await gotoSlide(page, i);
    // Overflow check: reveal.js scales the .slides container via transform, so
    // compare scroll vs offset in unscaled slide coordinates.
    const overflow = await page.evaluate(() => {
      const cur = window.Reveal.getCurrentSlide();
      if (!cur) return null;
      const ow = cur.offsetWidth, oh = cur.offsetHeight;
      const sw = cur.scrollWidth, sh = cur.scrollHeight;
      return { offsetW: ow, offsetH: oh, scrollW: sw, scrollH: sh, overflowX: sw > ow + 2, overflowY: sh > oh + 2 };
    });
    const num = String(i).padStart(2, '0');
    const file = path.join(outDir, `slide-${num}.png`);
    await page.screenshot({ path: file, fullPage: false, clip: { x: 0, y: 0, width: 1600, height: 900 } });
    log(`[${prefix}] slide ${num} shot ok overflow=`, overflow ? `${overflow.overflowX || overflow.overflowY}` : 'n/a', overflow);
  }
  await page.close();
  return { total, errors };
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-popup-blocking', '--no-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });

  const report = {};

  // 1. Capture all slides + collect console errors (dev version, node_modules-relative)
  const devCap = await captureSlides(context, BASE, OUT, 'dev');
  report.slideCount = devCap.total;
  report.consoleErrorsDev = devCap.errors;

  // 2. Capture all slides from the self-contained dist copy
  const distCap = await captureSlides(context, BASE + '/dist', DIST_OUT, 'dist');
  report.distSlideCount = distCap.total;
  report.consoleErrorsDist = distCap.errors;

  // 3. Keyboard navigation
  {
    const page = await context.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await waitForReveal(page);
    const before = await page.evaluate(() => window.Reveal.getIndices().h);
    for (let i = 0; i < 15; i++) await page.keyboard.press('ArrowRight');
    const afterRight = await page.evaluate(() => ({ h: window.Reveal.getIndices().h, total: window.Reveal.getTotalSlides() }));
    for (let i = 0; i < 15; i++) await page.keyboard.press('ArrowLeft');
    const afterLeft = await page.evaluate(() => window.Reveal.getIndices().h);
    await page.keyboard.press('Space');
    const afterSpace = await page.evaluate(() => window.Reveal.getIndices().h);
    report.keyboardNav = { start: before, afterRight, afterLeft, afterSpace };
    log('keyboardNav', report.keyboardNav);
    await page.close();
  }

  // 4. Speaker notes popup ("S")
  {
    const page = await context.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await waitForReveal(page);
    await gotoSlide(page, 1);
    const popupPromise = context.waitForEvent('page', { timeout: 10000 });
    await page.keyboard.press('s');
    let popup;
    try {
      popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded');
      await popup.waitForTimeout(1500); // let notes plugin populate DOM
      const title = await popup.title();
      // Notes plugin renders the current slide's notes into an element with class 'notes'
      // We look at the whole popup body text for the expected sentence from slide 1.
      const bodyText = await popup.evaluate(() => document.body.innerText || '');
      const contains = bodyText.includes('one simple idea') || bodyText.includes('AI acting on that person');
      await popup.screenshot({ path: path.join(OUT, 'notes-popup.png'), fullPage: false });
      report.notesPopup = { opened: true, title, containsSlide1Notes: contains, bodyLen: bodyText.length };
      log('notesPopup', report.notesPopup);
      await popup.close();
    } catch (e) {
      report.notesPopup = { opened: false, error: String(e) };
      log('notesPopup ERROR', e.message);
    }
    await page.close();
  }

  // 5. Overview mode ("o")
  {
    const page = await context.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await waitForReveal(page);
    await page.keyboard.press('o');
    await page.waitForTimeout(600);
    const isOverview = await page.evaluate(() => window.Reveal.isOverview());
    const hasClass = await page.evaluate(() => document.querySelector('.reveal') && document.querySelector('.reveal').classList.contains('overview'));
    await page.screenshot({ path: path.join(OUT, 'overview.png'), fullPage: false, clip: { x: 0, y: 0, width: 1600, height: 900 } });
    report.overview = { isOverview, hasClass };
    log('overview', report.overview);
    await page.close();
  }

  // 6. Fullscreen ("F") -- reveal.js v6 core binds "F" to request browser fullscreen
  //    (see the shortcuts help overlay: shortcuts.F = 'Fullscreen'). We verify this
  //    documented binding by opening the built-in Help overlay (Reveal.toggleHelp())
  //    and asserting the DOM lists an "F" -> "Fullscreen" row. We additionally
  //    instrument Element.prototype.requestFullscreen to prove that pressing F in a
  //    keyboard event actually invokes the Fullscreen API on the deck root. Headless
  //    Chromium refuses to enter true OS fullscreen, but observing the API call is
  //    the appropriate verification for "the shortcut is real".
  {
    const page = await context.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await waitForReveal(page);

    // 6a. Open the built-in Help overlay and scrape its shortcut table
    await page.evaluate(() => window.Reveal.toggleHelp(true));
    await page.waitForTimeout(300);
    const helpRows = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.map(r => Array.from(r.querySelectorAll('th,td')).map(c => c.textContent.trim()));
    });
    await page.screenshot({ path: path.join(OUT, 'help-overlay.png'), fullPage: false, clip: { x: 0, y: 0, width: 1600, height: 900 } });
    const fRow = helpRows.find(r => r.some(c => /^F$/.test(c)) && r.some(c => /fullscreen/i.test(c)));
    const fKeyDocumentedShortcut = !!fRow;
    await page.evaluate(() => window.Reveal.toggleHelp(false));
    await page.waitForTimeout(150);

    // 6b. Instrument requestFullscreen and dispatch a real F keydown event.
    const trigger = await page.evaluate(async () => {
      const record = { requestFullscreenCalled: false, target: null };
      const origReq = Element.prototype.requestFullscreen;
      Element.prototype.requestFullscreen = function () {
        record.requestFullscreenCalled = true;
        record.target = this.className || this.tagName;
        return Promise.reject(new Error('headless-blocked-but-called'));
      };
      const ev = new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', keyCode: 70, which: 70, bubbles: true });
      document.dispatchEvent(ev);
      await new Promise(r => setTimeout(r, 200));
      Element.prototype.requestFullscreen = origReq;
      return record;
    });

    report.fullscreen = {
      fKeyDocumentedShortcut,
      helpOverlayFRow: fRow || null,
      requestFullscreenInvoked: trigger.requestFullscreenCalled,
      requestFullscreenTarget: trigger.target,
      note: 'Reveal.js v6 core binds "F" to enter browser fullscreen on the deck root. Headless Chromium cannot actually enter OS fullscreen (no user gesture / no display), but the Fullscreen API IS invoked on keypress, and the built-in help overlay documents the shortcut.'
    };
    log('fullscreen', report.fullscreen);
    await page.close();
  }

  // 7. Print-to-PDF path (?print-pdf)
  {
    const page = await context.newPage();
    const pdfErrors = [];
    page.on('pageerror', (e) => pdfErrors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') pdfErrors.push(m.text()); });
    // Reveal's PDF export CSS requires an emulated print media & a fixed page size that matches slide size.
    await page.emulateMedia({ media: 'print' });
    await page.goto(BASE + '/index.html?print-pdf', { waitUntil: 'load' });
    await page.waitForTimeout(2000); // let print-pdf layout settle
    const pdfPath = path.resolve(__dirname, '..', 'dist', 'ai-native-cli.pdf');
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    await page.pdf({
      path: pdfPath,
      width: '1600px',
      height: '900px',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      pageRanges: '1-'
    });
    const bytes = fs.readFileSync(pdfPath);
    // Count PDF page count by looking for /Type /Page objects (not /Pages)
    const s = bytes.toString('binary');
    const matches = s.match(/\/Type\s*\/Page(?!s)/g) || [];
    report.pdf = { path: pdfPath, sizeBytes: bytes.length, pageCount: matches.length, errors: pdfErrors };
    log('pdf', report.pdf.pageCount, 'pages,', report.pdf.sizeBytes, 'bytes');
    await page.close();
  }

  await context.close();
  await browser.close();

  const reportPath = path.resolve(__dirname, '..', 'review', 'verify-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log('report written:', reportPath);
}

main().catch(err => { console.error(err); process.exit(1); });
