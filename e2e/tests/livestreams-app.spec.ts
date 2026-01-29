import { test, expect } from '@playwright/test';

test.describe('Livestreams App', () => {
    test.beforeEach(async ({ page }) => {
        // Abort YouTube requests to speed up tests
        await page.route('**/youtube.com/**', route => route.abort());
        await page.route('**/www.youtube.com/**', route => route.abort());
    });

    test('can open Livestreams app from desktop folder', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open Multimedia folder
        const folderIcon = page.getByTestId('desktop-icon-multimedia');
        await expect(folderIcon).toBeVisible({ timeout: 30000 });
        await folderIcon.dblclick();

        const folderWindow = page.getByTestId('window-multimedia');
        await expect(folderWindow).toBeVisible({ timeout: 15000 });

        // Open Livestreams from inside folder
        const appIcon = folderWindow.getByTestId('desktop-icon-livestreams');
        await appIcon.dblclick();

        // Check if window opened by looking for unique header text
        await expect(page.getByText('My Livestreams')).toBeVisible({ timeout: 20000 });

        // Close window
        const window = page.getByTestId('window-livestreams');
        await window.getByTestId('window-close').click();
        await expect(window).not.toBeVisible();
    });

    test('can open Livestreams from terminal', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open terminal via Start Menu -> Accessories -> Command Prompt (Proven path)
        await page.click('[data-testid="taskbar-start-button"]');
        await page.locator('[data-testid="start-menu-item-accessories"]').click();
        await expect(page.locator('[data-testid="window-accessories"]')).toBeVisible();
        await page.locator('[data-testid="window-accessories"] [data-testid="desktop-icon-command-prompt"]').dblclick();

        // Check if terminal window is open
        const terminalWindow = page.locator('[data-testid="window-command-prompt"]');
        await expect(terminalWindow).toBeVisible();

        const input = page.locator('.custom-terminal input');

        // Type open command
        await input.fill('open livestreams');
        await input.press('Enter');

        // Check if window opened by looking for unique header text
        await expect(page.getByText('My Livestreams')).toBeVisible({ timeout: 20000 });
    });
});
