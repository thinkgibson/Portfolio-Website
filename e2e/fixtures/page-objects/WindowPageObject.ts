import { Page, Locator, expect } from '@playwright/test';

export class WindowPageObject {
    constructor(private readonly page: Page) { }

    getWindow(name: string): Locator {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        return this.page.getByTestId(`window-${id}`);
    }

    getMinimizeButton(window: Locator): Locator {
        return window.getByTestId('window-minimize');
    }

    getMaximizeButton(window: Locator): Locator {
        return window.getByTestId('window-maximize');
    }

    getCloseButton(window: Locator): Locator {
        return window.getByTestId('window-close');
    }

    async minimize(name: string) {
        const win = this.getWindow(name);
        await this.getMinimizeButton(win).click();
    }

    async maximize(name: string) {
        const win = this.getWindow(name);
        await this.getMaximizeButton(win).click();
    }

    async close(name: string) {
        const win = this.getWindow(name);
        await this.getCloseButton(win).click();
    }

    async expectVisible(name: string) {
        await expect(this.getWindow(name)).toBeVisible();
    }

    async expectNotVisible(name: string) {
        await expect(this.getWindow(name)).not.toBeVisible();
    }

    async expectClosed(name: string) {
        await expect(this.getWindow(name)).not.toBeAttached();
    }
}
