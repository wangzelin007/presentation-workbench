import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const presentationsRoot = new URL('../presentations/', import.meta.url);
const directories = await readdir(presentationsRoot, { withFileTypes: true });
const entries = [];

for (const directory of directories) {
  if (!directory.isDirectory()) {
    continue;
  }

  const html = await readFile(
    new URL(`${directory.name}/index.html`, presentationsRoot),
    'utf8',
  );
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const description = html
    .match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/s)?.[1]
    ?.trim();

  if (!title || !description) {
    throw new Error(
      `${join('presentations', directory.name, 'index.html')} must include a title and description meta tag.`,
    );
  }

  entries.push({
    title,
    description,
    path: `./presentations/${directory.name}/`,
  });
}

entries.sort((a, b) => a.title.localeCompare(b.title));
await writeFile(
  new URL('catalog.json', presentationsRoot),
  `${JSON.stringify(entries, null, 2)}\n`,
);
