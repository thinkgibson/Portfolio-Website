import { test, expect } from '@playwright/test';

test.describe('Wallpaper Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the desktop, skipping boot sequence and welcome window
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
    });

    test('should open wallpaper selector from desktop context menu', async ({ page }) => {
        // Right-click on desktop
        await page.getByTestId('desktop-container').click({ button: 'right' });

        // Click "Change wallpaper"
        await page.getByText('Change wallpaper').click();

        // Check if selector window is open
        await expect(page.getByTestId('window-desktop-wallpaper')).toBeVisible();
        await expect(page.getByText('Select a wallpaper for your desktop:')).toBeVisible();
    });

    test('should apply wallpaper and persist after reload', async ({ page }) => {
        // Open selector
        await page.getByTestId('desktop-container').click({ button: 'right' });
        await page.getByText('Change wallpaper').click();

        // Select Forest
        await page.getByTestId('wallpaper-option-forest').click();

        // Click Apply
        await page.getByTestId('wallpaper-apply').click();

        // Selector should be closed
        await expect(page.getByTestId('window-desktop-wallpaper')).not.toBeVisible();

        // Check desktop state through data attribute
        const desktop = page.getByTestId('desktop-container');
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'forest');

        // Reload page
        await page.reload();

        // Check if wallpaper persisted
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'forest');
    });

    test('should cancel wallpaper change', async ({ page }) => {
        // Open selector
        await page.getByTestId('desktop-container').click({ button: 'right' });
        await page.getByText('Change wallpaper').click();

        // Select Forest
        await page.getByTestId('wallpaper-option-forest').click();

        // Click Cancel
        await page.getByTestId('wallpaper-cancel').click();

        // Selector should be closed
        await expect(page.getByTestId('window-desktop-wallpaper')).not.toBeVisible();

        // Check desktop state (should still be default forest)
        const desktop = page.getByTestId('desktop-container');
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'forest');
        const bgImage = await desktop.evaluate(el => window.getComputedStyle(el).backgroundImage);
        expect(bgImage).toContain('forest.png');
    });
});
