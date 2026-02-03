import { test, expect } from '@playwright/test';

test.describe('Music Player App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app with boot and welcome skipped
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        // Wait for the desktop to be ready
        await page.waitForSelector('[data-testid="desktop-container"]');
    });

    test('should open Media Player from desktop', async ({ page }) => {
        // Open Multimedia folder
        const multimediaIcon = page.getByTestId('desktop-icon-multimedia');
        await multimediaIcon.dblclick();

        const folderWindow = page.getByTestId('window-multimedia');
        await expect(folderWindow).toBeVisible();

        // Open Media Player from inside the folder
        const musicIcon = folderWindow.getByTestId('desktop-icon-media-player');
        await musicIcon.dblclick();

        const window = page.getByTestId('window-media-player');
        await expect(window).toBeVisible();
        await expect(window).toContainText('Media Player');
    });

    test('should toggle play/pause state', async ({ page }) => {
        // Open the app via folder
        await page.getByTestId('desktop-icon-multimedia').dblclick();
        await expect(page.getByTestId('window-multimedia')).toBeVisible();

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
        // Open the app via folder
        await page.getByTestId('desktop-icon-multimedia').dblclick();
        await expect(page.getByTestId('window-multimedia')).toBeVisible();

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
