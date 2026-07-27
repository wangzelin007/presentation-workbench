import './catalogue.css';
import catalogue from '../presentations/catalog.json';

type CatalogueEntry = {
  description: string;
  path: string;
  rehearsalPath?: string;
  title: string;
};

const container = document.querySelector<HTMLElement>('[data-catalogue]');

if (!container) {
  throw new Error('The catalogue container is missing.');
}

for (const entry of catalogue as CatalogueEntry[]) {
  const card = document.createElement('article');
  card.className = 'catalogue-card';

  const label = document.createElement('span');
  label.className = 'eyebrow';
  label.textContent = 'HTML DECK';

  const title = document.createElement('h3');
  title.textContent = entry.title;

  const description = document.createElement('p');
  description.textContent = entry.description;

  const actions = document.createElement('div');
  actions.className = 'catalogue-card__actions';

  const present = document.createElement('a');
  present.href = entry.path;
  present.textContent = 'Present';

  actions.append(present);

  if (entry.rehearsalPath) {
    const rehearse = document.createElement('a');
    rehearse.href = entry.rehearsalPath;
    rehearse.textContent = 'Rehearse';
    actions.append(rehearse);
  }

  card.append(label, title, description, actions);
  container.append(card);
}
