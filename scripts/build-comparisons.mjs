import { access, cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'comparisons', 'ai-native-cli');
const target = resolve(root, 'dist', 'comparisons', 'ai-native-cli');

async function exists(path) {
  return access(path).then(
    () => true,
    () => false,
  );
}

async function copyIfPresent(from, to) {
  if (await exists(from)) {
    await cp(from, to, { recursive: true });
  }
}

await rm(target, { force: true, recursive: true });
await mkdir(target, { recursive: true });
await cp(resolve(source, 'index.html'), resolve(target, 'index.html'));

const frontendTarget = resolve(target, 'frontend-slides');
await mkdir(frontendTarget, { recursive: true });
for (const item of ['index.html', 'assets', 'review', 'metadata.json', 'ai-native-cli-frontend-slides.pdf']) {
  await copyIfPresent(resolve(source, 'frontend-slides', item), resolve(frontendTarget, item));
}

const slidevTarget = resolve(target, 'slidev');
await mkdir(slidevTarget, { recursive: true });
await copyIfPresent(resolve(source, 'slidev', 'dist'), slidevTarget);
const slidevPresenter = resolve(slidevTarget, 'presenter', '1');
await mkdir(slidevPresenter, { recursive: true });
await copyIfPresent(
  resolve(source, 'slidev', 'dist', 'index.html'),
  resolve(slidevPresenter, 'index.html'),
);
for (const item of ['review', 'metadata.json', 'slides-export.pdf', 'slides-export.pptx']) {
  await copyIfPresent(resolve(source, 'slidev', item), resolve(slidevTarget, item));
}

const revealTarget = resolve(target, 'revealjs');
await mkdir(revealTarget, { recursive: true });
await copyIfPresent(resolve(source, 'revealjs', 'dist'), revealTarget);
for (const item of ['review', 'metadata.json']) {
  await copyIfPresent(resolve(source, 'revealjs', item), resolve(revealTarget, item));
}

for (const engine of ['presenton', 'banana-slides', 'pptagent']) {
  await copyIfPresent(resolve(source, engine), resolve(target, engine));
}
