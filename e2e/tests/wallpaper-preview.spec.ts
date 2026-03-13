import { test, expect } from '@playwright/test';

test.describe('Wallpaper Preview Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the desktop, skipping boot sequence and welcome window
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
    });

    test('should preview wallpaper when clicked', async ({ page }) => {
        // Open selector
        await page.getByTestId('desktop-container').click({ button: 'right' });
        await page.getByText('Change wallpaper').click();

        // Initial wallpaper (default is usually forest)
        const desktop = page.getByTestId('desktop-container');
        
        // Select Mountains
        await page.getByTestId('wallpaper-option-mountains').click();

        // Verify desktop background changed (preview)
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'mountains');
        
        // Selector should still be open
        await expect(page.getByTestId('window-desktop-wallpaper')).toBeVisible();
    });

    test('should revert wallpaper when Cancel is clicked', async ({ page }) => {
        // Open selector
        await page.getByTestId('desktop-container').click({ button: 'right' });
        await page.getByText('Change wallpaper').click();

        const desktop = page.getByTestId('desktop-container');
        const initialWpId = await desktop.getAttribute('data-wallpaper-id');

        // Select Autumn (different from initial)
        const newWpId = initialWpId === 'autumn' ? 'mountains' : 'autumn';
        await page.getByTestId(`wallpaper-option-${newWpId}`).click();
        await expect(desktop).toHaveAttribute('data-wallpaper-id', newWpId);

        // Click Cancel
        await page.getByTestId('wallpaper-cancel').click();

        // Selector should be closed
        await expect(page.getByTestId('window-desktop-wallpaper')).not.toBeVisible();

        // Should revert to initial
        await expect(desktop).toHaveAttribute('data-wallpaper-id', initialWpId!);
    });

    test('should revert wallpaper when window is closed via X', async ({ page }) => {
        // Open selector
        await page.getByTestId('desktop-container').click({ button: 'right' });
        await page.getByText('Change wallpaper').click();

        const desktop = page.getByTestId('desktop-container');
        const initialWpId = await desktop.getAttribute('data-wallpaper-id');

        // Select Autumn
        await page.getByTestId('wallpaper-option-autumn').click();
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'autumn');

        // Click Close button (X)
        await page.getByTestId('window-desktop-wallpaper').getByTestId('window-close').click();

        // Should revert to initial
        await expect(desktop).toHaveAttribute('data-wallpaper-id', initialWpId!);
    });

    test('should persist wallpaper when Apply is clicked', async ({ page }) => {
        // Open selector
        await page.getByTestId('desktop-container').click({ button: 'right' });
        await page.getByText('Change wallpaper').click();

        const desktop = page.getByTestId('desktop-container');

        // Select Space
        await page.getByTestId('wallpaper-option-space').click();
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'space');

        // Click Apply
        await page.getByTestId('wallpaper-apply').click();

        // Selector should be closed
        await expect(page.getByTestId('window-desktop-wallpaper')).not.toBeVisible();

        // Check desktop state
        await expect(desktop).toHaveAttribute('data-wallpaper-id', 'space');

        // Reload page
        await page.reload();

        // Check if wallpaper persisted
        await expect(page.getByTestId('desktop-container')).toHaveAttribute('data-wallpaper-id', 'space');
    });
});
