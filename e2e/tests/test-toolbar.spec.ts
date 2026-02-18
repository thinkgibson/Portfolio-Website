import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Window Toolbar', () => {
    test.beforeEach(setupOrReset);

    test('can use File menu to maximize and close', async ({ desktop, window, page, isMobile }) => {
        test.skip(!!isMobile, 'Maximizing behavior is different/unreliable on mobile emulation');

        const title = 'Welcome.txt';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);

        // Open File menu
        await winLocator.getByText('File').click();
        await expect(winLocator.getByText('Maximize')).toBeVisible();
        await expect(winLocator.getByText('Close')).toBeVisible();

        // Maximize via menu
        await winLocator.getByText('Maximize').click();
        await page.waitForTimeout(500);

        const maximizedBox = await winLocator.boundingBox();
        expect(maximizedBox?.x).toBeCloseTo(0, 0);
        expect(maximizedBox?.y).toBeCloseTo(0, 0);

        // Close via menu
        await winLocator.getByText('File').click();
        await winLocator.getByText('Close').click();
        await window.expectClosed(title);
    });

    test('can toggle search box', async ({ desktop, window, page }) => {
        const title = 'Welcome.txt';
        await desktop.openIcon(title);

        const winLocator = window.getWindow(title);

        // Open Search menu
        await winLocator.getByText('Search').click();
        await winLocator.getByText('Open Search').click();

        await expect(winLocator.getByText('Find:')).toBeVisible();
        await expect(winLocator.getByRole('textbox')).toBeVisible();

        // Close search box
        await winLocator.getByText('X', { exact: true }).click();
        await expect(winLocator.getByText('Find:')).not.toBeVisible();
    });

    test('has equal spacing between titlebar buttons', async ({ desktop, window, page }, testInfo) => {
        // Skip on mobile/tablet since maximize button is intentionally hidden
        test.skip(testInfo.project.name.includes('Mobile'), 'Maximize button is hidden on mobile/tablet');

        const title = 'Welcome.txt';
        await desktop.openIcon(title);
        const winLocator = window.getWindow(title);

        // Wait for opening animations to finish (0.95 -> 1.0 scale)
        await page.waitForTimeout(1000);

        const minimize = winLocator.getByTestId('window-minimize');
        const maximize = winLocator.getByTestId('window-maximize');
        const close = winLocator.getByTestId('window-close');

        const minBox = await minimize.boundingBox();
        const maxBox = await maximize.boundingBox();
        const closeBox = await close.boundingBox();

        if (minBox && maxBox && closeBox) {
            const gap1 = maxBox.x - (minBox.x + minBox.width);
            const gap2 = closeBox.x - (maxBox.x + maxBox.width);

            // Both gaps should be exactly 4px (ml-1)
            // Using toBeCloseTo to handle potential sub-pixel rendering (Wait-for-animation helps here)
            expect(gap1).toBeCloseTo(4, 1);
            expect(gap2).toBeCloseTo(4, 1);
            expect(gap1).toBeCloseTo(gap2, 1);
        } else {
            throw new Error('Could not find bounding boxes for titlebar buttons');
        }
    });

    test('menu items have sufficient padding', async ({ desktop, window: windowPO, page }) => {
        const title = 'Welcome.txt';
        await desktop.openIcon(title);
        const winLocator = windowPO.getWindow(title);

        const menuItems = ['File', 'Search', 'Help'];

        for (const item of menuItems) {
            const locator = winLocator.getByText(item, { exact: true });
            await expect(locator).toBeVisible();

            // Get bounding box of the menu item container (the span with padding)
            const box = await locator.boundingBox();

            // Get text width by evaluating in browser
            const textWidth = await locator.evaluate((el) => {
                const context = document.createElement('canvas').getContext('2d');
                if (!context) return 0;
                context.font = getComputedStyle(el).font;
                return context.measureText(el.textContent || '').width;
            });

            if (box) {
                // Padding is now px-[15px] py-[5px].
                // Horizontal padding = 15px left + 15px right = 30px.
                // So width should be textWidth + 30 (approx)

                // Verify it's significantly wider than text + 20 (safe margin)
                expect(box.width).toBeGreaterThan(textWidth + 20);

                // Verify it has the bevel class (by checking class list potentially, or visual check)
                await expect(locator).toHaveClass(/win95-beveled/);
            }
        }
    });

});
