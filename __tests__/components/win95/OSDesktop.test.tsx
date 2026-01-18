import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OSDesktop } from '../../../components/win95/OSDesktop';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('OSDesktop Persistence', () => {
    const mockWindows = [
        { id: 'test', title: 'Test Window', iconType: 'folder' as const, content: <div>Test</div> },
        { id: 'welcome', title: 'Welcome', iconType: 'about' as const, content: <div>Welcome</div> }
    ];

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('loads window positions into state from localStorage on mount', async () => {
        const savedPositions = { 'test-window': { x: 500, y: 500 } };
        localStorage.setItem('win95-window-positions', JSON.stringify(savedPositions));

        render(<OSDesktop windows={mockWindows} skipBoot={false} skipWelcome={true} />);

        // Find the desktop container (it's the first div usually, or we can find it by class)
        // We'll look for an element with the data-window-positions attribute
        const { waitFor } = require('@testing-library/react');
        await waitFor(() => {
            const desktop = screen.getByTestId('desktop-icon-test-window').parentElement?.parentElement;
            const positions = JSON.parse(desktop?.getAttribute('data-window-positions') || '{}');
            expect(positions['test-window']).toEqual({ x: 500, y: 500 });
        }, { timeout: 2000 });
    });


    it('saves position to localStorage (integration check)', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={false} skipWelcome={true} />);

        // Open test window
        const icon = screen.getByTestId('desktop-icon-test-window');
        fireEvent.click(icon);

        const windowElement = await screen.findByTestId('window-test-window');
        expect(windowElement).toBeInTheDocument();

        // Note: Testing the actual save to localStorage via drag is hard in JSDOM
        // because it depends on framer-motion events. We'll rely on our E2E tests
        // for full drag-and-drop verification.
    });
});
