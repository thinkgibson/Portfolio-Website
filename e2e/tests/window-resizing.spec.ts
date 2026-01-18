import { expect } from '@playwright/test';
import test from '../fixtures/fixtures';
import { setupOrReset } from '../shared-e2e';

test.describe('Window Resizing', () => {
    test.beforeEach(setupOrReset);

    test('can resize a window using the gripper', async ({ desktop, window, page, isMobile }) => {
        if (isMobile) {
            test.skip(true, 'Window resizing is disabled on mobile');
            return;
        }

        const title = 'About_Me.doc';
        await desktop.openIcon(title);
        await window.expectVisible(title);

        const winLocator = window.getWindow(title);
        const gripper = winLocator.locator('div.cursor-se-resize');

        await expect(gripper).toBeVisible();

        // Wait for animations to settle
        await page.waitForTimeout(1000);

        const initialBox = await winLocator.boundingBox();
        if (!initialBox) throw new Error('Could not get initial bounding box');
        console.log(`Initial box: ${JSON.stringify(initialBox)}`);

        const gripperBox = await gripper.boundingBox();
        if (!gripperBox) throw new Error('Could not get gripper bounding box');
        console.log(`Gripper box: ${JSON.stringify(gripperBox)}`);

        const startX = gripperBox.x + gripperBox.width / 2;
        const startY = gripperBox.y + gripperBox.height / 2;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        // Resize by +150, +100 - use many steps to ensure pointermove is registered
        await page.mouse.move(startX + 150, startY + 100, { steps: 100 });
        await page.mouse.up();

        // Wait longer for framer-motion layout/spring animation to settle
        await page.waitForTimeout(2000);

        const resizedBox = await winLocator.boundingBox();
        if (!resizedBox) throw new Error('Could not get resized bounding box');
        console.log(`Resized box: ${JSON.stringify(resizedBox)}`);

        expect(resizedBox.width).toBeGreaterThan(initialBox.width + 100);
        expect(resizedBox.height).toBeGreaterThan(initialBox.height + 50);
    });

    test('resized dimensions persist after reopening', async ({ desktop, window, page, isMobile }) => {
        if (isMobile) {
            test.skip(true, 'Window resizing is disabled on mobile');
            return;
        }

        const title = 'About_Me.doc';
        await desktop.openIcon(title);

        const winLocator = window.getWindow(title);
        const gripper = winLocator.locator('div.cursor-se-resize');

        const gripperBox = await gripper.boundingBox();
        await page.mouse.move(gripperBox!.x + 5, gripperBox!.y + 5);
        await page.mouse.down();
        await page.mouse.move(gripperBox!.x + 155, gripperBox!.y + 105, { steps: 50 });
        await page.mouse.up();

        await page.waitForTimeout(1000);
        const resizedBox = await winLocator.boundingBox();

        // Close
        await window.close(title);
        await window.expectClosed(title);

        // Reopen
        await desktop.openIcon(title);
        await window.expectVisible(title);
        await page.waitForTimeout(1000);

        const reopenedBox = await winLocator.boundingBox();
        expect(Math.abs(reopenedBox!.width - resizedBox!.width)).toBeLessThan(10);
        expect(Math.abs(reopenedBox!.height - resizedBox!.height)).toBeLessThan(10);
    });

    test('respects minimum width and height', async ({ desktop, window, page, isMobile }) => {
        if (isMobile) {
            test.skip(true, 'Window resizing is disabled on mobile');
            return;
        }

        const title = 'About_Me.doc';
        await desktop.openIcon(title);

        const winLocator = window.getWindow(title);
        const gripper = winLocator.locator('div.cursor-se-resize');

        const gripperBox = await gripper.boundingBox();

        await page.mouse.move(gripperBox!.x + 5, gripperBox!.y + 5);
        await page.mouse.down();
        // Try to resize to very small
        await page.mouse.move(gripperBox!.x - 500, gripperBox!.y - 500, { steps: 10 });
        await page.mouse.up();

        await page.waitForTimeout(500);
        const smallBox = await winLocator.boundingBox();

        // Min width 200, min height 150 as per Win95Window.tsx
        expect(smallBox!.width).toBeGreaterThanOrEqual(200);
        expect(smallBox!.height).toBeGreaterThanOrEqual(150);
    });
});
