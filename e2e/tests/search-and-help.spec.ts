import { test, expect } from '@playwright/test';

test.describe('Search and Help Features', () => {
    test.beforeEach(async ({ page }) => {
        // Skip boot sequence for faster tests
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
    });

    test('should highlight search results in window body', async ({ page }) => {
        // Open "Welcome.txt"
        await page.click('text=Welcome.txt');
        const window = page.locator('[data-testid="window-welcome.txt"]');
        await expect(window).toBeVisible();

        // Open search box from menu (current implementation has it under Search -> Open Search)
        await window.locator('text=Search').click();
        await page.click('text=Open Search');

        const searchInput = window.locator('input[type="text"]');
        await expect(searchInput).toBeVisible();

        // Search for a term that exists (e.g., "Learn")
        await searchInput.fill('Learn');

        // Check for highlighted text (using <mark> tag)
        const highlight = window.locator('mark');
        await expect(highlight).toBeVisible();
        await expect(highlight).toContainText(/Learn/i);

        // Clear search and check if highlight is gone
        await searchInput.fill('');
        await expect(highlight).not.toBeVisible();
    });

    test('help menu should only contain "About" and open an about window', async ({ page }) => {
        // Open "Welcome.txt"
        await page.click('text=Welcome.txt');
        const window = page.locator('[data-testid="window-welcome.txt"]');
        await expect(window).toBeVisible();

        // Click Help menu
        await window.locator('text=Help').click();

        // Verify "Contents" is NOT visible
        await expect(page.locator('text=Contents')).not.toBeVisible();

        // Verify "About..." IS visible
        const aboutOption = page.locator('text=About...');
        await expect(aboutOption).toBeVisible();

        // Click "About..."
        await aboutOption.click();

        // Verify a NEW window titled "About Welcome.txt" (or similar) opens
        const aboutWindow = page.locator('[data-testid^="window-about-welcome.txt"]');
        await expect(aboutWindow).toBeVisible();
        await expect(aboutWindow).toContainText(/Purpose|About Me/i);
    });
});

