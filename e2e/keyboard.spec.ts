import { test, expect } from '@playwright/test';

test('keyboard navigation from landing to video page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Ensure initial focus state
  await page.keyboard.press('Tab');
  // Keep pressing Tab until the link is focused (max 6 tabs to avoid infinite loop)
  let focused = false;
  for (let i = 0; i < 6; i++) {
    const active = await page.evaluate(() => document.activeElement?.textContent || '');
    if (active && /Video Page/i.test(active)) { focused = true; break; }
    await page.keyboard.press('Tab');
  }
  expect(focused).toBeTruthy();

  // Activate the link via keyboard
  await page.keyboard.press('Enter');
  await page.waitForURL('**/video');
  await expect(page.getByText('VIDEO PREVIEW')).toBeVisible();
});
