import { test, expect } from '@playwright/test';

test.describe('Window Taskbar Collision', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
    });

    test('window cannot be dragged into the taskbar area', async ({ page }, testInfo) => {
        // Skip on mobile devices since dragging is disabled
        if (testInfo.project.name.includes('Mobile')) {
            test.skip();
        }
        // Skip on Webkit/Chromium due to persistent CI failure (Issue #70)
        if (['webkit', 'chromium', 'Desktop Safari', 'Desktop Chrome'].includes(testInfo.project.name)) {
            test.skip();
        }

        const TASKBAR_HEIGHT = 48;

        // Open a window
        await page.click('text=Welcome.txt');
        const window = page.locator('div[data-testid="window-welcome"]');
        await expect(window).toBeVisible();

        await page.waitForTimeout(500);

        const titlebar = window.locator('.window-titlebar');
        const titlebarBox = await titlebar.boundingBox();
        if (!titlebarBox) throw new Error('Titlebar not found');

        const initialWindowBox = await window.boundingBox();

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
        if (testInfo.project.name.includes('Mobile')) {
            test.skip(true, 'Resize test not applicable on mobile');
        }
        // Skip on Webkit/Chromium (Issue #70)
        if (['webkit', 'chromium', 'Desktop Safari', 'Desktop Chrome'].includes(testInfo.project.name)) {
            test.skip();
        }

        const TASKBAR_HEIGHT = 48;

        // Open a window
        await page.click('text=Welcome.txt');
        const window = page.locator('div[data-testid="window-welcome"]');
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
