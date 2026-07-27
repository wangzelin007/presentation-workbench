import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1600, height: 900 },
  },
  webServer: {
    command: 'node scripts/serve-pages.mjs',
    reuseExistingServer: !process.env.CI,
    url: 'http://127.0.0.1:4173/presentation-workbench/',
  },
});
