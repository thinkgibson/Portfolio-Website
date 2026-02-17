import { test, expect } from '@playwright/test';

test.describe('Start Menu Sorting', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app with boot, welcome screens, and animations skipped
        await page.goto('/?skipBoot=true&skipWelcome=true&skipAnimations=true');
        // Ensure the desktop is loaded
        await expect(page.getByTestId('desktop-container')).toBeVisible();
    });

    test('should sort top-level items (folders first, then alphabetical)', async ({ page }) => {
        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();
        await expect(page.getByTestId('start-menu')).toBeVisible();

        // Get all menu items (excluding Reboot which is separate)
        // We use the data-testid pattern to select only app items
        const items = page.locator('[data-testid^="start-menu-item-"]');

        // Wait for items to be visible
        await expect(items.first()).toBeVisible();

        // Get text content of all items
        const itemTexts = await items.allTextContents();

        // Clean up text (remove arrow symbol if present, though textContent usually includes it)
        // The component renders title in a span. Let's select the title span directly if possible, 
        // or just expect the text to contain the title.
        // Actually, the button contains the title and maybe an arrow.
        // Let's just check the titles we expect are in the correct order.

        // Expected order:
        // 1. Accessories (Folder)
        // 2. Multimedia (Folder)
        // 3. My Portfolio (Folder) - "My Portfolio" comes after "Multimedia" (M u l vs M y) ??
        //    "Multimedia" vs "My Portfolio". 'u' vs 'y'. 'u' comes before 'y'. So Multimedia first.
        // 4. My Resume (Folder)
        // 5. Contact_Information.txt (File)
        // 6. Welcome.txt (File)

        const expectedOrder = [
            "Accessories",
            "Multimedia",
            "My Portfolio",
            "My Resume",
            "Contact_Information.txt",
            "Welcome.txt"
        ];

        // Filter and map actual texts to match expected format
        // We might get extra text like "▶" for folders.
        // Let's leniently match or clean up.
        const cleanedTexts = itemTexts.map(t => t.replace('▶', '').trim());

        expect(cleanedTexts).toEqual(expectedOrder);
    });

    test('should sort submenu items (folders first, then alphabetical)', async ({ page }, testInfo) => {
        // Skip on mobile for simplicity of hover interaction, or adapt logic
        if (testInfo.project.name.toLowerCase().includes('mobile')) {
            test.skip(true, 'Skipping hover test on mobile devices for simplicity');
        }

        // Open Start Menu
        await page.getByTestId('taskbar-start-button').click();

        // Hover over 'Accessories'
        const accessoriesItem = page.getByTestId('start-menu-item-accessories');
        await accessoriesItem.hover();

        // Wait for submenu
        const submenu = page.getByTestId('start-submenu-depth-1');
        await expect(submenu).toBeVisible();

        // Get submenu items
        const items = submenu.locator('[data-testid^="start-submenu-item-"]');
        await expect(items.first()).toBeVisible();

        const itemTexts = await items.allTextContents();
        const cleanedTexts = itemTexts.map(t => t.replace('▶', '').trim());

        // Accessories content in config:
        // - Notepad.exe
        // - Calculator.exe
        // - Paint.exe
        // - Command Prompt

        // Expected Sorted Order:
        // - Calculator.exe
        // - Command Prompt
        // - Notepad.exe
        // - Paint.exe

        const expectedOrder = [
            "Calculator.exe",
            "Command Prompt",
            "Notepad.exe",
            "Paint.exe"
        ];

        expect(cleanedTexts).toEqual(expectedOrder);
    });
});
