import { test, expect } from '@playwright/test';

test.describe('Livestreams App', () => {
    test.beforeEach(async ({ page }) => {
        // Abort YouTube requests to speed up tests
        await page.route('**/youtube.com/**', route => route.abort());
        await page.route('**/www.youtube.com/**', route => route.abort());
    });

    test('can open Livestreams app from desktop folder', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open My Portfolio folder
        const folderIcon = page.getByTestId('desktop-icon-my-portfolio');
        await expect(folderIcon).toBeVisible({ timeout: 30000 });
        await folderIcon.click();

        const folderWindow = page.getByTestId('window-my-portfolio');
        await expect(folderWindow).toBeVisible({ timeout: 15000 });

        // Open Livestreams from inside folder
        const appIcon = folderWindow.getByTestId('desktop-icon-livestreams');
        await appIcon.click();

        // Check if window opened by looking for unique header text
        await expect(page.getByText('My Livestreams')).toBeVisible({ timeout: 20000 });

        // Close window
        const window = page.getByTestId('window-livestreams');
        await window.getByTestId('window-close').click();
        await expect(window).not.toBeVisible();
    });
});
