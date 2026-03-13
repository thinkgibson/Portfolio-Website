import { test, expect } from '@playwright/test';

test.describe('Mobile Context Menu', () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForLoadState('networkidle');
    });

    test('long-press on desktop shows context menu', async ({ page }) => {
        const desktop = page.getByTestId('desktop-container');
        
        // Simulate long press
        await desktop.dispatchEvent('pointerdown', { clientX: 100, clientY: 100, button: 0, pointerType: 'touch' });
        await page.waitForTimeout(600); // delay is 500ms
        
        const contextMenu = page.getByTestId('desktop-context-menu');
        await expect(contextMenu).toBeVisible();
        
        // Check positioning (should be near tip, but constrained)
        const box = await contextMenu.boundingBox();
        expect(box?.x).toBeGreaterThanOrEqual(8);
        expect(box?.y).toBeGreaterThanOrEqual(8);
    });

    test('long-press on taskbar item shows context menu', async ({ page }) => {
        // Open a window first
        await page.click('[data-testid="desktop-icon-welcome.txt"]', { force: true });
        await expect(page.locator('[data-testid="window-welcome.txt"]')).toBeVisible();
        
        const taskbarItem = page.getByTestId('taskbar-item-welcome.txt');
        await expect(taskbarItem).toBeVisible();

        const itemBox = await taskbarItem.boundingBox();
        if (!itemBox) throw new Error('Taskbar item box not found');

        // Long press on taskbar item
        await taskbarItem.dispatchEvent('pointerdown', { 
            clientX: itemBox.x + 20, 
            clientY: itemBox.y + 10, 
            button: 0,
            pointerType: 'touch'
        });
        await page.waitForTimeout(600);

        const contextMenu = page.getByTestId('taskbar-context-menu');
        await expect(contextMenu).toBeVisible();
        await expect(contextMenu.getByText('Minimize')).toBeVisible();
    });

    test('context menu is constrained within mobile viewport', async ({ page }) => {
        const desktop = page.getByTestId('desktop-container');
        const viewport = page.viewportSize()!;

        // Long press near bottom-right edge
        await desktop.dispatchEvent('pointerdown', { 
            clientX: viewport.width - 10, 
            clientY: viewport.height - 100, 
            button: 0,
            pointerType: 'touch'
        });
        await page.waitForTimeout(600);

        const contextMenu = page.getByTestId('desktop-context-menu');
        await expect(contextMenu).toBeVisible();

        const box = await contextMenu.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
            // Should be adjusted to stay within viewport
            expect(box.x + box.width).toBeLessThanOrEqual(viewport.width - 8);
            expect(box.y + box.height).toBeLessThanOrEqual(viewport.height - 8);
        }
    });

    test('tapping on desktop shows context menu', async ({ page }) => {
        const desktop = page.getByTestId('desktop-container');
        
        // Simple tap at (10, 10) which should be empty background
        await desktop.click({ position: { x: 10, y: 10 } });
        
        const contextMenu = page.getByTestId('desktop-context-menu');
        await expect(contextMenu).toBeVisible();
    });

    test('tapping an icon does not show desktop context menu', async ({ page }) => {
        const icon = page.getByTestId('desktop-icon-welcome.txt');
        await icon.click();
        
        const desktopMenu = page.getByTestId('desktop-context-menu');
        await expect(desktopMenu).not.toBeVisible();
    });

    test('tapping away closes the mobile context menu', async ({ page }) => {
        const desktop = page.getByTestId('desktop-container');
        
        // Tap to open at (10, 10)
        await desktop.click({ position: { x: 10, y: 10 } });
        const contextMenu = page.getByTestId('desktop-context-menu');
        await expect(contextMenu).toBeVisible();
        
        // Tap away at (20, 300) - should be empty background
        await desktop.click({ position: { x: 20, y: 300 } });
        await expect(contextMenu).not.toBeVisible();
    });
});
