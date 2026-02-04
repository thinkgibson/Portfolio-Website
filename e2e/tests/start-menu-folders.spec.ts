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

    test('should open submenu on hover (Desktop only)', async ({ page }, testInfo) => {
        // Skip if running on a mobile project
        if (testInfo.project.name.toLowerCase().includes('mobile')) {
            test.skip(true, 'Skipping hover test on mobile devices');
        }

        console.log('START TEST: should open submenu on hover (Desktop only)');
        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();
        console.log('Clicked Start button');
        await expect(page.getByTestId('start-menu')).toBeVisible();
        console.log('Start menu visible');

        // Hover over 'Accessories'
        // Use real hover() command which is available in Playwright
        console.log('Hovering Accessories');
        const accessoriesItem = page.getByTestId('start-menu-item-accessories');
        await accessoriesItem.hover();
        console.log('Hover call completed');

        // Verify submenu appears
        console.log('Waiting for submenu container...');
        await expect(page.getByTestId('start-submenu-depth-1')).toBeVisible({ timeout: 5000 });
        console.log('Submenu container visible');

        console.log('Waiting for submenu Notepad item...');
        const notepadItem = page.getByTestId('start-submenu-item-notepad');
        await expect(notepadItem).toBeVisible({ timeout: 5000 });
        console.log('Submenu item visible');

        // Click on Notepad in submenu
        console.log('Clicking Notepad item');
        await notepadItem.click();
        console.log('Notepad click completed');

        // Verify Notepad window opens and Start Menu closes
        await expect(page.getByTestId('window-notepad.exe')).toBeVisible({ timeout: 5000 });
        await page.waitForTimeout(500);
        await expect(page.getByTestId('start-menu')).not.toBeVisible();
    });

    test('should open submenu on click in desktop mode', async ({ page }, testInfo) => {
        if (testInfo.project.name.toLowerCase().includes('mobile')) {
            test.skip(true, 'Skipping desktop click test on mobile devices');
        }

        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Click 'Accessories' directly (valid alternative interaction)
        await page.getByTestId('start-menu-item-accessories').click();

        const notepadItem = page.getByTestId('start-submenu-item-notepad');
        await expect(notepadItem).toBeVisible();
        await expect(page.getByTestId('start-menu')).toBeVisible();
    });

    test('should open submenu on click (Mobile only)', async ({ page }, testInfo) => {
        // Skip if NOT running on a mobile project
        if (!testInfo.project.name.toLowerCase().includes('mobile')) {
            test.skip(true, 'Skipping mobile test on desktop devices');
        }

        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await expect(page.getByTestId('desktop-container')).toBeVisible();

        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Stabilize: Wait for menu animation to fully settle
        await page.waitForTimeout(500);

        // Click 'Accessories'
        await page.getByTestId('start-menu-item-accessories').click();

        const notepadItem = page.getByTestId('start-submenu-item-notepad');
        await expect(notepadItem).toBeVisible({ timeout: 5000 });
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Force click because on narrow mobile screens (375px), the submenu is likely off-screen.
        await notepadItem.click({ force: true });

        await expect(page.getByTestId('window-notepad.exe')).toBeVisible({ timeout: 5000 });
        await page.waitForTimeout(500);
        await expect(page.getByTestId('start-menu')).not.toBeVisible();
    });
});
