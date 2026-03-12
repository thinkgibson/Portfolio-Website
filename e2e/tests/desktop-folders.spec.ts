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

    test('should space folder icons without overlap', async ({ page }) => {
        // Open Accessories folder
        await page.getByTestId('desktop-icon-accessories').dblclick();
        const window = page.getByTestId('window-accessories');
        await expect(window).toBeVisible();

        // Get all icons in the folder
        const icons = window.getByTestId(/^desktop-icon-/);
        // Accessories has 4 icons: Notepad, Calculator, Paint, Terminal
        await expect(icons).toHaveCount(4);
        const count = await icons.count();

        const boxes: { x: number, y: number, width: number, height: number }[] = [];
        for (let i = 0; i < count; i++) {
            const box = await icons.nth(i).boundingBox();
            if (box) boxes.push(box);
        }

        // Check every pair for overlap
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                const b1 = boxes[i];
                const b2 = boxes[j];

                const overlap = !(
                    b1.x + b1.width <= b2.x ||
                    b2.x + b2.width <= b1.x ||
                    b1.y + b1.height <= b2.y ||
                    b2.y + b2.height <= b1.y
                );

                expect(overlap, `Icons ${i} and ${j} overlap`).toBe(false);
            }
        }
    });

    test('should not have scrollbars in Accessories folder by default', async ({ page }) => {
        // Open Accessories folder
        await page.getByTestId('desktop-icon-accessories').dblclick();
        const window = page.getByTestId('window-accessories');
        await expect(window).toBeVisible();

        // The content area is within a div that has overflow-auto
        // We want to check if the scrollHeight is less than or equal to clientHeight
        const contentArea = window.locator('.overflow-auto');
        
        // Wait for content to be fully rendered
        await expect(window.getByTestId('desktop-icon-command-prompt')).toBeVisible();

        const isScrollable = await contentArea.evaluate((el) => {
            return el.scrollHeight > el.clientHeight;
        });

        expect(isScrollable, 'Accessories folder should not be scrollable').toBe(false);
    });
});
