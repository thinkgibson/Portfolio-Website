import { test, expect } from '@playwright/test';

test.describe('Documentaries App', () => {
    test.beforeEach(async ({ page }) => {
        // Log console messages
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
        page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

        // Abort YouTube requests to speed up tests and avoid external flakiness
        await page.route('**/youtube.com/**', route => route.abort());
        await page.route('**/www.youtube.com/**', route => route.abort());
    });

    test('can open Documentaries app from desktop', async ({ page }) => {
        // Navigate directly with query params to skip boot
        await page.goto('/?skipBoot=true&skipWelcome=true');

        // Look for Documentaries icon using testId
        const desktopIcon = page.getByTestId('desktop-icon-documentaries');
        await expect(desktopIcon).toBeVisible({ timeout: 10000 });
        await desktopIcon.dblclick();

        // Check if window opened
        const windowTitle = page.getByText('Documentaries', { exact: true }).first();
        await expect(windowTitle).toBeVisible();

        // Check for content
        await expect(page.getByText('My Documentaries')).toBeVisible();
        await expect(page.getByText('Morristown Bank Vault Documentary')).toBeVisible();

        // Close window
        await page.locator('.win95-window-controls button').last().click();

        await expect(page.getByText('My Documentaries')).not.toBeVisible();
    });

    test('can open Documentaries app from start menu', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true');

        // Open Start Menu
        await page.getByTestId('start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click Documentaries
        await page.getByText('Documentaries', { exact: true }).click();

        // Check window
        await expect(page.getByText('My Documentaries')).toBeVisible();
    });
});
