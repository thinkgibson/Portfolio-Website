import { test, expect } from '@playwright/test';

test.describe('Window Position Persistence', () => {
    test.beforeEach(async ({ page }) => {
        // Skip boot sequence and welcome window for faster tests
        await page.goto('/?skipBoot=true&skipWelcome=true');
    });

    test('persists window position after closing and reopening', async ({ page }) => {
        const isMobile = page.viewportSize()?.width! < 640;
        if (isMobile) {
            test.skip(true, 'Window dragging is disabled on mobile');
            return;
        }

        // 1. Open a window
        await page.click('text=About_Me.doc');
        const window = page.locator('div[data-testid="window-about_me.doc"]');
        await expect(window).toBeVisible();

        // 2. Move the window
        const titlebar = window.locator('.window-titlebar');
        const initialBox = await window.boundingBox();
        if (!initialBox) throw new Error('Could not get initial bounding box');

        // Drag the window by 200, 200
        const startX = initialBox.x + initialBox.width / 2;
        const startY = initialBox.y + 12;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.waitForTimeout(100); // Small delay to ensure drag is registered
        // Move in steps to simulate real dragging - use more steps for WebKit reliability
        await page.mouse.move(startX + 200, startY + 200, { steps: 100 });
        await page.mouse.up();

        // Wait for state to settle
        await page.waitForTimeout(1000);

        const movedBox = await window.boundingBox();
        if (!movedBox) throw new Error('Could not get moved bounding box');

        // Ensure it actually moved
        expect(movedBox.x).toBeGreaterThan(initialBox.x + 150);
        expect(movedBox.y).toBeGreaterThan(initialBox.y + 150);

        // 3. Close the window
        await window.locator('button[data-testid="window-close"]').click();
        await expect(window).not.toBeAttached();

        // 4. Reopen the window
        await page.click('text=About_Me.doc');
        await expect(window).toBeVisible();

        // Give it a moment to apply the saved position
        await page.waitForTimeout(500);

        // 5. Verify it's at the moved position
        const reopenedBox = await window.boundingBox();
        if (!reopenedBox) throw new Error('Could not get reopened bounding box');

        expect(Math.abs(reopenedBox.x - movedBox.x)).toBeLessThan(10);
        expect(Math.abs(reopenedBox.y - movedBox.y)).toBeLessThan(10);
    });

    test('persists window position after page refresh', async ({ page }) => {
        const isMobile = page.viewportSize()?.width! < 640;
        if (isMobile) {
            test.skip(true, 'Window dragging is disabled on mobile');
            return;
        }

        // 1. Open a window and move it
        await page.click('text=About_Me.doc');
        const window = page.locator('div[data-testid="window-about_me.doc"]');
        const initialBox = await window.boundingBox();
        if (!initialBox) throw new Error('Could not get initial bounding box');

        const startX = initialBox.x + initialBox.width / 2;
        const startY = initialBox.y + 12;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 250, startY + 250, { steps: 20 });
        await page.mouse.up();

        await page.waitForTimeout(1000);

        const movedBox = await window.boundingBox();
        if (!movedBox) throw new Error('Could not get moved bounding box');

        // 2. Refresh the page
        await page.reload({ waitUntil: 'networkidle' });

        // 3. Reopen the window
        await page.click('text=About_Me.doc');
        await expect(window).toBeVisible();

        await page.waitForTimeout(500);

        // 4. Verify it's at the moved position
        const refreshedBox = await window.boundingBox();
        if (!refreshedBox) throw new Error('Could not get refreshed bounding box');

        expect(Math.abs(refreshedBox.x - movedBox.x)).toBeLessThan(10);
        expect(Math.abs(refreshedBox.y - movedBox.y)).toBeLessThan(10);
    });
});
