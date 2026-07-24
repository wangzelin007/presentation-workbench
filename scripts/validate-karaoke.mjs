import { access, readFile, readdir } from 'node:fs/promises';

const presentationsRoot = new URL('../presentations/', import.meta.url);
const directories = await readdir(presentationsRoot, { withFileTypes: true });

for (const directory of directories) {
  if (!directory.isDirectory()) {
    continue;
  }

  const deckRoot = new URL(`${directory.name}/`, presentationsRoot);
  const scriptPath = new URL('script.json', deckRoot);
  const karaokePath = new URL('karaoke.html', deckRoot);

  await access(scriptPath).catch(() => {
    throw new Error(`${directory.name} is missing script.json.`);
  });
  await access(karaokePath).catch(() => {
    throw new Error(
      `${directory.name} is missing karaoke.html. Run: npm run karaoke -- ${directory.name}`,
    );
  });

  const source = JSON.parse(await readFile(scriptPath, 'utf8'));
  if (!Array.isArray(source.segments) || source.segments.length === 0) {
    throw new Error(`${directory.name}/script.json has no segments.`);
  }

  const generated = await readFile(karaokePath, 'utf8');
  if (/__SEGMENTS__|__OPTIONS__|__TITLE__/.test(generated)) {
    throw new Error(`${directory.name}/karaoke.html contains unfilled placeholders.`);
  }
}
