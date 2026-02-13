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
        await expect(iconLabel).not.toHaveClass(/line-clamp-2/);
        await expect(iconLabel).toHaveClass(/break-words/);

        // Check container width
        const container = page.locator('[data-testid^="desktop-icon-"]').first();
        await expect(container).toHaveClass(/w-28/);
    });

    test('Desktop icons do not overlap vertically with long text', async ({ page }) => {
        // We need two icons that are vertically adjacent.
        // We use the first and second icons in the DOM order, which corresponds to visual order in CSS Grid (column-major or row, but typically top-down in column flow).

        const firstIcon = page.locator('[data-testid^="desktop-icon-"]').nth(0);
        const secondIcon = page.locator('[data-testid^="desktop-icon-"]').nth(1);

        // Force a very long label on the first icon to make it expand vertically
        await firstIcon.locator('span').evaluate((el) => {
            el.textContent = "My Computer With A Very Long Name That Should Wrap Multiple Lines And Expand Height";
        });

        // Get bounding boxes
        const box1 = await firstIcon.boundingBox();
        const box2 = await secondIcon.boundingBox();

        expect(box1).not.toBeNull();
        expect(box2).not.toBeNull();

        if (box1 && box2) {
            // The bottom of the first icon should be effectively above the top of the second icon
            // There might be some gap (gap-8 = 32px), so box1.y + box1.height should be <= box2.y
            expect(box1.y + box1.height).toBeLessThanOrEqual(box2.y);
        }
    });

    test('Taskbar buttons have correct sizing', async ({ page }) => {
        // Open a window to generate a taskbar button
        await page.locator('[data-testid^="desktop-icon-"]').first().click();

        const taskbarItem = page.locator('[data-testid^="taskbar-item-"]').first();

        // Check for min/max width classes we added
        // Use a more flexible check for class names as they might be merged
        await expect(taskbarItem).toHaveAttribute('class', /min-w-\[120px\]/);
        await expect(taskbarItem).toHaveAttribute('class', /max-w-\[300px\]/);
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
        await expect(ctxMenu).toHaveClass(/min-w-60/);
    });
});
