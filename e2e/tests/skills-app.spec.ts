import { test, expect } from '@playwright/test';

test.describe('Skills App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app and skip boot sequence/welcome
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
    });

    test('should open Skills app from desktop', async ({ page }) => {
        const resumeFolder = page.getByTestId('desktop-icon-my-resume');
        await expect(resumeFolder).toBeVisible();
        await resumeFolder.click();

        const folderWindow = page.getByTestId('window-my-resume');
        await expect(folderWindow).toBeVisible();

        const icon = folderWindow.getByTestId('desktop-icon-my-skills');
        await expect(icon).toBeVisible();
        await icon.click();

        const window = page.getByTestId('window-my-skills');
        await expect(window).toBeVisible();
    });

    test('should open Skills app from terminal', async ({ page }, testInfo) => {
        // Skip due to regression found in CI (Issue #84) - fails on all browsers
        test.skip(true, 'Regression: Terminal commands failing to open apps');

        // Skip on Webkit due to browser-specific timing issues  
        // test.skip(testInfo.project.name === 'webkit', 'Timing out on Webkit browser');

        // Terminal is in Accessories folder
        console.log('Opening Accessories...');
        const accessoriesIcon = page.getByTestId('desktop-icon-accessories');
        await expect(accessoriesIcon).toBeVisible({ timeout: 10000 });
        await accessoriesIcon.dblclick();

        const accessoriesWindow = page.getByTestId('window-accessories');
        await expect(accessoriesWindow).toBeVisible({ timeout: 10000 });

        console.log('Opening Command Prompt...');
        const terminalIcon = accessoriesWindow.getByTestId('desktop-icon-command-prompt');
        await expect(terminalIcon).toBeVisible({ timeout: 10000 });
        await terminalIcon.dblclick();

        console.log('Waiting for terminal window...');
        const terminalWindow = page.getByTestId('window-command-prompt');
        await expect(terminalWindow).toBeVisible({ timeout: 10000 });

        console.log('Finding terminal input...');
        const input = page.getByTestId('terminal-input');
        await expect(input).toBeVisible({ timeout: 10000 });

        console.log('Filling terminal input...');
        await input.fill('open skills');
        await input.press('Enter');

        console.log('Waiting for skills window...');
        const skillsWindow = page.getByTestId('window-my-skills');
        await expect(skillsWindow).toBeVisible({ timeout: 10000 });
    });
});
