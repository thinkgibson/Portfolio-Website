import { test, expect } from '@playwright/test';

test.describe('Media Apps Grid Layout', () => {
    test.beforeEach(async ({ page }) => {
        // Log console messages
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
        page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));
    });

    // Helper to open an app via URL (skipping boot) for speed
    // The query params might need adjustment based on app routing or how they open
    // But since these are window apps, we usually open them from desktop.
    // We can simulate opening via desktop icon.

    test('Documentaries app uses grid layout', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open My Portfolio -> Documentaries
        await page.getByTestId('desktop-icon-my-portfolio').click();
        const folderWindow = page.getByTestId('window-my-portfolio');
        await expect(folderWindow).toBeVisible();

        await folderWindow.getByTestId('desktop-icon-documentaries').click();
        const appWindow = page.getByTestId('window-documentaries');
        await expect(appWindow).toBeVisible();

        // Check for grid container
        // The VideoGrid is inside the app. We look for the grid class.
        // It has classes: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        const gridContainer = appWindow.locator('.grid');
        await expect(gridContainer).toBeVisible();
        await expect(gridContainer).toHaveClass(/grid-cols-1/);
        await expect(gridContainer).toHaveClass(/md:grid-cols-2/);
        await expect(gridContainer).toHaveClass(/lg:grid-cols-3/);

        // Check that multiple items present
        const gridItems = gridContainer.locator('.win95-group-box');
        expect(await gridItems.count()).toBeGreaterThan(0);
    });

    test('Video Essays app uses grid layout', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open My Portfolio -> Video Essays
        await page.getByTestId('desktop-icon-my-portfolio').click();
        const folderWindow = page.getByTestId('window-my-portfolio');
        await expect(folderWindow).toBeVisible();

        await folderWindow.getByTestId('desktop-icon-video-essays').click();
        const appWindow = page.getByTestId('window-video-essays');
        await expect(appWindow).toBeVisible();

        const gridContainer = appWindow.locator('.grid');
        await expect(gridContainer).toBeVisible();
        await expect(gridContainer).toHaveClass(/lg:grid-cols-3/);
    });

    test('Livestreams app uses grid layout', async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open My Portfolio -> Livestreams
        await page.getByTestId('desktop-icon-my-portfolio').click();
        const folderWindow = page.getByTestId('window-my-portfolio');
        await expect(folderWindow).toBeVisible();

        await folderWindow.getByTestId('desktop-icon-livestreams').click();
        const appWindow = page.getByTestId('window-livestreams');
        await expect(appWindow).toBeVisible();

        const gridContainer = appWindow.locator('.grid');
        await expect(gridContainer).toBeVisible();
        await expect(gridContainer).toHaveClass(/lg:grid-cols-3/);
    });
});
