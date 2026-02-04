import { test, expect } from '@playwright/test';

test.skip('verify font-family application', async ({ page, isMobile }) => {
    // Skipped globally: Relies on external font resource (db.onlinewebfonts.com) which causes timeouts in CI/Test environment

    // Navigate directly with query params to skip boot, welcome, and animations
    await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');

    // Wait for desktop
    await expect(page.getByTestId('desktop-container')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-testid="taskbar-start-button"]')).toBeVisible();

    // Check body font
    // Check body font
    const bodyStyles = await page.evaluate(() => {
        const style = getComputedStyle(document.body);
        return {
            fontFamily: style.fontFamily,
            webkitFontSmoothing: (style as any).webkitFontSmoothing,
            fontSize: style.fontSize,
            userAgent: navigator.userAgent
        };
    });

    expect(bodyStyles.fontFamily).toContain('W95FA');
    expect(bodyStyles.fontSize).toBe('12px');

    if (bodyStyles.userAgent.includes('AppleWebKit') && !bodyStyles.userAgent.includes('Firefox')) {
        expect(bodyStyles.webkitFontSmoothing).toBe('none');
    }

    // Open a window to check title font
    await page.locator('[data-testid="taskbar-start-button"]').click();
    await expect(page.locator('[data-testid="start-menu"]')).toBeVisible();
    await page.waitForTimeout(500); // Wait for animation

    // Use robust ID for About item
    await page.locator('[data-testid="start-menu-item-about"]').click({ force: true });

    // Check window title font
    const windowTitle = page.locator('[data-testid="window-titlebar"] span').first();
    await expect(windowTitle).toBeVisible();
    await expect(windowTitle).toHaveClass(/font-bold/);

    // Check taskbar start button font
    const startButton = page.locator('button:has-text("Start")');
    await expect(startButton).toBeVisible();
    const startFont = await startButton.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(startFont).toContain('W95FA');

    // Check tech stack font (monospace)
    const techStack = page.locator('ul.font-win95-mono').first();
    // Use about window if visible
    if (await techStack.count() > 0) {
        const monoFont = await techStack.evaluate((el) => getComputedStyle(el).fontFamily);
        expect(monoFont).toContain('Courier New');
    }
});
