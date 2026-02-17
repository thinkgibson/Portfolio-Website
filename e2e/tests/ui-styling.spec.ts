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
        await expect(iconLabel).toHaveClass(/break-all/);

        // Check container width
        const container = page.locator('[data-testid^="desktop-icon-"]').first();
        await expect(container).toHaveClass(/w-36/);
        await expect(container).toHaveClass(/overflow-hidden/);
    });

    test('Desktop icons do not overflow horizontal bounds with long unbreakable text', async ({ page }) => {
        const firstIcon = page.locator('[data-testid^="desktop-icon-"]').nth(0);

        // Force a very long label without spaces
        await firstIcon.locator('span').evaluate((el) => {
            el.textContent = "VeryLongFilenameWithoutSpacesThatShouldBreakAndNotOverflow.txt";
        });

        const containerBox = await firstIcon.boundingBox();
        const spanBox = await firstIcon.locator('span').boundingBox();

        expect(containerBox).not.toBeNull();
        expect(spanBox).not.toBeNull();

        if (containerBox && spanBox) {
            // The span width should be less than or equal to the container width (minus padding potentially)
            // Container is w-36 (144px). Span has px-1 (8px total horizontal padding approx?) 
            // Actually px-1 is 4px * 2 = 8px.
            // But let's just check that spanBox.width <= containerBox.width
            expect(spanBox.width).toBeLessThanOrEqual(containerBox.width);
        }
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

    test('Taskbar divider has symmetric spacing', async ({ page }) => {
        // Get the Start button bounding box
        const startBtn = page.locator('[data-testid="taskbar-start-button"]');
        const startBox = await startBtn.boundingBox();
        expect(startBox).not.toBeNull();

        // Get the divider
        const divider = page.locator('.fixed.bottom-0 > div.w-\\[1px\\]');
        const dividerBox = await divider.boundingBox();
        expect(dividerBox).not.toBeNull();

        // Open a window to generate a taskbar button
        await page.locator('[data-testid^="desktop-icon-"]').first().dblclick();
        const firstWindowBtn = page.locator('[data-testid^="taskbar-item-"]').first();
        const windowBtnBox = await firstWindowBtn.boundingBox();
        expect(windowBtnBox).not.toBeNull();

        if (startBox && dividerBox && windowBtnBox) {
            // Gap 1: Divider Left - Start Right
            const gap1 = dividerBox.x - (startBox.x + startBox.width);

            // Gap 2: Window Left - Divider Right
            const gap2 = windowBtnBox.x - (dividerBox.x + dividerBox.width);

            console.log(`Gap1: ${gap1}, Gap2: ${gap2}`);

            // They should be approximately equal (allow 2px difference)
            expect(Math.abs(gap1 - gap2)).toBeLessThanOrEqual(2);

            // Also assert they are reasonably small (around 4-8px)
            expect(gap1).toBeGreaterThan(0);
            expect(gap1).toBeLessThan(10);
        }
    });
});
