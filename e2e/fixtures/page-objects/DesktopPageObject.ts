import { Page, Locator, expect } from '@playwright/test';

export class DesktopPageObject {
    constructor(private readonly page: Page) { }

    getIcon(label: string): Locator {
        const id = label.toLowerCase().replace(/\s+/g, '-');
        return this.page.getByTestId(`desktop-icon-${id}`);
    }

    async openIcon(label: string) {
        await this.getIcon(label).click();
    }

    getTaskbarItem(title: string): Locator {
        const id = title.toLowerCase().replace(/\s+/g, '-');
        return this.page.getByTestId(`taskbar-item-${id}`);
    }

    async clickTaskbarItem(title: string) {
        await this.getTaskbarItem(title).click();
    }

    async clickSystemTrayIcon(type: 'weather' | 'network' | 'volume') {
        await this.page.getByTestId(`sys-tray-${type}`).click();
    }

    async clickStartButton() {
        await this.page.getByTestId('taskbar-start-button').click();
    }

    async expectIconVisible(label: string) {
        await expect(this.getIcon(label)).toBeVisible();
    }
}
