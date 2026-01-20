import { test, expect } from '@playwright/test';

test.describe('Music Player App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app with boot and welcome skipped
        await page.goto('/?skipBoot=true&skipWelcome=true');
        // Wait for the desktop to be ready
        await page.waitForSelector('[data-testid="desktop-container"]');
    });

    test('should open Media Player from desktop', async ({ page }) => {
        const musicIcon = page.getByTestId('desktop-icon-media-player');
        await musicIcon.dblclick();

        const window = page.getByTestId('window-media-player');
        await expect(window).toBeVisible();
        await expect(window).toContainText('Media Player');
    });

    test('should open Media Player from start menu', async ({ page }) => {
        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();

        // Find and click Media Player in Programs/Items
        const menuItem = page.getByTestId('start-menu-item-musicplayer');
        await expect(menuItem).toBeVisible();
        await menuItem.click();

        const window = page.getByTestId('window-media-player');
        await expect(window).toBeVisible();
    });

    test('should toggle play/pause state', async ({ page }) => {
        // Open the app
        await page.getByTestId('desktop-icon-media-player').dblclick();
        const window = page.getByTestId('window-media-player');
        await expect(window).toBeVisible();

        // Check initial play button
        const playButton = window.getByTitle('Play');
        await expect(playButton).toBeVisible();

        // Click play
        await playButton.click();

        // Should show pause button
        const pauseButton = window.getByTitle('Pause');
        await expect(pauseButton).toBeVisible();

        // Click pause
        await pauseButton.click();

        // Should show play button again
        await expect(playButton).toBeVisible();
    });

    test('should stop playback', async ({ page }) => {
        await page.getByTestId('desktop-icon-media-player').dblclick();
        const window = page.getByTestId('window-media-player');
        await expect(window).toBeVisible();

        const playButton = window.getByTitle('Play');
        const stopButton = window.getByTitle('Stop');

        await playButton.click();
        await expect(window.getByTitle('Pause')).toBeVisible();

        await stopButton.click();
        await expect(playButton).toBeVisible();
        // The time should reset to 0:00 but the duration might be non-zero
        await expect(window.getByText(/0:00 \/ \d+:\d+/)).toBeVisible();
    });
});
