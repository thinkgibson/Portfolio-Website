import { test, expect } from '@playwright/test';

test.describe('Mobile Window Constraints', () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForLoadState('networkidle');
    });

    test('windows should default to 90% width and height and be centered', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        await page.screenshot({ path: 'after-click-icon.png' });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        // Wait for animations to settle
        await page.waitForTimeout(2000);

        const box = await win.boundingBox();
        const viewport = page.viewportSize();

        if (!box || !viewport) throw new Error('Could not get bounding box or viewport size');

        // Check dimensions (approx 90% of screen)
        // We use a larger tolerance because of potential sub-pixel rendering and borders
        expect(box.width).toBeGreaterThanOrEqual(viewport.width * 0.85);
        expect(box.width).toBeLessThanOrEqual(viewport.width * 0.95);
        expect(box.height).toBeGreaterThanOrEqual(viewport.height * 0.85);
        expect(box.height).toBeLessThanOrEqual(viewport.height * 0.95);

        // Check centering (approx 5% margin)
        expect(box.x).toBeGreaterThanOrEqual(viewport.width * 0.02);
        expect(box.x).toBeLessThanOrEqual(viewport.width * 0.08);
    });

    test('windows should not be moveable on mobile', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        await page.waitForTimeout(1000); // Wait for animation
        const titlebar = win.locator('[data-testid="window-titlebar"]');

        const initialBox = await win.boundingBox();
        if (!initialBox) throw new Error('Could not get initial bounding box');

        // Attempt to drag the window
        await titlebar.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 100, initialBox.y + 100);
        await page.mouse.up();

        const finalBox = await win.boundingBox();
        if (!finalBox) throw new Error('Could not get final bounding box');

        // Position should remain unchanged
        expect(finalBox.x).toBeCloseTo(initialBox.x, 1);
        expect(finalBox.y).toBeCloseTo(initialBox.y, 1);
    });

    test('all functionality should be accessible through touch', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        await page.waitForTimeout(1000); // Wait for animation

        // Test Minimize via touch (simulated by click but with touch context)
        const minimizeBtn = win.locator('[data-testid="window-minimize"]');
        await minimizeBtn.tap();
        await expect(win).not.toBeVisible();

        // Restore from taskbar using tap
        const taskbarBtn = page.locator('button').filter({ hasText: 'Welcome.txt' });
        await taskbarBtn.tap();
        await expect(win).toBeVisible();

        // Test Menu via touch
        await page.locator('span:text("File")').tap();
        await expect(page.locator('text=Close')).toBeVisible();
        await page.locator('text=Close').tap();
        await expect(win).not.toBeAttached();
    });
});
