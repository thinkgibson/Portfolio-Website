
import { test, expect } from '@playwright/test';

test.describe('Iframe Dragging', () => {
    // usage of iframes with Framer Motion drag gestures in a headless environment.
    test.fixme('should be able to drag window over iframe content', async ({ page, isMobile }) => {
        // Dragging is disabled on mobile
        if (isMobile) test.skip();

        // 1. Open the "Livestreams" app which contains iframes
        await page.goto('/?skipBoot=true');
        await page.click('[data-testid="desktop-icon-livestreams"]');

        // Wait for window to appear
        const window = page.locator('[data-testid="window-livestreams"]');
        await expect(window).toBeVisible();

        // 2. Get initial bounding box
        const initialBox = await window.boundingBox();
        expect(initialBox).not.toBeNull();
        if (!initialBox) return;

        // 3. Perform drag operation
        // We want to drag from the titlebar
        const titlebar = page.locator('[data-testid="window-livestreams"] [data-testid="window-titlebar"]');

        // Calculate drag start and end points
        // Drag by a significant amount to ensure we are moving over the iframe area relative to the screen
        const dragX = 200;
        const dragY = 100;

        await titlebar.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + dragX, initialBox.y + dragY, { steps: 10 });
        await page.mouse.up();

        // 4. Verify new position
        const finalBox = await window.boundingBox();
        expect(finalBox).not.toBeNull();
        if (!finalBox) return;

        // The window should have moved closer to the target coordinates
        // We allow some tolerance, but it should definitely have moved
        expect(finalBox.x).toBeGreaterThan(initialBox.x);
        expect(finalBox.y).toBeGreaterThan(initialBox.y);

        // Specifically check if it moved approximately the drag distance
        // Note: Constraints might affect exact position, but for this test we expect it to move freely in the middle of the screen
        expect(Math.abs((finalBox.x - initialBox.x) - dragX)).toBeLessThan(20);
        expect(Math.abs((finalBox.y - initialBox.y) - dragY)).toBeLessThan(20);
    });
});
