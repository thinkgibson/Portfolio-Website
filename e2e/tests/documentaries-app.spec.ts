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
        // Initial visibility can be slow due to hydration
        await expect(desktopIcon).toBeVisible({ timeout: 30000 });
        await desktopIcon.dblclick();

        // Check if window opened using its testId
        const window = page.getByTestId('window-documentaries');
        await expect(window).toBeVisible({ timeout: 15000 });

        // Check for content inside the window
        await expect(window.getByText('My Documentaries')).toBeVisible();
        await expect(window.getByText('Morristown Bank Vault Documentary')).toBeVisible();

        // Close window using the generic close button testId within the window
        await window.getByTestId('window-close').click();

        await expect(page.getByText('My Documentaries')).not.toBeVisible();
    });

    test('can open Documentaries app from start menu', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true');

        // Wait for desktop container to ensure we're ready
        await expect(page.getByTestId('desktop-container')).toBeVisible({ timeout: 30000 });

        // Open Start Menu - using the specific start button testId
        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click Documentaries in start menu
        const menuItem = page.getByTestId('start-menu-item-documentaries');
        await expect(menuItem).toBeVisible();
        await menuItem.click();

        // Check window
        const window = page.getByTestId('window-documentaries');
        await expect(window).toBeVisible({ timeout: 15000 });
        await expect(window.getByText('My Documentaries')).toBeVisible();
    });
});
