import { test, expect } from '@playwright/test';

test.describe('Video Essays App', () => {
    test.beforeEach(async ({ page }) => {
        // Log console messages
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
        page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

        // Abort YouTube requests to speed up tests and avoid external flakiness
        await page.route('**/youtube.com/**', route => route.abort());
        await page.route('**/www.youtube.com/**', route => route.abort());
    });

    test('can open Video Essays app from desktop', async ({ page }) => {
        // Navigate directly with query params to skip boot
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open Multimedia folder
        const folderIcon = page.getByTestId('desktop-icon-multimedia');
        await expect(folderIcon).toBeVisible({ timeout: 5000 });
        await folderIcon.click();

        const folderWindow = page.getByTestId('window-multimedia');
        await expect(folderWindow).toBeVisible({ timeout: 5000 });

        // Open Video Essays from inside folder
        const appIcon = folderWindow.getByTestId('desktop-icon-video-essays');
        await page.waitForTimeout(500);
        await appIcon.click();

        // Check if window opened using its testId
        const window = page.getByTestId('window-video-essays');
        await expect(window).toBeVisible({ timeout: 5000 });

        // Check for content inside the window
        await expect(window.getByRole('heading', { name: 'Video Essays' })).toBeVisible();
        await expect(window.getByText('Play This: VTOL VR')).toBeVisible();

        // Close window using the generic close button testId within the window
        await window.getByTestId('window-close').click();

        await expect(window).not.toBeVisible();
    });
});
