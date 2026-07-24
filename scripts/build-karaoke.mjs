import { access, readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(import.meta.dirname, '..');
const presentationsRoot = join(repoRoot, 'presentations');
const requestedSlug = process.argv[2];
const skillRoots = [
  process.env.KARAOKE_PROMPTER_HOME,
  join(homedir(), '.copilot', 'skills', 'karaoke-prompter'),
  join(repoRoot, '.claude', 'skills', 'karaoke-prompter'),
].filter(Boolean);

let skillRoot;
for (const candidate of skillRoots) {
  try {
    await access(join(candidate, 'scripts', 'build_karaoke.py'));
    skillRoot = candidate;
    break;
  } catch {
    // Try the next supported skill installation location.
  }
}

if (!skillRoot) {
  throw new Error(
    'karaoke-prompter is not installed. Install the skill or set KARAOKE_PROMPTER_HOME.',
  );
}

const directories = await readdir(presentationsRoot, { withFileTypes: true });
const slugs = directories
  .filter((item) => item.isDirectory())
  .map((item) => item.name)
  .filter((slug) => !requestedSlug || slug === requestedSlug);

if (requestedSlug && slugs.length === 0) {
  throw new Error(`Presentation "${requestedSlug}" does not exist.`);
}

const python = process.platform === 'win32' ? 'python' : 'python3';
let built = 0;

for (const slug of slugs) {
  const scriptPath = join(presentationsRoot, slug, 'script.json');
  try {
    await access(scriptPath);
  } catch {
    continue;
  }

  const result = spawnSync(
    python,
    [
      join(skillRoot, 'scripts', 'build_karaoke.py'),
      scriptPath,
      '--template',
      join(skillRoot, 'templates', 'karaoke.html'),
      '--out',
      join(presentationsRoot, slug, 'karaoke.html'),
    ],
    { encoding: 'utf8', stdio: 'inherit' },
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Karaoke build failed for "${slug}".`);
  }
  built += 1;
}

if (built === 0) {
  throw new Error('No script.json files were found to build.');
}
