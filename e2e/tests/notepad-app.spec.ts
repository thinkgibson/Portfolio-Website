import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Notepad Application', () => {
    test.beforeEach(setupOrReset);

    test('can open notepad and type text', async ({ desktop, window, page }) => {
        const title = 'Notepad.exe';

        // Open Notepad
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);
        const editor = winLocator.getByTestId('notepad-editor');

        // Typing in contentEditable
        await editor.click();
        await page.keyboard.type('Hello from Playwright!');

        await expect(editor).toContainText('Hello from Playwright!');
    });

    test('can apply formatting via toolbar', async ({ desktop, window, page }) => {
        const title = 'Notepad.exe';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);
        const editor = winLocator.getByTestId('notepad-editor');
        const boldBtn = winLocator.getByTestId('notepad-bold');
        const italicBtn = winLocator.getByTestId('notepad-italic');
        const underlineBtn = winLocator.getByTestId('notepad-underline');

        // Initial click to focus
        await editor.click();

        // Toggle bold and type
        await boldBtn.click();
        await page.keyboard.type('Bold');

        // Toggle bold off, space, toggle italic on
        await boldBtn.click();
        await page.keyboard.type(' ');
        await italicBtn.click();
        await page.keyboard.type('Italic');

        // Toggle italic off, space, toggle underline on
        await italicBtn.click();
        await page.keyboard.type(' ');
        await underlineBtn.click();
        await page.keyboard.type('Underline');

        // Verify formatting by checking computed styles
        const boldText = editor.getByText('Bold');
        const italicText = editor.getByText('Italic');
        const underlineText = editor.getByText('Underline');

        await expect(boldText).toHaveCSS('font-weight', /700|bold/);
        await expect(italicText).toHaveCSS('font-style', 'italic');
        await expect(underlineText).toHaveCSS('text-decoration', /underline/);
    });

    test('prompts to save when closing with changes', async ({ desktop, window, page }) => {
        const title = 'Notepad.exe';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);
        const editor = winLocator.getByTestId('notepad-editor');
        const closeBtn = winLocator.getByTestId('window-close');

        // Type something to make it dirty
        await editor.click();
        await page.keyboard.type('Changes to save');

        // Try to close
        await closeBtn.click();

        // Verify prompt appears
        await expect(page.getByText(/Do you want to save the changes?/)).toBeVisible();

        // Click Cancel to keep window open
        await page.getByText('Cancel').click();
        await page.waitForTimeout(200);
        await window.expectVisible(title);

        // Try to close again
        await closeBtn.click();
        await expect(page.getByText(/Do you want to save the changes?/)).toBeVisible();

        // Click No to close and wipe
        await page.getByText('No', { exact: true }).click();
        await page.waitForTimeout(200);
        await window.expectClosed(title);
    });

    test('notepad toolbar buttons change visual state', async ({ desktop, window, page }) => {
        const title = 'Notepad.exe';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);
        const editor = winLocator.getByTestId('notepad-editor');
        const boldBtn = winLocator.getByTestId('notepad-bold');
        const italicBtn = winLocator.getByTestId('notepad-italic');
        const underlineBtn = winLocator.getByTestId('notepad-underline');

        // Focus editor first
        await editor.click();

        // Initially, all buttons should have win95-button class (not pressed)
        await expect(boldBtn).toHaveClass(/win95-button/);
        await expect(italicBtn).toHaveClass(/win95-button/);
        await expect(underlineBtn).toHaveClass(/win95-button/);

        // Toggle Bold multiple times
        await boldBtn.click();
        await expect(boldBtn).toHaveClass(/win95-beveled-inset/);

        await boldBtn.click();
        await expect(boldBtn).toHaveClass(/win95-button/);

        await boldBtn.click();
        await expect(boldBtn).toHaveClass(/win95-beveled-inset/);

        await boldBtn.click();
        await expect(boldBtn).toHaveClass(/win95-button/);

        // Toggle Italic multiple times
        await italicBtn.click();
        await expect(italicBtn).toHaveClass(/win95-beveled-inset/);

        await italicBtn.click();
        await expect(italicBtn).toHaveClass(/win95-button/);

        await italicBtn.click();
        await expect(italicBtn).toHaveClass(/win95-beveled-inset/);

        // Toggle Underline multiple times
        await underlineBtn.click();
        await expect(underlineBtn).toHaveClass(/win95-beveled-inset/);

        await underlineBtn.click();
        await expect(underlineBtn).toHaveClass(/win95-button/);

        await underlineBtn.click();
        await expect(underlineBtn).toHaveClass(/win95-beveled-inset/);

        // Verify buttons toggle independently
        await expect(boldBtn).toHaveClass(/win95-button/); // Still off from earlier
        await expect(italicBtn).toHaveClass(/win95-beveled-inset/); // Still on
        await expect(underlineBtn).toHaveClass(/win95-beveled-inset/); // Still on
    });

    test('can save via Save button and Save As dialog', async ({ desktop, window, page }) => {
        page.on('console', msg => console.log(msg.text()));
        const title = 'Notepad.exe';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);

        // Click Save button in toolbar
        const saveBtn = winLocator.getByTestId('notepad-save');
        await saveBtn.click();

        // Verify Save As dialog
        await expect(page.getByTestId('save-dialog')).toBeVisible();
        const filenameInput = page.locator('input[type="text"]').last();
        await filenameInput.fill('my-test-file');

        // Verify Download button exists
        const downloadBtn = page.getByText('Download', { exact: true });
        await expect(downloadBtn).toBeVisible();

        // Cancel the dialog
        await page.getByText('Cancel', { exact: true }).last().click();
        await expect(page.getByText('Save As')).not.toBeVisible();
    });
});
