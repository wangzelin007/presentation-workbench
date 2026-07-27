import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'dist');
const prefix = '/presentation-workbench';
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  [
    '.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml'],
]);

async function findFile(pathname) {
  const relative = decodeURIComponent(pathname.slice(prefix.length))
    .replace(/^\/+/, '')
    .replaceAll('/', sep);
  let candidate = resolve(root, relative || 'index.html');

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    return null;
  }

  const details = await stat(candidate).catch(() => null);
  if (details?.isDirectory()) {
    candidate = resolve(candidate, 'index.html');
  }

  return (await stat(candidate).catch(() => null))?.isFile()
    ? candidate
    : null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  if (url.pathname === prefix) {
    response.writeHead(308, { Location: `${prefix}/` });
    response.end();
    return;
  }
  if (!url.pathname.startsWith(`${prefix}/`)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const file = await findFile(url.pathname);
  if (!file) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes.get(extname(file)) ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(response);
});

server.listen(4173, '127.0.0.1', () => {
  console.log(`Pages preview: http://127.0.0.1:4173${prefix}/`);
});
