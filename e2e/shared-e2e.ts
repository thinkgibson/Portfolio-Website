import { Page } from '@playwright/test';

/**
 * Standard setup for E2E tests.
 * Navigates to the home page and skips the boot sequence.
 */
export async function setupOrReset({ page }: { page: Page }) {
    await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
    // Ensure the desktop is loaded
    await page.waitForSelector('[data-testid^="desktop-icon-"]');
}

/**
 * Gets all currently opened windows by their test IDs.
 */
export async function getOpenedWindows(page: Page) {
    const windows = page.locator('[data-testid^="window-"]');
    const count = await windows.count();
    const windowIds = [];
    for (let i = 0; i < count; i++) {
        const testId = await windows.nth(i).getAttribute('data-testid');
        if (testId && testId.startsWith('window-') && !testId.includes('minimize') && !testId.includes('maximize') && !testId.includes('close')) {
            windowIds.push(testId);
        }
    }
    return windowIds;
}

/**
 * Utility to wait for a specific time or animation frames.
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
