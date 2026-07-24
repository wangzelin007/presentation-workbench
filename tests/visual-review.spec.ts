import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

type CatalogueEntry = {
  path: string;
  title: string;
};

const catalogue = JSON.parse(
  readFileSync(new URL('../presentations/catalog.json', import.meta.url), 'utf8'),
) as CatalogueEntry[];

for (const entry of catalogue) {
  test(`capture every slide: ${entry.title}`, async ({ page }) => {
    const route = entry.path.replace(/^\./, '');
    const slug = route.split('/').filter(Boolean).at(-1);
    if (!slug) {
      throw new Error(`Could not derive a slug from "${entry.path}".`);
    }

    const output = resolve('artifacts', 'visual-review', slug);
    await mkdir(output, { recursive: true });
    await page.goto(route);

    const slides = page.locator('.slide');
    const count = await slides.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await page.goto(`${route}#${index + 1}`);
      const slide = slides.nth(index);
      await expect(slide).toBeVisible();
      const images = slide.locator('img');
      for (let imageIndex = 0; imageIndex < (await images.count()); imageIndex += 1) {
        await expect
          .poll(() =>
            images.nth(imageIndex).evaluate(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      await page.waitForTimeout(150);
      await page.screenshot({
        path: resolve(output, `slide-${String(index + 1).padStart(2, '0')}.png`),
      });
    }
  });
}
