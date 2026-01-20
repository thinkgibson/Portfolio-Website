import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 2, // Always retry 2 times
    workers: process.env.CI ? 1 : 1, // Always use 1 worker for stability
    timeout: 60000, // Increase global timeout to 60s
    reporter: [['html', { open: 'never' }], ['./e2e/reporters/terminal-reporter.ts']],
    use: {
        baseURL: 'http://127.0.0.1:3001',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npx next dev -p 3001 --hostname 127.0.0.1',
        url: 'http://127.0.0.1:3001',
        reuseExistingServer: true,
        timeout: 120 * 1000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
