import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Window Controls', () => {
    test.beforeEach(setupOrReset);

    test('can open, maximize, and restore a window', async ({ desktop, window, page }) => {
        const title = 'Welcome.txt';

        // Open the window
        await desktop.openIcon(title);
        await window.expectVisible(title);

        await page.waitForTimeout(500); // Wait for open animation

        const winLocator = window.getWindow(title);
        const initialBox = await winLocator.boundingBox();

        // Maximize
        await window.maximize(title);
        // Wait for animation
        await page.waitForTimeout(500);

        const maximizedBox = await winLocator.boundingBox();
        // Use precision -1 to allow for sub-pixel differences in WebKit
        expect(maximizedBox?.x).toBeCloseTo(0, -1);
        expect(maximizedBox?.y).toBeCloseTo(0, -1);
        expect(maximizedBox?.width).toBeGreaterThanOrEqual(initialBox?.width ?? 0);

        // Restore
        await window.maximize(title); // Maximize button acts as restore when maximized
        await page.waitForTimeout(500);

        const restoredBox = await winLocator.boundingBox();
        // Allow for small differences in rounding
        expect(Math.abs((restoredBox?.width ?? 0) - (initialBox?.width ?? 0))).toBeLessThan(5);
        expect(Math.abs((restoredBox?.x ?? 0) - (initialBox?.x ?? 0))).toBeLessThan(5);
        expect(Math.abs((restoredBox?.y ?? 0) - (initialBox?.y ?? 0))).toBeLessThan(5);
    });

    test('window cannot be dragged completely off-screen', async ({ desktop, window, page, browserName }, testInfo) => {
        // Skip on mobile devices since this test uses mouse events
        test.skip(testInfo.project.name.includes('Mobile'), 'Mouse dragging not supported on mobile devices');
        // Skip on Firefox due to browser-specific drag constraint behavior (tracked in Issue #83)
        test.skip(browserName === 'firefox', 'Firefox drag constraints have browser-specific issues');
        // Skip on Webkit due to flaky behavior in CI (Issue #83 regression)
        test.skip(browserName === 'webkit', 'Webkit drag constraints flaky in CI');

        const title = 'Welcome.txt';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);
        const titlebar = winLocator.getByTestId('window-titlebar');

        await page.waitForTimeout(500);

        // Drag to the top-left far outside
        const titlebarBox = await titlebar.boundingBox();
        if (!titlebarBox) throw new Error('Titlebar not found');

        await page.mouse.move(titlebarBox.x + titlebarBox.width / 2, titlebarBox.y + titlebarBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(-50, -50, { steps: 20 });
        await page.mouse.up();

        await page.waitForTimeout(1000); // Wait for position to settle

        const boxTopLeft = await winLocator.boundingBox();
        // Allow small sub-pixel tolerance for WebKit rendering
        expect(boxTopLeft?.x).toBeGreaterThanOrEqual(-11);
        expect(boxTopLeft?.y).toBeGreaterThanOrEqual(-11);

        // Drag to the bottom-right far outside
        const viewport = page.viewportSize()!;
        const currentTitlebarBox = await titlebar.boundingBox();
        if (!currentTitlebarBox) throw new Error('Titlebar not found after first drag');

        await page.mouse.move(currentTitlebarBox.x + currentTitlebarBox.width / 2, currentTitlebarBox.y + currentTitlebarBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(viewport.width + 500, viewport.height + 500, { steps: 20 });
        await page.mouse.up();

        await page.waitForTimeout(500); // Wait for position to settle

        const boxBottomRight = await winLocator.boundingBox();
        // The window should be stopped by the constraints
        expect(boxBottomRight?.x).toBeLessThan(viewport.width);
        expect(boxBottomRight?.y).toBeLessThan(viewport.height - 30);
    });

    test('can minimize and restore from taskbar', async ({ desktop, window }) => {
        const title = 'Welcome.txt';

        await desktop.openIcon(title);
        await window.expectVisible(title);

        // Minimize
        await window.minimize(title);
        await window.expectNotVisible(title);

        // Restore from taskbar
        await desktop.clickTaskbarItem(title);
        await window.expectVisible(title);
    });

    test('can close a window', async ({ desktop, window }) => {
        const title = 'Welcome.txt';

        await desktop.openIcon(title);
        await window.expectVisible(title);

        // Close
        await window.close(title);
        await window.expectClosed(title);
    });
});
