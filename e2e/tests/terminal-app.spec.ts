import { test, expect } from '@playwright/test';

test.describe('Terminal App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app and wait for boot
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        await page.waitForSelector('[data-testid="desktop-container"]');
    });

    // NOTE: Terminal tests via Start Menu removed as they relied on obsolete behavior
    // where Start Menu folders opened windows directly. Now folders open submenus.
    // Terminal functionality can still be tested via desktop icon access.
});
