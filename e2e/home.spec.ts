import { test, expect } from '@playwright/test';

test.describe('Landing and video scene', () => {
  test('landing loads and navigates to video page', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/Portfolio Website|Retro Videos|/i);

    // Landing content
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Welcome to Retro Videos/i);
    const link = page.getByRole('link', { name: /Video Page/i });
    await expect(link).toBeVisible();

    // Navigate
    await link.click();
    await page.waitForURL('**/video');

    // Video page assertions (allow extra time for client rendering)
    const preview = page.getByText('VIDEO PREVIEW');
    await preview.waitFor({ state: 'visible', timeout: 10000 });
    await expect(preview).toBeVisible();

    // VHS tapes are present
    await expect(page.getByText('Neon Nights')).toBeVisible();
    await expect(page.getByText('Arcade High')).toBeVisible();
    await expect(page.getByText('Synthwave Sunday')).toBeVisible();
  });
});
