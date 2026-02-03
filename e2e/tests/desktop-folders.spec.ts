import { test, expect } from '@playwright/test';

test.describe('Desktop Folders', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await expect(page.getByTestId('desktop-container')).toBeVisible();
    });

    test('should display Accessories folder on desktop', async ({ page }) => {
        const folder = page.getByTestId('desktop-icon-accessories');
        await expect(folder).toBeVisible();
        await expect(folder).toContainText('Accessories');
    });

    test('should open Accessories folder and show contents', async ({ page }) => {
        // Open folder
        await page.getByTestId('desktop-icon-accessories').dblclick();

        // Check window opens
        const window = page.getByTestId('window-accessories');
        await expect(window).toBeVisible();
        await expect(window).toContainText('Accessories');

        // Check contents
        await expect(window.getByTestId('desktop-icon-notepad.exe')).toBeVisible();
        await expect(window.getByTestId('desktop-icon-calculator.exe')).toBeVisible();
        await expect(window.getByTestId('desktop-icon-paint.exe')).toBeVisible();
        await expect(window.getByTestId('desktop-icon-command-prompt')).toBeVisible();
    });

    test('should launch app from within folder', async ({ page }) => {
        const folder = page.getByTestId('desktop-icon-accessories');
        await folder.click();

        const window = page.getByTestId('window-accessories');
        await expect(window).toBeVisible();

        const notepad = window.getByTestId('desktop-icon-notepad.exe');
        await notepad.dblclick();

        const notepadWindow = page.getByTestId('window-notepad.exe');
        await expect(notepadWindow).toBeVisible();
    });
});
