import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Window Persistence', () => {
    test.slow(); // multiply timeout by 3

    test('window positions should reset on page reload', async ({ page }) => {
        // Clear log file
        fs.writeFileSync('test_debug.txt', '');
        const log = (msg: string) => fs.appendFileSync('test_debug.txt', msg + '\n');
        log('Starting test...');

        // Skip on mobile since dragging is disabled
        if (test.info().project.name.toLowerCase().includes('mobile')) {
            test.skip();
        }

        // 1. Navigate to desktop (skip boot)
        await page.goto('/?skipBoot=true');
        log('Navigated to /?skipBoot=true');

        // Wait for desktop
        await expect(page.getByTestId('desktop-container')).toBeVisible();
        log('Desktop visible');

        // 2. Open "About Me" window
        // Note: The title is "About_Me.doc" in HomeClient.tsx
        // data-testid will be `desktop-icon-about_me.doc`
        const aboutIcon = page.getByTestId('desktop-icon-about_me.doc');
        await expect(aboutIcon).toBeVisible({ timeout: 10000 });
        const iconBox = await aboutIcon.boundingBox();
        log(`About Icon Box: ${JSON.stringify(iconBox)}`);

        // Force click just in case
        await aboutIcon.click({ force: true });
        log('Clicked About Me');

        const windowTitle = page.getByTestId('window-titlebar').filter({ hasText: 'About_Me.doc' });
        await expect(windowTitle).toBeVisible();
        log('Window visible');

        // 3. Get initial position
        const windowElement = page.getByTestId('window-about_me.doc');
        const initialBox = await windowElement.boundingBox();
        log(`Initial Box: ${JSON.stringify(initialBox)}`);
        expect(initialBox).toBeTruthy();
        if (!initialBox) return;

        // 4. Drag window to a new position using mouse API
        const titleBar = windowElement.getByTestId('window-titlebar');
        const titleBox = await titleBar.boundingBox();
        if (!titleBox) throw new Error("Title bar not found");

        // Center of title bar
        const startX = titleBox.x + titleBox.width / 2;
        const startY = titleBox.y + titleBox.height / 2;

        log(`Drag start: ${startX}, ${startY}`);
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 300, startY + 300, { steps: 20 });
        await page.mouse.up();
        log('Drag complete');

        // Verify it moved
        const movedBox = await windowElement.boundingBox();
        log(`Moved Box: ${JSON.stringify(movedBox)}`);
        expect(movedBox).toBeTruthy();
        if (!movedBox) return;

        expect(movedBox.x).toBeGreaterThan(initialBox.x + 100);
        expect(movedBox.y).toBeGreaterThan(initialBox.y + 100);

        // 5. Reload the page
        log('Reloading page...');
        await page.reload();
        log('Page reloaded');

        // 6. Open "About Me" window again
        await aboutIcon.click();
        await expect(windowTitle).toBeVisible();
        log('Window reopened');

        // 7. Verify it is back at (or near) the initial position
        const resetBox = await windowElement.boundingBox();
        log(`Reset Box: ${JSON.stringify(resetBox)}`);
        expect(resetBox).toBeTruthy();
        if (!resetBox) return;

        // Check against initial default logic (approx 100, 50 + offset)
        // Definitely not where we dragged it (400+, 400+)
        expect(resetBox.x).toBeLessThan(300);
        expect(resetBox.y).toBeLessThan(300);
        expect(resetBox.x).not.toBeCloseTo(movedBox.x, 0);
    });
});
