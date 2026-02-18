import { test, expect } from '@playwright/test';

test.describe('Mobile Window Constraints', () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForLoadState('networkidle');
    });

    test('windows should open maximized (fill viewport) on mobile', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        await page.waitForTimeout(500);

        const box = await win.boundingBox();
        const viewport = page.viewportSize();

        if (!box || !viewport) throw new Error('Could not get bounding box or viewport size');

        // Maximized window should fill the viewport width
        expect(box.width).toBeGreaterThanOrEqual(viewport.width * 0.95);
        // Maximized window should fill most of the viewport height (minus taskbar)
        expect(box.height).toBeGreaterThanOrEqual(viewport.height * 0.7);
    });

    test('maximize/restore button should NOT be visible on mobile', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();

        // The maximize button should not be present
        const maximizeBtn = win.locator('[data-testid="window-maximize"]');
        await expect(maximizeBtn).not.toBeVisible();
    });

    test('"Maximize" menu item should NOT be visible in File menu on mobile', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();

        // Open File menu
        await win.locator('[data-testid="menu-file"]').click();

        // Maximize item should not be present
        await expect(page.locator('text=Maximize')).not.toBeVisible();

        // But Minimize and Close should still be present
        await expect(page.locator('text=Minimize')).toBeVisible();
        await expect(page.locator('text=Close')).toBeVisible();

        // Close the menu
        await page.keyboard.press('Escape');
    });

    test('minimize still works on mobile (window goes to taskbar and can be restored)', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        await page.waitForTimeout(500);

        // Minimize via button
        const minimizeBtn = win.locator('[data-testid="window-minimize"]');
        await minimizeBtn.tap();
        await expect(win).not.toBeVisible();

        // Restore from taskbar
        const taskbarBtn = page.locator('button').filter({ hasText: 'Welcome.txt' });
        await taskbarBtn.tap();
        await expect(win).toBeVisible();
    });

    test('windows should not be moveable on mobile', async ({ page, browserName }) => {
        // Skip on Firefox/Webkit due to flakiness in mobile emulation
        test.skip(browserName === 'firefox' || browserName === 'webkit', 'Skipping flaky mobile test on Firefox/Webkit');
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

test.describe('Tablet Window Constraints', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForLoadState('networkidle');
    });

    test('windows should open maximized (fill viewport) on tablet', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        await page.waitForTimeout(500);

        const box = await win.boundingBox();
        const viewport = page.viewportSize();

        if (!box || !viewport) throw new Error('Could not get bounding box or viewport size');

        // Maximized window should fill the viewport width
        expect(box.width).toBeGreaterThanOrEqual(viewport.width * 0.95);
        // Maximized window should fill most of the viewport height (minus taskbar)
        expect(box.height).toBeGreaterThanOrEqual(viewport.height * 0.7);
    });

    test('maximize/restore button should NOT be visible on tablet', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();

        const maximizeBtn = win.locator('[data-testid="window-maximize"]');
        await expect(maximizeBtn).not.toBeVisible();
    });

    test('"Maximize" menu item should NOT be visible in File menu on tablet', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();

        await win.locator('[data-testid="menu-file"]').click();
        await expect(page.locator('text=Maximize')).not.toBeVisible();
        await expect(page.locator('text=Minimize')).toBeVisible();
        await page.keyboard.press('Escape');
    });
});

test.describe('Desktop Window Constraints', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForLoadState('networkidle');
    });

    test('windows should NOT be maximized by default on desktop', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();
        await page.waitForTimeout(500);

        const box = await win.boundingBox();
        const viewport = page.viewportSize();

        if (!box || !viewport) throw new Error('Could not get bounding box or viewport size');

        // Window should NOT fill the full viewport width on desktop
        expect(box.width).toBeLessThan(viewport.width * 0.95);
    });

    test('maximize button should be visible on desktop', async ({ page }) => {
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        const win = page.locator('[data-testid="window-welcome.txt"]');
        await expect(win).toBeVisible();

        const maximizeBtn = win.locator('[data-testid="window-maximize"]');
        await expect(maximizeBtn).toBeVisible();
    });
});
