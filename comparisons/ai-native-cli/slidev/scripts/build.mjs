import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/').at(-1) ??
  process.env.PAGES_REPO_NAME ??
  'presentation-workbench';
const base =
  process.env.SLIDEV_BASE ??
  `/${repositoryName}/comparisons/ai-native-cli/slidev/`;
const slidevCli = resolve(
  import.meta.dirname,
  '..',
  'node_modules',
  '@slidev',
  'cli',
  'bin',
  'slidev.mjs',
);
const result = spawnSync(
  process.execPath,
  [slidevCli, 'build', '--base', base],
  { stdio: 'inherit' },
);

if (result.error) {
  throw result.error;
}
if (result.status !== 0) {
  throw new Error(`Slidev build failed with exit code ${result.status}.`);
}

console.log(`Built Slidev with base ${base}`);
