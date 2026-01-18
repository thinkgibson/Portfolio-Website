import { test as base } from '@playwright/test';
import { WindowPageObject } from './page-objects/WindowPageObject';
import { DesktopPageObject } from './page-objects/DesktopPageObject';

type MyFixtures = {
    window: WindowPageObject;
    desktop: DesktopPageObject;
};

export const test = base.extend<MyFixtures>({
    window: async ({ page }, use) => {
        await use(new WindowPageObject(page));
    },
    desktop: async ({ page }, use) => {
        await use(new DesktopPageObject(page));
    },
});

export { expect } from '@playwright/test';
export default test;
