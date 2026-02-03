import { test, expect } from '@playwright/test';

test.describe('Window Controls', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        // Skip on Webkit due to valid platform bugs (Issue #78)
        if (testInfo.project.name.toLowerCase() === 'webkit') {
            test.skip();
        }

        // Skip boot sequence for faster tests
        await page.goto('/?skipBoot=true');
    });

    test('can open, maximize, and restore a window', async ({ page }) => {
        // Find and click on the "About_Me.doc" icon
        await page.click('text=About_Me.doc');

        const window = page.locator('.win95-beveled.absolute').filter({ hasText: 'About_Me.doc' });
        await expect(window).toBeVisible();

        // Get initial width
        const initialBox = await window.boundingBox();

        // Find maximize button (the second button in the header)
        const maximizeBtn = window.locator('button').nth(1);
        await maximizeBtn.click();

        // Wait for animation to settle
        await page.waitForTimeout(1000);

        const maximizedBox = await window.boundingBox();
        const isMobile = page.viewportSize()?.width! < 600;
        if (!isMobile) {
            // On desktop, window should be at top-left corner and width should increase
            expect(maximizedBox?.x).toBe(0);
            expect(maximizedBox?.y).toBe(0);
            expect(maximizedBox?.width).toBeGreaterThan(initialBox?.width ?? 0);
        } else {
            // On mobile, only ensure width is at least as large as initial (may be full width already)
            expect(maximizedBox?.width).toBeGreaterThanOrEqual(initialBox?.width ?? 0);
        }

        // Click it again to restore
        await maximizeBtn.click();

        // Wait for animation to settle
        await page.waitForTimeout(1000);

        const restoredBox = await window.boundingBox();
        // Use a small margin for sub-pixel differences
        expect(Math.abs((restoredBox?.width ?? 0) - (initialBox?.width ?? 0))).toBeLessThan(1);
        // Ensure position is restored on desktop
        if (page.viewportSize()?.width! >= 600) {
            expect(restoredBox?.x).toBeCloseTo(initialBox?.x ?? 0, 0);
            expect(restoredBox?.y).toBeCloseTo(initialBox?.y ?? 0, 0);
        }
    });

    test('can minimize and restore from taskbar', async ({ page }) => {
        await page.click('text=About_Me.doc');
        const window = page.locator('.win95-beveled.absolute').filter({ hasText: 'About_Me.doc' });

        // Click minimize (first button)
        const minimizeBtn = window.locator('button').nth(0);
        await minimizeBtn.click();

        await expect(window).not.toBeVisible();

        // Find in taskbar and click to restore
        const taskbarBtn = page.locator('button').filter({ hasText: 'About_Me.doc' });
        await taskbarBtn.click();

        await expect(window).toBeVisible();
    });

    test('can close a window', async ({ page }) => {
        await page.click('text=About_Me.doc');
        const window = page.locator('.win95-beveled.absolute').filter({ hasText: 'About_Me.doc' });

        // Click close (third button)
        const closeBtn = window.locator('button').nth(2);
        await closeBtn.click();

        await expect(window).not.toBeAttached();
    });
});
