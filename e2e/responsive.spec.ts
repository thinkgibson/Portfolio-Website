import { test, expect, devices, chromium } from '@playwright/test';

test('mobile layout renders and shows stacked tapes', async () => {
  const context = await chromium.launchPersistentContext('', { ...(devices['iPhone 12']) });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/video');

  // Ensure TV is visible
  await expect(page.getByText('VIDEO PREVIEW')).toBeVisible();

  // Tapes should be present and readable on mobile
  await expect(page.getByText('Neon Nights')).toBeVisible();
  await expect(page.getByText('Arcade High')).toBeVisible();
  await expect(page.getByText('Synthwave Sunday')).toBeVisible();

  await context.close();
});
