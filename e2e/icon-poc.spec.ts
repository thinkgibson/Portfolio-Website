import { test, expect } from '@playwright/test';

test.describe('Custom Icon Verification', () => {
    test('should render custom icon image for configured app', async ({ page }) => {
        await page.goto('/');

        // Find the desktop icon for Notepad
        const notepadIcon = page.getByTestId('desktop-icon-notepad');
        await expect(notepadIcon).toBeVisible();

        // Check if it contains an img tag with the correct src
        const img = notepadIcon.locator('img');
        await expect(img).toBeVisible();
        await expect(img).toHaveAttribute('src', '/icons/poc-icon.svg');
    });

    test('should render default SVG for non-configured app', async ({ page }) => {
        await page.goto('/');

        // Find My Computer icon which is set to null (default)
        const myComputerIcon = page.getByTestId('desktop-icon-my-computer');
        await expect(myComputerIcon).toBeVisible();

        // Should NOT have an img tag (unless the default is an img, but our defaults are SVGs)
        // Note: Our DynamicIcon renders <IconComponent> which usually returns an <svg>.
        // Ideally we check for SVG presence.
        const svg = myComputerIcon.locator('svg');
        await expect(svg).toBeVisible();
        // And ensure no img tag
        await expect(myComputerIcon.locator('img')).toHaveCount(0);
    });
});
