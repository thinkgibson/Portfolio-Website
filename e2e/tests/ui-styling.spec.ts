import { test, expect } from '@playwright/test';

test.describe('UI Styling Fixes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Skip boot if visible
        const skipButton = page.getByText('Press any key to skip...');
        if (await skipButton.isVisible()) {
            await page.keyboard.press('Space');
        }
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
        await expect(taskbarItem).toHaveClass(/min-w-\[80px\]/);
        await expect(taskbarItem).toHaveClass(/max-w-\[150px\]/);
    });

    test('Win95 scrollbar applied to Paint', async ({ page }) => {
        // Open Paint
        await page.locator('[data-testid="start-button"]').click();
        await page.locator('text=Paint').click();

        // Check for scrollbar class
        const scrollContainer = page.locator('.scrollbar-win95');
        await expect(scrollContainer).toBeVisible();

        // Verify it is inside the paint window structure
        const paintCanvas = page.locator('[data-testid="paint-canvas"]');
        // The canvas should be inside the scroll container
        await expect(page.locator('.scrollbar-win95 >> [data-testid="paint-canvas"]')).toBeVisible();
    });

    test('Notepad branding and fonts', async ({ page }) => {
        // Open Notepad
        await page.locator('[data-testid="start-button"]').click();
        await page.locator('text=Notepad').click();

        // Check "Rich Text Mode" label
        const label = page.getByText('Rich Text Mode');
        // Should use win95 font and not be italic
        await expect(label).toHaveClass(/font-win95/);
        await expect(label).not.toHaveClass(/italic/);

        // Check Italic button font
        const italicBtn = page.locator('[data-testid="notepad-italic"]');
        await expect(italicBtn).toHaveClass(/font-win95/);
        await expect(italicBtn).not.toHaveClass(/font-serif/);
    });

    test('Window Help menu styling', async ({ page }) => {
        // Open any window (Notepad is already good target)
        await page.locator('[data-testid="start-button"]').click();
        await page.locator('text=Notepad').click();

        // Check Help menu
        // We need to target the Help text in the menu bar specifically
        const helpMenu = page.locator('.window-titlebar').locator('xpath=..').getByText('Help', { exact: true });

        // Verify it exists first
        await expect(helpMenu).toBeVisible();

        // It should not have font-bold class
        await expect(helpMenu).not.toHaveClass(/font-bold/);
    });

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
