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

    test('has equal spacing between titlebar buttons', async ({ desktop, window, page }) => {
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

});
