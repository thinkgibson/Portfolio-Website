import { test, expect } from '@playwright/test';
import { setupOrReset } from '../shared-e2e';

test.describe('Job History App', () => {
    test.beforeEach(async ({ page }) => {
        await setupOrReset({ page });
    });

    test('should open Job History from desktop', async ({ page }) => {
        // Look for the desktop icon
        const desktopIcon = page.locator('[data-testid="desktop-icon-job-history"]');
        await expect(desktopIcon).toBeVisible();

        // Double click to open
        await desktopIcon.dblclick();

        // Check if window is open
        const window = page.locator('[data-testid="window-job-history"]');
        await expect(window).toBeVisible();

        // Check for content
        await expect(window.getByRole('heading', { name: 'Job History' })).toBeVisible();
        await expect(window.getByText('Senior Frontend Developer')).toBeVisible();
        await expect(window.getByText('Tech Solutions Inc.')).toBeVisible();
    });

    test('should open Job History from terminal', async ({ page }) => {
        // Open terminal first
        const terminalIcon = page.locator('[data-testid="desktop-icon-terminal"]');
        await terminalIcon.dblclick();

        const terminalWindow = page.locator('.win95-window[data-window-title="Command Prompt"]');
        await expect(terminalWindow).toBeVisible();

        // Type open command
        const input = terminalWindow.locator('input');
        await input.fill('open job-history');
        await input.press('Enter');

        // Check if Job History window opens
        const jobWindow = page.locator('[data-testid="window-job-history"]');
        await expect(jobWindow).toBeVisible();
    });
});
