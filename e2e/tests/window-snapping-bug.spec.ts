import { test, expect } from '@playwright/test';

test.describe('Window Snapping Bug', () => {
    test.beforeEach(async ({ page }) => {
        // Skip boot sequence for faster tests
        await page.goto('/?skipBoot=true');
    });

    test('should not snap to top-right after maximize/restore/reposition', async ({ page }) => {
        // Skip on mobile as dragging behaves differently
        const isMobile = page.viewportSize()?.width! < 600;
        if (isMobile) {
            test.skip();
        }

        // Open a window
        await page.click('text=About_Me.doc');
        const window = page.locator('.win95-beveled.absolute').filter({ hasText: 'About_Me.doc' });
        await expect(window).toBeVisible();

        // Wait for initial animation
        await page.waitForTimeout(500);

        // Get the titlebar for dragging
        const titlebar = window.locator('[data-testid="window-titlebar"]');
        const titlebarBox = await titlebar.boundingBox();
        const initialBox = await window.boundingBox();

        // Drag window to a new position (position A) using mouse actions
        await page.mouse.move(titlebarBox!.x + 10, titlebarBox!.y + 10);
        await page.mouse.down();
        await page.mouse.move(300, 200, { steps: 10 });
        await page.mouse.up();

        // Wait for drag to settle
        await page.waitForTimeout(500);

        // Capture position after first drag
        const afterFirstDragBox = await window.boundingBox();

        // Click maximize button
        const maximizeBtn = window.locator('[data-testid="window-maximize"]');
        await maximizeBtn.click();

        // Wait for maximize animation
        await page.waitForTimeout(1000);

        // Verify window is maximized (at 0,0)
        const maximizedBox = await window.boundingBox();
        expect(maximizedBox?.x).toBe(0);
        expect(maximizedBox?.y).toBe(0);

        // Click maximize again to restore
        await maximizeBtn.click();

        // Wait for restore animation (longer wait for remount due to key prop)
        await page.waitForTimeout(1500);

        // Capture position after restore (may vary slightly due to remount)
        const restoredBox = await window.boundingBox();

        // Now drag to a new position (position B) - this is where the bug occurs
        // The bug: window snaps to wrong position at the BEGINNING of drag, not the end
        const titlebarBox2 = await titlebar.boundingBox();

        // Start drag from current titlebar position
        const startX = titlebarBox2!.x + titlebarBox2!.width / 2;
        const startY = titlebarBox2!.y + titlebarBox2!.height / 2;

        await page.mouse.move(startX, startY);

        // Record position before drag starts
        const beforeDragBox = await window.boundingBox();
        console.log(`Before drag: (${beforeDragBox?.x}, ${beforeDragBox?.y})`);

        // Start the drag
        await page.mouse.down();

        // IMMEDIATELY check position after mousedown - this is where the snap occurs
        // Wait just a tiny bit for any immediate position updates
        await page.waitForTimeout(50);
        const afterMouseDownBox = await window.boundingBox();
        console.log(`Immediately after mousedown: (${afterMouseDownBox?.x}, ${afterMouseDownBox?.y})`);

        // The bug: window jumps to a wrong position when drag starts
        // Check if there's a large unexpected jump from restored position
        const jumpX = Math.abs((afterMouseDownBox?.x ?? 0) - (beforeDragBox?.x ?? 0));
        const jumpY = Math.abs((afterMouseDownBox?.y ?? 0) - (beforeDragBox?.y ?? 0));

        console.log(`Jump on drag start: (${jumpX}, ${jumpY})`);

        // There should be NO jump when drag starts (or minimal due to rounding)
        // If there's a large jump, that's the bug
        expect(jumpX).toBeLessThan(10); // Should be essentially 0, allow small tolerance
        expect(jumpY).toBeLessThan(10);

        // Continue the drag to complete the gesture
        await page.mouse.move(startX + 100, startY + 50, { steps: 10 });
        await page.mouse.up();

        // Wait for drag to settle
        await page.waitForTimeout(500);

        const finalBox = await window.boundingBox();
        console.log(`Final position: (${finalBox?.x}, ${finalBox?.y})`);

    });
});
