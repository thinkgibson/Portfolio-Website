import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['<rootDir>/e2e/'],

    // HTML Reporter configuration
    reporters: [
        'default',
        [
            'jest-html-reporter',
            {
                pageTitle: 'Unit Test Report',
                outputPath: './test-report.html',
                includeFailureMsg: true,
                includeConsoleLog: true,
            },
        ],
    ],
    // Handle ESM modules
    transformIgnorePatterns: [
        '/node_modules/(?!(remark|remark-html|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position|mdast-util-from-markdown|mdast-util-to-hast|hast-util-to-html|hast-util-whitespace|property-information|html-void-elements|space-separated-tokens|comma-separated-tokens|micromark|decode-named-character-reference|character-entities|unist-util-visit|mdast-util-to-string)/)',
    ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
