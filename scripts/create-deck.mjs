import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

const [slug, title] = process.argv.slice(2);

if (!slug || !title) {
  throw new Error('Usage: npm run new -- <kebab-case-slug> "Presentation title"');
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error('The slug must use lowercase kebab-case.');
}

const target = new URL(`../presentations/${slug}/index.html`, import.meta.url);

try {
  await access(target);
  throw new Error(`A presentation named "${slug}" already exists.`);
} catch (error) {
  if (error instanceof Error && !('code' in error && error.code === 'ENOENT')) {
    throw error;
  }
}

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character],
  );

const template = await readFile(
  new URL(
    '../.github/skills/create-presentation/assets/deck.html',
    import.meta.url,
  ),
  'utf8',
);
const html = template.replaceAll('{{TITLE}}', escapeHtml(title));

await mkdir(new URL(`../presentations/${slug}/`, import.meta.url), {
  recursive: true,
});
await writeFile(target, html);

console.log(`Created presentations/${slug}/index.html`);
