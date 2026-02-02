import { test, expect } from '@playwright/test';

test.describe('Video Essays App', () => {
    test.beforeEach(async ({ page }) => {
        // Skip on Mobile Safari due to flaky interactions with Start Menu and Window opening
        if (test.info().project.name === 'Mobile Safari') {
            test.skip();
        }

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
        await expect(folderIcon).toBeVisible({ timeout: 30000 });
        await folderIcon.dblclick();

        const folderWindow = page.getByTestId('window-multimedia');
        await expect(folderWindow).toBeVisible({ timeout: 15000 });

        // Open Video Essays from inside folder
        const appIcon = folderWindow.getByTestId('desktop-icon-video-essays');
        await page.waitForTimeout(500);
        await appIcon.click();

        // Check if window opened using its testId
        const window = page.getByTestId('window-video-essays');
        await expect(window).toBeVisible({ timeout: 15000 });

        // Check for content inside the window
        await expect(window.getByRole('heading', { name: 'Video Essays' })).toBeVisible();
        await expect(window.getByText('Play This: VTOL VR')).toBeVisible();

        // Close window using the generic close button testId within the window
        await window.getByTestId('window-close').click();

        await expect(window).not.toBeVisible();
    });

    test('can open Video Essays app from start menu', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Wait for desktop container to ensure we're ready
        await expect(page.getByTestId('desktop-container')).toBeVisible({ timeout: 30000 });

        // Open Start Menu - using the specific start button testId
        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click Multimedia folder in start menu
        const menuItem = page.getByTestId('start-menu-item-multimedia');
        await expect(menuItem).toBeVisible();
        await menuItem.click();

        // Wait for start menu to close
        await expect(page.getByTestId('start-menu')).not.toBeVisible();

        // Folder window should open
        const folderWindow = page.getByTestId('window-multimedia');
        await expect(folderWindow).toBeVisible({ timeout: 15000 });

        // Open app from folder
        // Open app from folder
        const appIcon = folderWindow.getByTestId('desktop-icon-video-essays');
        await page.waitForTimeout(500); // Wait for folder animation/layout
        await appIcon.click();

        const window = page.getByTestId('window-video-essays');
        await expect(window).toBeVisible({ timeout: 15000 });
        await expect(window.getByRole('heading', { name: 'Video Essays' })).toBeVisible();
    });
});
