import './fluent.js';
import './theme.css';
import catalogue from '../presentations/catalog.json';

type CatalogueEntry = {
  description: string;
  path: string;
  title: string;
};

const container = document.querySelector<HTMLElement>('[data-catalogue]');

if (!container) {
  throw new Error('The catalogue container is missing.');
}

for (const entry of catalogue as CatalogueEntry[]) {
  const card = document.createElement('a');
  card.className = 'catalogue-card';
  card.href = entry.path;

  const label = document.createElement('span');
  label.className = 'eyebrow';
  label.textContent = 'HTML DECK';

  const title = document.createElement('h3');
  title.textContent = entry.title;

  const description = document.createElement('p');
  description.textContent = entry.description;

  card.append(label, title, description);
  container.append(card);
}
