import { test, expect } from '@playwright/test';

test.describe('Terminal App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app and wait for boot
        await page.goto('/?skipBoot=true&skipWelcome=true');
        await page.waitForSelector('[data-testid="desktop-container"]');
    });

    test('can open terminal from start menu', async ({ page }) => {
        // Click Start button
        await page.click('[data-testid="taskbar-start-button"]');

        // Find Terminal entry in the list
        const terminalButton = page.locator('button:has-text("Command Prompt")');
        await expect(terminalButton).toBeVisible();
        await terminalButton.click();

        // Check if terminal window is open
        await expect(page.locator('[data-testid="window-command-prompt"]')).toBeVisible();
        await expect(page.locator('text=Portfolio OS [Version 1.0]')).toBeVisible();
    });

    test('can list running apps', async ({ page }) => {
        // Open terminal
        await page.click('[data-testid="taskbar-start-button"]');
        await page.locator('button:has-text("Command Prompt")').click();

        // Type list and press enter
        const input = page.locator('.custom-terminal input');
        await input.fill('list');
        await input.press('Enter');

        // Check output (at least the terminal itself should be running)
        await expect(page.locator('text=Running applications:')).toBeVisible();
        await expect(page.locator('text=- terminal (Command Prompt)')).toBeVisible();
    });

    test('can open and close notepad from terminal', async ({ page }) => {
        // Open terminal
        await page.click('[data-testid="taskbar-start-button"]');
        await page.locator('button:has-text("Command Prompt")').click();

        // Open notepad
        const input = page.locator('.custom-terminal input');
        await input.fill('open notepad');
        await input.press('Enter');

        // Check if notepad is open
        await expect(page.locator('[data-testid="window-notepad.exe"]')).toBeVisible();

        // Close notepad from terminal
        await input.fill('close notepad');
        await input.press('Enter');

        // Check if notepad is closed
        await expect(page.locator('[data-testid="window-notepad.exe"]')).not.toBeVisible();
    });

    test('shows help command output', async ({ page }) => {
        // Open terminal
        await page.click('[data-testid="taskbar-start-button"]');
        await page.locator('button:has-text("Command Prompt")').click();

        const input = page.locator('.custom-terminal input');
        await input.fill('help');
        await input.press('Enter');

        await expect(page.locator('text=Available commands:')).toBeVisible();
        await expect(page.locator('text=open <app>')).toBeVisible();
        await expect(page.locator('text=list')).toBeVisible();
    });
});
