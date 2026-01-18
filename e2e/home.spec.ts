import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/?skipBoot=true');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Portfolio/i);
});

test('hero section is visible', async ({ page }) => {
    await page.goto('/?skipBoot=true');

    // Expect the hero section to be visible
    await expect(page.locator('h1')).toBeVisible();
});
