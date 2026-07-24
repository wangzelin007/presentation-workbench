import './fluent.js';
import './theme.css';

const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
const deck = document.querySelector<HTMLElement>('.deck');

if (!deck || slides.length === 0) {
  throw new Error('A deck must contain at least one .slide element.');
}

let activeIndex = Math.min(
  Math.max(Number.parseInt(location.hash.slice(1), 10) - 1 || 0, 0),
  slides.length - 1,
);

const chrome = document.createElement('footer');
chrome.className = 'deck-chrome';
chrome.innerHTML = `
  <p class="deck-chrome__position" aria-live="polite"></p>
  <div class="deck-chrome__progress" aria-hidden="true"><span></span></div>
  <div class="deck-chrome__controls">
    <button type="button" data-action="previous" aria-label="Previous slide">&larr;</button>
    <button type="button" data-action="next" aria-label="Next slide">&rarr;</button>
  </div>
`;
document.body.append(chrome);

function requireElement<T extends Element>(
  parent: ParentNode,
  selector: string,
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`The presentation control "${selector}" is missing.`);
  }
  return element;
}

const position = requireElement<HTMLElement>(chrome, '.deck-chrome__position');
const progress = requireElement<HTMLElement>(
  chrome,
  '.deck-chrome__progress span',
);
const previousButton = requireElement<HTMLButtonElement>(
  chrome,
  '[data-action="previous"]',
);
const nextButton = requireElement<HTMLButtonElement>(
  chrome,
  '[data-action="next"]',
);

function render(): void {
  slides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.hidden = !isActive;
    slide.toggleAttribute('data-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });

  position.textContent = `${activeIndex + 1} / ${slides.length}`;
  progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  previousButton.disabled = activeIndex === 0;
  nextButton.disabled = activeIndex === slides.length - 1;

  const nextHash = `#${activeIndex + 1}`;
  if (location.hash !== nextHash) {
    history.replaceState(null, '', nextHash);
  }
}

function goTo(index: number): void {
  activeIndex = Math.min(Math.max(index, 0), slides.length - 1);
  render();
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

previousButton.addEventListener('click', () => goTo(activeIndex - 1));
nextButton.addEventListener('click', () => goTo(activeIndex + 1));

window.addEventListener('hashchange', () => {
  const requested = Number.parseInt(location.hash.slice(1), 10) - 1;
  if (Number.isInteger(requested)) {
    goTo(requested);
  }
});

window.addEventListener('keydown', (event) => {
  if (isEditable(event.target)) {
    return;
  }

  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goTo(activeIndex + 1);
  } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goTo(activeIndex - 1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    goTo(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    goTo(slides.length - 1);
  } else if (event.key.toLowerCase() === 'f') {
    void (document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen());
  }
});

render();
