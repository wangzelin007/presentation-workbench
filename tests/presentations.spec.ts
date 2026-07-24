import { expect, test } from '@playwright/test';

test('catalogue lists the example presentation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Presentation Workbench');
  await expect(
    page.getByRole('link', { name: /Welcome to Presentation Workbench/ }),
  ).toBeVisible();
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
