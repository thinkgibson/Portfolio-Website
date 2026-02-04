import { test, expect } from '@playwright/test';

test.describe('Terminal App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app and wait for boot
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForSelector('[data-testid="desktop-container"]');
    });

    test('can type help command and see output', async ({ page }) => {
        // Open Accessories -> Terminal
        const accessoriesIcon = page.getByTestId('desktop-icon-accessories');
        await expect(accessoriesIcon).toBeVisible();
        await accessoriesIcon.dblclick();

        const accessoriesWindow = page.getByTestId('window-accessories');
        await expect(accessoriesWindow).toBeVisible();

        const terminalIcon = accessoriesWindow.getByTestId('desktop-icon-command-prompt');
        await terminalIcon.dblclick();

        const terminalWindow = page.getByTestId('window-command-prompt');
        await expect(terminalWindow).toBeVisible();

        const input = terminalWindow.getByTestId('terminal-input');
        await expect(input).toBeVisible();

        // Test Help usage via Button for robustness
        await input.pressSequentially('help', { delay: 100 });
        await terminalWindow.getByTestId('terminal-run-button').click();

        // Check for expected output
        await expect(terminalWindow.getByText('Available commands:')).toBeVisible();
        await expect(terminalWindow.getByText('open <app>')).toBeVisible();
    });

    test('can list running apps', async ({ page }) => {
        // Open Accessories -> Terminal
        const accessoriesIcon = page.getByTestId('desktop-icon-accessories');
        await accessoriesIcon.dblclick();
        const accessoriesWindow = page.getByTestId('window-accessories');
        const terminalIcon = accessoriesWindow.getByTestId('desktop-icon-command-prompt');
        await terminalIcon.dblclick();

        const terminalWindow = page.getByTestId('window-command-prompt');
        const input = terminalWindow.getByTestId('terminal-input');

        // Test List
        await input.pressSequentially('list', { delay: 100 });
        await terminalWindow.getByTestId('terminal-run-button').click();

        await expect(terminalWindow.getByText(/Running applications:|No applications currently running/)).toBeVisible();
    });

    test('can legacy open app command', async ({ page }) => {
        const accessoriesIcon = page.getByTestId('desktop-icon-accessories');
        await accessoriesIcon.dblclick();
        const accessoriesWindow = page.getByTestId('window-accessories');
        const terminalIcon = accessoriesWindow.getByTestId('desktop-icon-command-prompt');
        await terminalIcon.dblclick();
        const terminalWindow = page.getByTestId('window-command-prompt');
        const input = terminalWindow.getByTestId('terminal-input');

        await input.pressSequentially('open notepad', { delay: 100 });
        await terminalWindow.getByTestId('terminal-run-button').click();

        const notepadWindow = page.getByTestId('window-notepad.exe');
        await expect(notepadWindow).toBeVisible();
    });
});
