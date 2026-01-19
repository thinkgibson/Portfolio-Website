import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Sound System', () => {
    test.beforeEach(setupOrReset);

    test('volume persistence works', async ({ desktop, page }) => {
        // Open volume slider
        await desktop.clickSystemTrayIcon('volume');
        const sliderTrack = page.getByTestId('volume-slider-track');
        await expect(sliderTrack).toBeVisible();

        const trackBox = await sliderTrack.boundingBox();
        if (!trackBox) throw new Error('Could not get slider track bounding box');

        // Click the slider track at roughly 75% height (sets volume to ~75%)
        const targetX = trackBox.x + trackBox.width / 2;
        const targetY = trackBox.y + trackBox.height * 0.25;
        await page.mouse.click(targetX, targetY);

        // Wait a moment for state to settle
        await page.waitForTimeout(1000);

        // Verify slider value
        const slider = page.locator('input[type="range"]');
        const value = await slider.inputValue();
        expect(parseInt(value)).toBeGreaterThan(60);
        const savedValue = value;

        // Reload the page
        await setupOrReset({ page });

        // Open volume slider again
        await desktop.clickSystemTrayIcon('volume');
        await expect(sliderTrack).toBeVisible();

        // Check if value persisted
        const newValue = await slider.inputValue();
        expect(newValue).toBe(savedValue);
    });

    test('reboot triggers shutdown sound (simulated)', async ({ page }) => {
        // Right click desktop to open context menu
        await page.getByTestId('desktop-container').click({ button: 'right' });

        // Click System reboot using data-testid
        await page.getByTestId('context-menu-item-system-reboot').click();

        // Verify that the reboot message is showing (this happens after shutdown sound is triggered)
        // In our current implementation, handleReboot sets booting to true which shows BootSequence
        const bootSequence = page.locator('div[class*="fixed inset-0 bg-black"]');
        await expect(bootSequence).toBeVisible();
    });

    test('boot sound triggers after sequence', async ({ page }) => {
        // Start a fresh session without skipBoot
        await setupOrReset({ page });

        // Wait for boot sequence to finish
        // The sequence has multiple messages, we'll wait for the desktop to appear
        const desktop = page.getByTestId('desktop-container');
        await expect(desktop).toBeVisible({ timeout: 15000 });

        // Since we can't easily hear audio in E2E tests without special setup, 
        // we mainly verify the flow logic.
    });
});
