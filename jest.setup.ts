import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
});

// Mock ESM modules that cause issues with Jest/JSDOM
jest.mock('remark', () => ({
    remark: jest.fn().mockReturnValue({
        use: jest.fn().mockReturnThis(),
        process: jest.fn().mockResolvedValue({
            toString: () => 'mocked html'
        })
    })
}));

jest.mock('remark-html', () => ({
    __esModule: true,
    default: jest.fn()
}));
