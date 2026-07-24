import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = import.meta.dirname;

function presentationEntries(): Record<string, string> {
  const presentationsRoot = resolve(root, 'presentations');
  const entries: Record<string, string> = {
    index: resolve(root, 'index.html'),
  };

  for (const item of readdirSync(presentationsRoot, { withFileTypes: true })) {
    if (item.isDirectory()) {
      entries[`presentations/${item.name}`] = resolve(
        presentationsRoot,
        item.name,
        'index.html',
      );
      const karaoke = resolve(presentationsRoot, item.name, 'karaoke.html');
      if (existsSync(karaoke)) {
        entries[`presentations/${item.name}/karaoke`] = karaoke;
      }
    }
  }

  return entries;
}

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: presentationEntries(),
    },
  },
});
