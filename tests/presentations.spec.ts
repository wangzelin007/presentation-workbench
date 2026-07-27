import { expect, test } from '@playwright/test';

test('catalogue exposes the final deck and rehearsal', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'AI-Native CLI — Give AI Its Own Manual',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Present' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rehearse' })).toBeVisible();
});

test('Frontend Slides deck is complete and editable', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/presentations/ai-native-cli/');
  const slides = page.locator('.slide');
  await expect(slides).toHaveCount(11);
  await expect(slides.first()).toHaveClass(/active/);

  await page.keyboard.press('ArrowRight');
  await expect(slides.nth(1)).toHaveClass(/active/);
  await expect(page.locator('#slideCounter')).toHaveText('02 / 11');

  await page.keyboard.press('e');
  await expect(page.locator('#editToggle')).toHaveClass(/active/);
  await expect(page.locator('[data-editable]').first()).toHaveAttribute(
    'contenteditable',
    'true',
  );

  expect(consoleErrors).toEqual([]);
});

test('every Frontend Slides page fits its fixed stage', async ({ page }) => {
  await page.goto('/presentations/ai-native-cli/');
  const slides = page.locator('.slide');

  for (let index = 0; index < 11; index += 1) {
    await page.keyboard.press('Home');
    for (let step = 0; step < index; step += 1) {
      await page.keyboard.press('ArrowRight');
    }
    const slide = slides.nth(index);
    await expect(slide).toHaveClass(/active/);
    const overflow = await slide.evaluate(
      (element) =>
        element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight,
    );
    expect(overflow, `slide ${index + 1} should not overflow`).toBe(false);
  }
});

test('karaoke rehearsal is generated and interactive', async ({ page }) => {
  await page.goto('/presentations/ai-native-cli/karaoke.html');

  await expect(page).toHaveTitle('AI-Native CLI rehearsal');
  await expect(page.getByText('Tap to start')).toBeVisible();
  await expect(page.locator('.seg')).toHaveCount(36);
  await expect(page.locator('body')).not.toContainText('__SEGMENTS__');
});

test('reviewed PDF is published', async ({ request }) => {
  const response = await request.get(
    '/presentations/ai-native-cli/presentation.pdf',
  );
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
});
