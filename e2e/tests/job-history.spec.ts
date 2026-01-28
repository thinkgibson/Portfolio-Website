import { test, expect } from '@playwright/test';
import { setupOrReset } from '../shared-e2e';

test.describe('Job History App', () => {
    test.beforeEach(async ({ page }) => {
        await setupOrReset({ page });
    });

    test('should open Job History from desktop', async ({ page }) => {
        // Look for the desktop icon
        const desktopIcon = page.getByTestId('desktop-icon-job-history');
        await expect(desktopIcon).toBeVisible();

        // Double click to open
        await desktopIcon.dblclick();

        // Check if window is open
        const window = page.getByTestId('window-job-history');
        await expect(window).toBeVisible();

        // Check for content
        await expect(window.getByRole('heading', { name: 'Job History' })).toBeVisible();
        await expect(window.getByText('Senior Frontend Developer')).toBeVisible();
        await expect(window.getByText('Tech Solutions Inc.')).toBeVisible();
    });

    test('should open Job History from terminal', async ({ page }) => {
        // Open Accessories folder first
        const accessoriesIcon = page.getByTestId('desktop-icon-accessories');
        await expect(accessoriesIcon).toBeVisible();
        await accessoriesIcon.dblclick();

        const accessoriesWindow = page.getByTestId('window-accessories');
        await expect(accessoriesWindow).toBeVisible();

        // Open terminal from Accessories
        const terminalIcon = accessoriesWindow.getByTestId('desktop-icon-command-prompt');
        await expect(terminalIcon).toBeVisible();
        await terminalIcon.dblclick();

        const terminalWindow = page.getByTestId('window-command-prompt');
        await expect(terminalWindow).toBeVisible();

        // Type open command using the standardized terminal-input test id
        const input = terminalWindow.getByTestId('terminal-input');
        await expect(input).toBeVisible();
        await input.fill('open job-history');
        await input.press('Enter');

        // Check if Job History window opens
        const jobWindow = page.getByTestId('window-job-history');
        await expect(jobWindow).toBeVisible();
    });
});
