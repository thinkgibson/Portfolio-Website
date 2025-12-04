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

  // Activate the link via keyboard by focusing the link element and pressing Enter
  const link = page.getByRole('link', { name: /Video Page/i });
  await link.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/video');
  const preview = page.getByText('VIDEO PREVIEW');
  await preview.waitFor({ state: 'visible', timeout: 10000 });
  await expect(preview).toBeVisible();
});
