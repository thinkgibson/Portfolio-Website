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

        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        // Find the desktop container (it's the first div usually, or we can find it by class)
        // We'll look for an element with the data-window-positions attribute
        const { waitFor } = require('@testing-library/react');
        await waitFor(() => {
            const desktop = screen.getByTestId('desktop-icon-test-window').parentElement?.parentElement;
            const positions = JSON.parse(desktop?.getAttribute('data-window-positions') || '{}');
            expect(positions['test-window']).toEqual({ x: 500, y: 500 });
        }, { timeout: 2000 });
    });


    it('opens context menu on right click and can close all windows', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        // Open a window first
        const icon = screen.getByTestId('desktop-icon-test-window');
        fireEvent.click(icon);
        expect(await screen.findByTestId('window-test-window')).toBeInTheDocument();

        // Right click on desktop (the container)
        const desktop = screen.getByTestId('desktop-container');
        fireEvent.contextMenu(desktop);

        // Check if context menu is open
        expect(screen.getByTestId('desktop-context-menu')).toBeInTheDocument();
        expect(screen.getByText('Close all windows')).toBeInTheDocument();

        // Click "Close all windows"
        fireEvent.click(screen.getByText('Close all windows'));

        // Window should be gone
        const { waitFor } = require('@testing-library/react');
        await waitFor(() => {
            expect(screen.queryByTestId('window-test-window')).not.toBeInTheDocument();
        });
    });

    it('opens wallpaper selector from context menu and applies wallpaper', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        // Right click on desktop
        const desktop = screen.getByTestId('desktop-container');
        fireEvent.contextMenu(desktop);

        // Click "Change wallpaper"
        fireEvent.click(screen.getByText('Change wallpaper'));

        // Check if selector is open
        expect(screen.getByTestId('window-display-properties')).toBeInTheDocument();
        expect(screen.getByText('Clouds')).toBeInTheDocument();

        // Select Clouds
        const cloudsOption = screen.getByTestId('wallpaper-option-clouds');
        fireEvent.click(cloudsOption);

        // Click Apply
        fireEvent.click(screen.getByTestId('wallpaper-apply'));

        // Check if selector is closed
        expect(screen.queryByText('Display Properties')).not.toBeInTheDocument();

        // Check if wallpaper is applied to desktop style
        expect(desktop).toHaveStyle({ backgroundImage: 'url(/wallpapers/clouds.png)' });

        // Check if wallpaper is persisted in localStorage
        const savedWallpaper = JSON.parse(localStorage.getItem('win95-wallpaper') || '{}');
        expect(savedWallpaper.id).toBe('clouds');
    });
});
