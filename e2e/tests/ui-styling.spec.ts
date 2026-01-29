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

    test.skip('Win95 scrollbar applied to Paint', async ({ page }) => {
        test.slow(); // Mark as slow for CI

        // Open Paint using robust selector
        await page.locator('[data-testid="taskbar-start-button"]').click();
        await expect(page.locator('[data-testid="start-menu"]')).toBeVisible();
        await page.waitForTimeout(500); // Wait for animation
        await page.locator('[data-testid="start-menu-item-paint"]').click({ force: true });

        // Wait for paint window to appear to avoid race condition
        await expect(page.locator('[data-testid="paint-canvas"]')).toBeVisible({ timeout: 30000 });

        // Check for scrollbar class
        const scrollContainer = page.locator('.scrollbar-win95');
        await expect(scrollContainer).toBeVisible();

        // Verify it is inside the paint structure
        await expect(page.locator('.scrollbar-win95 >> [data-testid="paint-canvas"]')).toBeVisible();
    });

    test('Notepad branding and fonts', async ({ page }) => {
        test.slow(); // Mark as slow for CI
        test.setTimeout(120000);

        // Open Notepad using robust selector
        await page.locator('[data-testid="taskbar-start-button"]').click();
        await expect(page.locator('[data-testid="start-menu"]')).toBeVisible();
        await page.waitForTimeout(500); // Wait for animation
        await page.locator('[data-testid="start-menu-item-notepad"]').click({ force: true });

        // Wait for window
        await expect(page.locator('[data-testid="notepad-editor"]')).toBeVisible({ timeout: 30000 });

        // Check "Rich Text Mode" label using testId
        const label = page.locator('[data-testid="notepad-status-label"]');
        // Should use win95 font and not be italic
        await expect(label).toBeVisible({ timeout: 30000 });
        await expect(label).toHaveClass(/font-win95/);
        await expect(label).not.toHaveClass(/italic/);

        // Check Italic button font
        const italicBtn = page.locator('[data-testid="notepad-italic"]');
        await expect(italicBtn).toHaveClass(/font-win95/);
        await expect(italicBtn).not.toHaveClass(/font-serif/);
    });

    test('Window Help menu styling', async ({ page }) => {
        test.slow(); // Mark as slow for CI
        test.setTimeout(120000);

        // Open (Notepad is already good target)
        await page.locator('[data-testid="taskbar-start-button"]').click();
        await expect(page.locator('[data-testid="start-menu"]')).toBeVisible();
        await page.waitForTimeout(500); // Wait for animation
        await page.locator('[data-testid="start-menu-item-notepad"]').click({ force: true });

        // Wait for window
        await expect(page.locator('[data-testid="notepad-editor"]')).toBeVisible({ timeout: 30000 });

        // Check Help menu using testId
        const helpMenu = page.locator('[data-testid="menu-help"]');

        // Verify it exists first
        await expect(helpMenu).toBeVisible({ timeout: 30000 });

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
