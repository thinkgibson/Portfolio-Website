import { test, expect } from '@playwright/test';

test.describe('UI Styling Fixes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForLoadState('networkidle');
        // Wait for desktop
        await expect(page.locator('[data-testid^="desktop-icon-"]').first()).toBeVisible();
    });

    test('Desktop icons allow text wrapping', async ({ page }) => {
        // Check for the class update on a desktop icon
        const iconLabel = page.locator('[data-testid^="desktop-icon-"] span').first();
        await expect(iconLabel).toHaveClass(/line-clamp-2/);
        await expect(iconLabel).toHaveClass(/break-words/);

        // Check container width
        const container = page.locator('[data-testid^="desktop-icon-"]').first();
        await expect(container).toHaveClass(/w-32/);
    });

    test('Taskbar buttons have correct sizing', async ({ page }) => {
        // Open a window to generate a taskbar button
        await page.locator('[data-testid^="desktop-icon-"]').first().click();

        const taskbarItem = page.locator('[data-testid^="taskbar-item-"]').first();

        // Check for min/max width classes we added
        // Use a more flexible check for class names as they might be merged
        await expect(taskbarItem).toHaveAttribute('class', /min-w-\[80px\]/);
        await expect(taskbarItem).toHaveAttribute('class', /max-w-\[150px\]/);
    });

    // NOTE: UI styling tests for Paint/Notepad removed as they relied on direct
    // Start Menu item access. These apps are now in Accessories submenu.



    test('Context Menu has dynamic width', async ({ page }) => {
        // Right click desktop
        await page.locator('body').click({ button: 'right', position: { x: 300, y: 300 } });

        const ctxMenu = page.locator('[data-testid="desktop-context-menu"]');
        await expect(ctxMenu).toBeVisible();

        // Check allow dynamic width
        await expect(ctxMenu).toHaveClass(/w-auto/);
        await expect(ctxMenu).toHaveClass(/min-w-40/);
    });
});
