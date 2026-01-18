import { test, expect } from '@playwright/test';

test('verify font-family application', async ({ page }) => {
    await page.goto('/?skipBoot=true');

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

    // Check window title font
    const windowTitle = page.locator('[data-testid="window-titlebar"] span').first();
    await expect(windowTitle).toBeVisible();
    const titleStyles = await windowTitle.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontSize: style.fontSize
        };
    });
    expect(titleStyles.fontFamily).toContain('W95FA');
    expect(parseInt(titleStyles.fontWeight)).toBeGreaterThanOrEqual(700);
    expect(titleStyles.fontSize).toBe('13px');

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
