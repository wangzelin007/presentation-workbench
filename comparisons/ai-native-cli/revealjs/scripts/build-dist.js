// Build a self-contained deployable dist/ folder containing:
//   dist/index.html
//   dist/assets/*.png + deck.css
//   dist/vendor/reveal.js/  (copy of node_modules/reveal.js/dist/)
// The dist/index.html rewrites the reveal.js paths to reference ./vendor/reveal.js/ instead of ./node_modules/reveal.js/dist/.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const vendor = path.join(dist, 'vendor', 'reveal.js');
const srcRevealDist = path.join(root, 'node_modules', 'reveal.js', 'dist');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) rmrf(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(p);
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Preserve any generated PDFs in dist (e.g. from a prior verify run).
const savedPdf = path.join(dist, 'ai-native-cli.pdf');
const pdfBackup = fs.existsSync(savedPdf) ? fs.readFileSync(savedPdf) : null;

rmrf(dist);
fs.mkdirSync(dist, { recursive: true });

// 1. Copy reveal.js dist into dist/vendor/reveal.js
copyDir(srcRevealDist, vendor);

// 2. Copy assets folder (deck.css + images)
copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));

// 3. Rewrite index.html paths for the self-contained copy
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/\.\/node_modules\/reveal\.js\/dist\//g, './vendor/reveal.js/');
fs.writeFileSync(path.join(dist, 'index.html'), html);

// 4. Restore any preserved PDF
if (pdfBackup) fs.writeFileSync(savedPdf, pdfBackup);

console.log('dist built at', dist);
