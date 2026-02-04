import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Taskbar Features', () => {
    test.beforeEach(setupOrReset);

    test('volume slider appears and persists value', async ({ desktop, page, isMobile }) => {
        // Volume slider interaction is difficult to test reliably on mobile simulation
        if (isMobile) {
            test.skip();
        }

        await desktop.clickSystemTrayIcon('volume');
        const sliderTrack = page.getByTestId('volume-slider-track');
        await expect(sliderTrack).toBeVisible();

        const trackBox = await sliderTrack.boundingBox();
        if (!trackBox) throw new Error('Could not get slider track bounding box');

        // Click the slider track at roughly 75% height
        // The slider is vertical, 0% is bottom, 100% is top.
        // To set to ~75%, we click at 25% from the top of the track.
        const targetX = trackBox.x + trackBox.width / 2;
        const targetY = trackBox.y + trackBox.height * 0.25;

        await page.mouse.click(targetX, targetY);

        // Wait a moment for state to settle in localStorage
        await page.waitForTimeout(1000);

        // Verify slider value (input is hidden but should have updated)
        const slider = page.locator('input[type="range"]');
        let value = await slider.inputValue();
        // We allow some range because dragging to exact percentage is hard
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



    test('system tray shows weather and network tooltips', async ({ page }) => {
        // Weather
        await page.getByTestId('sys-tray-weather').click();
        // The tooltip is an absolute div with yellow bg
        const weatherTooltip = page.locator('div[class*="bg-[#FFFFE1]"]').filter({ hasText: /°F|Fetching weather/ }).first();
        await expect(weatherTooltip).toBeVisible();
        await page.waitForTimeout(300); // Give it a moment to show

        // Network
        await page.getByTestId('sys-tray-network').click();
        const networkTooltip = page.locator('div[class*="bg-[#FFFFE1]"]').filter({ hasText: /Latency|Measuring ping/ }).last();
        await expect(networkTooltip).toBeVisible();
    });
});
