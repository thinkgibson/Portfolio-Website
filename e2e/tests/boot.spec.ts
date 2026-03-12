import { test, expect } from '@playwright/test';

test.describe('Boot Sequence', () => {
  test('should display boot messages and complete', async ({ page }) => {
    await page.goto('/');
    
    // Check if boot sequence container is visible
    // Based on the className in BootSequence.tsx
    const bootContainer = page.locator('.fixed.inset-0.bg-black.text-white');
    await expect(bootContainer).toBeVisible();
    
    // Check for some common boot messages from our new boot.md
    await expect(page.getByText('BIOS Version 2.0.4.1')).toBeVisible();
    await expect(page.getByText('CPU: Antigravity i486DX4 1000MHz')).toBeVisible();
    
    // Wait for boot to finish or click to skip
    await page.mouse.click(100, 100);
    
    // Container should disappear
    await expect(bootContainer).not.toBeVisible();
    
    // Desktop should be visible
    await expect(page.getByTestId('desktop-container')).toBeVisible();
  });

  test('should allow skipping with a click', async ({ page }) => {
    await page.goto('/');
    const bootContainer = page.locator('.fixed.inset-0.bg-black.text-white');
    await expect(bootContainer).toBeVisible();
    
    await page.click('body');
    await expect(bootContainer).not.toBeVisible();
  });

  test('should replace dynamic variables', async ({ page }) => {
    // We can't easily check the EXACT values for IP/Browser without mocking,
    // but we can check if the placeholders are GONE and replaced with something else.
    await page.goto('/');
    
    const bootContainer = page.locator('.fixed.inset-0.bg-black.text-white');
    await expect(bootContainer).toBeVisible();

    // Check that placeholders like {{browser}} are NOT in the text
    const text = await page.innerText('body');
    expect(text).not.toContain('{{browser}}');
    expect(text).not.toContain('{{os}}');
    expect(text).not.toContain('{{viewport}}');
    expect(text).not.toContain('{{ip}}');
    expect(text).not.toContain('{{date}}');
    
    // Check for "Detected Browser:" prefix which is in boot.md
    await expect(page.getByText('Detected Browser:')).toBeVisible();
  });
});
