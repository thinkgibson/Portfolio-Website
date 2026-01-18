import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Window Toolbar', () => {
    test.beforeEach(setupOrReset);

    test('can use File menu to maximize and close', async ({ desktop, window, page }) => {
        const title = 'About_Me.doc';
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
        expect(maximizedBox?.x).toBeCloseTo(0, -1);
        expect(maximizedBox?.y).toBeCloseTo(0, -1);

        // Close via menu
        await winLocator.getByText('File').click();
        await winLocator.getByText('Close').click();
        await window.expectClosed(title);
    });

    test('can toggle search box', async ({ desktop, window, page }) => {
        const title = 'About_Me.doc';
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

    test('can open About window', async ({ desktop, window, page }) => {
        const title = 'About_Me.doc';
        await desktop.openIcon(title);

        const winLocator = window.getWindow(title);

        // Open Help menu
        await winLocator.getByText('Help').click();
        await winLocator.getByText('About...').click();

        // Check for About window
        const aboutTitle = `About ${title}`;
        await window.expectVisible(aboutTitle);
        await expect(page.locator(`[data-testid="window-about-about_me.doc"]`)).toContainText('Purpose');

        // Close About window
        await page.locator(`[data-testid="window-about-about_me.doc"]`).locator('[data-testid="window-close"]').click();
        await window.expectClosed(aboutTitle);
    });
});
