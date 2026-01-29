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

if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'scrollTo', {
        writable: true,
        value: jest.fn().mockImplementation(() => { }),
    });
}

if (typeof global !== 'undefined') {
    (global as any).scrollTo = jest.fn().mockImplementation(() => { });
}

jest.mock('./lib/navigation', () => ({
    reloadPage: jest.fn(),
}));

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

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock HTMLMediaElement.play
Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    // Define the property getter
    get() {
        return () => {
            return Promise.resolve();
        };
    },
});

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
) as jest.Mock;
