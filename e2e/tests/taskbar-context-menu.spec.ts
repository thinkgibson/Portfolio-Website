import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Taskbar Context Menu', () => {
    test.beforeEach(setupOrReset);

    test('right-click taskbar item shows context menu with expected options', async ({ page, desktop, window }) => {
        // Open Notepad
        await desktop.openIcon('Accessories');
        await window.expectVisible('Accessories');
        await desktop.openIcon('Notepad.exe');
        const taskbarItem = desktop.getTaskbarItem('Notepad.exe');
        await expect(taskbarItem).toBeVisible();

        // Right-click on taskbar item
        await taskbarItem.click({ button: 'right' });

        const contextMenu = page.getByTestId('taskbar-context-menu');
        await expect(contextMenu).toBeVisible();
        await expect(contextMenu.getByText('Restore', { exact: true })).toBeVisible();
        await expect(contextMenu.getByText('Minimize', { exact: true })).toBeVisible();
        await expect(contextMenu.getByText('Close', { exact: true })).toBeVisible();
    });

    test('context menu "Minimize" minimizes the window', async ({ page, desktop, window }) => {
        await desktop.openIcon('Accessories');
        await window.expectVisible('Accessories');
        await desktop.openIcon('Notepad.exe');
        const taskbarItem = desktop.getTaskbarItem('Notepad.exe');

        await taskbarItem.click({ button: 'right' });
        const menu = page.getByTestId('taskbar-context-menu');
        await expect(menu).toBeVisible();

        await menu.getByText('Minimize', { exact: true }).click();

        await window.expectNotVisible('Notepad.exe');
        // Taskbar item should still be there but not active
        await expect(taskbarItem).not.toHaveClass(/win95-beveled-inset/);
    });

    test('context menu "Restore" restores a minimized window', async ({ page, desktop, window }) => {
        await desktop.openIcon('Accessories');
        await window.expectVisible('Accessories');
        await desktop.openIcon('Notepad.exe');
        const taskbarItem = desktop.getTaskbarItem('Notepad.exe');

        // Minimize first
        await window.minimize('Notepad.exe');
        await window.expectNotVisible('Notepad.exe');

        // Right-click and Restore
        await taskbarItem.click({ button: 'right' });
        const menu = page.getByTestId('taskbar-context-menu');
        await expect(menu).toBeVisible();

        await menu.getByText('Restore', { exact: true }).click();

        await window.expectVisible('Notepad.exe');
        await expect(taskbarItem).toHaveClass(/win95-beveled-inset/);
    });

    test('context menu "Close" closes the window', async ({ page, desktop, window }) => {
        await desktop.openIcon('Accessories');
        await window.expectVisible('Accessories');
        await desktop.openIcon('Notepad.exe');
        const taskbarItem = desktop.getTaskbarItem('Notepad.exe');

        await taskbarItem.click({ button: 'right' });
        const menu = page.getByTestId('taskbar-context-menu');
        await expect(menu).toBeVisible();

        await menu.getByText('Close', { exact: true }).click();

        await window.expectClosed('Notepad.exe');
        await expect(taskbarItem).not.toBeVisible();
    });

    test('clicking outside closes the context menu', async ({ page, desktop, window }) => {
        await desktop.openIcon('Accessories');
        await window.expectVisible('Accessories');
        await desktop.openIcon('Notepad.exe');
        const taskbarItem = desktop.getTaskbarItem('Notepad.exe');

        await taskbarItem.click({ button: 'right' });
        const contextMenu = page.getByTestId('taskbar-context-menu');
        await expect(contextMenu).toBeVisible();

        // Click on the desktop background
        await page.getByTestId('desktop-container').click({ position: { x: 10, y: 10 } });

        await expect(contextMenu).not.toBeVisible();
    });
});
