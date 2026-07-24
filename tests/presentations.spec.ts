import { expect, test } from '@playwright/test';

test('catalogue lists the example presentation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Presentation Workbench');
  await expect(
    page.getByRole('heading', { name: 'Welcome to Presentation Workbench' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rehearse' }).first()).toBeVisible();
});

test('karaoke rehearsal is generated and interactive', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/presentations/ai-native-cli/karaoke.html');

  await expect(page).toHaveTitle('AI-Native CLI rehearsal');
  await expect(page.getByText('Tap to start')).toBeVisible();
  await expect(page.locator('.seg')).toHaveCount(36);
  await expect(page.locator('body')).not.toContainText('__SEGMENTS__');
  expect(consoleErrors).toEqual([]);
});

test('AI-native CLI remake fits every slide at 16:9', async ({ page }) => {
  await page.goto('/presentations/ai-native-cli/');

  const slides = page.locator('.slide');
  await expect(slides).toHaveCount(11);

  for (let index = 0; index < 11; index += 1) {
    await page.goto(`/presentations/ai-native-cli/#${index + 1}`);
    const slide = slides.nth(index);
    await expect(slide).toBeVisible();
    const hasOverflow = await slide.evaluate(
      (element) =>
        element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight,
    );
    expect(hasOverflow, `slide ${index + 1} should fit the viewport`).toBe(false);

    const hierarchy = await slide.evaluate((element) => {
      const heading = element.querySelector<HTMLElement>('h1, h2');
      const prose = Array.from(
        element.querySelectorAll<HTMLElement>(
          '.slide__content > p:not(.eyebrow)',
        ),
      );
      return {
        heading: heading
          ? Number.parseFloat(getComputedStyle(heading).fontSize)
          : 0,
        prose: prose.map((item) =>
          Number.parseFloat(getComputedStyle(item).fontSize),
        ),
      };
    });
    expect(hierarchy.heading, `slide ${index + 1} needs a main heading`).toBeGreaterThan(0);
    for (const proseSize of hierarchy.prose) {
      expect(
        hierarchy.heading,
        `slide ${index + 1} heading must be larger than prose`,
      ).toBeGreaterThan(proseSize);
    }
  }
});

test('deck supports keyboard and URL navigation without overflow', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/presentations/welcome/');

  const slides = page.locator('.slide');
  await expect(slides).toHaveCount(4);
  await expect(slides.nth(0)).toBeVisible();
  await expect(page).toHaveURL(/#1$/);

  await page.keyboard.press('ArrowRight');
  await expect(slides.nth(1)).toBeVisible();
  await expect(page).toHaveURL(/#2$/);

  await page.keyboard.press('End');
  await expect(slides.nth(3)).toBeVisible();
  await expect(page).toHaveURL(/#4$/);

  const hasOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
        document.documentElement.clientWidth ||
      document.documentElement.scrollHeight >
        document.documentElement.clientHeight,
  );
  expect(hasOverflow).toBe(false);
  expect(consoleErrors).toEqual([]);
});
