import { test, expect } from '@playwright/test';

test('backdrop element exists and uses living-room asset', async ({ page }) => {
  await page.goto('http://localhost:3000/video');

  const backdrop = page.locator('.backdrop');
  await expect(backdrop).toBeVisible();

  // Ensure the inline style or computed background references the asset filename
  const bg = await backdrop.evaluate((el) => window.getComputedStyle(el).backgroundImage || el.getAttribute('style'));
  expect(bg).toBeTruthy();
  // simple check for the asset name
  expect(String(bg)).toContain('living-room');
});
