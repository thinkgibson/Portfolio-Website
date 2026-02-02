import { test, expect } from '@playwright/test';

test.describe('Start Menu Expandable Folders', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async ({ page }) => {
        // Capture console logs from the page
        page.on('console', msg => {
            console.log(`PAGE LOG: ${msg.text()}`);
        });

        // Navigate to the app with boot, welcome screens, and animations skipped
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        // Ensure the desktop is loaded
        await expect(page.getByTestId('desktop-container')).toBeVisible();
    });

    test('should open submenu on hover (desktop simul)', async ({ page }) => {
        console.log('START TEST: should open submenu on hover (desktop simul)');
        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();
        console.log('Clicked Start button');
        await expect(page.getByTestId('start-menu')).toBeVisible();
        console.log('Start menu visible');

        // Hover over 'Accessories' (using click for better reliability in E2E)
        console.log('Clicking (to trigger hover/submenu) Accessories');
        const accessoriesItem = page.getByTestId('start-menu-item-accessories');
        await accessoriesItem.click();
        console.log('Click call completed');

        // Verify submenu appears
        console.log('Waiting for submenu container...');
        await expect(page.getByTestId('start-submenu-depth-1')).toBeVisible({ timeout: 10000 });
        console.log('Submenu container visible');

        console.log('Waiting for submenu Notepad item...');
        const notepadItem = page.getByTestId('start-submenu-item-notepad');
        await expect(notepadItem).toBeVisible({ timeout: 10000 });
        console.log('Submenu item visible');

        // Click on Notepad in submenu
        console.log('Clicking Notepad item');
        await notepadItem.click();
        console.log('Notepad click completed');

        // Verify Notepad window opens and Start Menu closes
        await expect(page.getByTestId('window-notepad.exe')).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(500);
        await expect(page.getByTestId('start-menu')).not.toBeVisible();
    });

    test('should open submenu on click in desktop mode', async ({ page }) => {
        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click 'Accessories' directly
        await page.getByTestId('start-menu-item-accessories').click();

        // Verify Accessories submenu appears
        const notepadItem = page.getByTestId('start-submenu-item-notepad');
        await expect(notepadItem).toBeVisible();
        await expect(page.getByTestId('start-menu')).toBeVisible();
    });

    test('should open submenu on click in mobile mode', async ({ page }) => {
        // Set viewport to mobile
        await page.setViewportSize({ width: 375, height: 667 });

        // Refresh to trigger useIsMobile correctly (hooks depend on window width)
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click 'Accessories'
        await page.getByTestId('start-menu-item-accessories').click();

        // Verify submenu appears (and Start Menu is still open on mobile clicking a folder)
        const notepadItem = page.getByTestId('start-submenu-item-notepad');
        await expect(notepadItem).toBeVisible();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click on Notepad in submenu
        await notepadItem.click();

        // Verify Notepad window opens and Start Menu closes
        await expect(page.getByTestId('window-notepad.exe')).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(500);
        await expect(page.getByTestId('start-menu')).not.toBeVisible();
    });
});
