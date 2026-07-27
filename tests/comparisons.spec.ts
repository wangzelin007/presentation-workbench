import { expect, test } from '@playwright/test';

const root = '/presentation-workbench/comparisons/ai-native-cli';

test('comparison hub exposes every attempted engine', async ({ page }) => {
  await page.goto(`${root}/`);

  for (const engine of [
    'Frontend Slides',
    'Slidev',
    'reveal.js',
    'Presenton',
    'Banana Slides',
    'PPTAgent / DeepPresenter',
  ]) {
    await expect(page.getByRole('heading', { name: engine })).toBeVisible();
  }
});

test('Frontend Slides output is interactive', async ({ page }) => {
  await page.goto(`${root}/frontend-slides/index.html`);

  await expect(page.locator('.slide')).toHaveCount(11);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.slide').nth(1)).toHaveClass(/active/);
});

test('Slidev presenter route renders rehearsal notes', async ({ page }) => {
  await page.goto(`${root}/slidev/presenter/1/`);
  await expect(
    page.getByText('Hi everyone. I want to share one simple idea today.'),
  ).toBeVisible();
});

test('reveal.js output includes native notes', async ({ page }) => {
  await page.goto(`${root}/revealjs/index.html`);

  await expect(page.locator('.reveal .slides > section')).toHaveCount(11);
  await expect(page.locator('aside.notes')).toHaveCount(11);
});

test('AI product exports and run records are published', async ({ request }) => {
  for (const path of [
    `${root}/presenton/ai-native-cli-presenton.pdf`,
    `${root}/presenton/ai-native-cli-presenton.pptx`,
    `${root}/presenton/metadata.json`,
    `${root}/banana-slides/metadata.json`,
    `${root}/pptagent/index.html`,
    `${root}/pptagent/metadata.json`,
  ]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be published`).toBe(true);
  }
});
