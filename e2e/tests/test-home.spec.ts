import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Home Page', () => {
    test.beforeEach(setupOrReset);

    test('has title', async ({ page }) => {
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Portfolio/i);
    });

    test('desktop is visible', async ({ desktop }) => {
        // Expect the My Resume folder to be visible as a proxy for the desktop being loaded
        await desktop.expectIconVisible('My Resume');
    });
});
