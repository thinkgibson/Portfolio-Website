import { test, expect } from '@playwright/test';

test.describe('Window Taskbar Collision', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true');
    });

    test('window cannot be dragged into the taskbar area', async ({ page }, testInfo) => {
        // Skip on mobile devices since dragging is disabled
        test.skip(testInfo.project.name.includes('Mobile'), 'Window dragging is disabled on mobile devices');

        const TASKBAR_HEIGHT = 48;

        // Open a window
        await page.click('text=About_Me.doc');
        const window = page.locator('div[data-testid="window-about_me.doc"]');
        await expect(window).toBeVisible();

        await page.waitForTimeout(500);

        const titlebar = window.locator('.window-titlebar');
        const titlebarBox = await titlebar.boundingBox();
        if (!titlebarBox) throw new Error('Titlebar not found');

        const viewport = page.viewportSize()!;

        // Drag window toward the bottom of the screen (into taskbar area)
        await page.mouse.move(titlebarBox.x + titlebarBox.width / 2, titlebarBox.y + titlebarBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(titlebarBox.x + titlebarBox.width / 2, viewport.height - 10, { steps: 30 });
        await page.mouse.up();

        await page.waitForTimeout(500);

        // Verify the window's top-left y position is above the taskbar
        const windowBox = await window.boundingBox();
        if (!windowBox) throw new Error('Window not found after drag');

        // The window's y position should be at most viewport.height - TASKBAR_HEIGHT
        expect(windowBox.y).toBeLessThanOrEqual(viewport.height - TASKBAR_HEIGHT);
    });

    test('window is nudged above taskbar on viewport resize', async ({ page }, testInfo) => {
        // Skip on mobile devices
        test.skip(testInfo.project.name.includes('Mobile'), 'Resize test not applicable on mobile');

        const TASKBAR_HEIGHT = 48;

        // Open a window
        await page.click('text=About_Me.doc');
        const window = page.locator('div[data-testid="window-about_me.doc"]');
        await expect(window).toBeVisible();

        // Get initial viewport and window position
        const initialViewport = page.viewportSize()!;

        // Resize viewport to be smaller, potentially pushing window into taskbar area
        await page.setViewportSize({ width: initialViewport.width, height: 400 });
        await page.waitForTimeout(500);

        const windowBox = await window.boundingBox();
        if (!windowBox) throw new Error('Window not found after resize');

        // Window should be nudged to stay above taskbar
        expect(windowBox.y).toBeLessThanOrEqual(400 - TASKBAR_HEIGHT - 10);
    });
});
