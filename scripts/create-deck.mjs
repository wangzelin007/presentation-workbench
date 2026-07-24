import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

const [slug, title] = process.argv.slice(2);

if (!slug || !title) {
  throw new Error('Usage: npm run new -- <kebab-case-slug> "Presentation title"');
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error('The slug must use lowercase kebab-case.');
}

const deckRoot = new URL(`../presentations/${slug}/`, import.meta.url);
const target = new URL('index.html', deckRoot);

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

await mkdir(deckRoot, { recursive: true });
await writeFile(target, html);
await writeFile(
  new URL('script.json', deckRoot),
  `${JSON.stringify(
    {
      options: {
        title: `${title} rehearsal`,
        highlightColor: '#479ef5',
        readQuestions: false,
        showSecondary: false,
        primaryLang: 'en',
        rate: 0.95,
      },
      segments: [
        { kind: 'ask', tag: 'SLIDE 1', primary: title },
        {
          kind: 'say',
          primary: 'Add the opening narration for this slide.',
        },
      ],
    },
    null,
    2,
  )}\n`,
);

console.log(`Created presentations/${slug}/index.html and script.json`);
console.log(`Next: npm run karaoke -- ${slug}`);
