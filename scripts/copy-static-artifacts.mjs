import { access, copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const presentations = resolve(root, 'presentations');
const directories = await readdir(presentations, { withFileTypes: true });

for (const directory of directories) {
  if (!directory.isDirectory()) {
    continue;
  }

  const source = resolve(presentations, directory.name, 'presentation.pdf');
  const exists = await access(source).then(
    () => true,
    () => false,
  );
  if (!exists) {
    continue;
  }

  const target = resolve(
    root,
    'dist',
    'presentations',
    directory.name,
    'presentation.pdf',
  );
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}
