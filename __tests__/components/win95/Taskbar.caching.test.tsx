import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Taskbar } from '../../../components/win95/Taskbar';
import { OSProvider } from '../../../components/win95/OSContext';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

const mockProps = {
    openWindows: [],
    onWindowClick: jest.fn(),
    onStartClick: jest.fn(),
    onMinimizeWindow: jest.fn(),
    onCloseWindow: jest.fn(),
    onMinimizeAllWindows: jest.fn(),
    onCloseAllWindows: jest.fn(),
};

describe('Taskbar Weather Caching', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });

    it('fetches from API when cache is empty', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => ({ city: 'Test City', latitude: 10, longitude: 20 })
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    current_weather: { temperature: 75, weathercode: 0 }
                })
            });

        render(
            <OSProvider>
                <Taskbar {...mockProps} />
            </OSProvider>
        );

        const weatherBtn = screen.getByTestId('sys-tray-weather');
        fireEvent.click(weatherBtn);

        await waitFor(() => {
            expect(screen.getByText('Test City')).toBeInTheDocument();
            expect(screen.getByText('75°F')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledTimes(2);

        // Check localStorage for GDPR compliance (no IP/coords)
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'win95-weather-cache',
            expect.stringContaining('"city":"Test City"')
        );
        const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
        expect(stored.data.city).toBe('Test City');
        expect(stored.data.temp).toBe(75);
        expect(stored.data.latitude).toBeUndefined();
        expect(stored.data.longitude).toBeUndefined();
    });

    it('uses cached data if within TTL', async () => {
        const cachedData = {
            city: 'Cached City',
            temp: 60,
            description: 'Sunny'
        };
        const timestamp = Date.now();
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            data: cachedData,
            timestamp
        }));

        render(
            <OSProvider>
                <Taskbar {...mockProps} />
            </OSProvider>
        );

        const weatherBtn = screen.getByTestId('sys-tray-weather');
        fireEvent.click(weatherBtn);

        await waitFor(() => {
            expect(screen.getByText('Cached City')).toBeInTheDocument();
            expect(screen.getByText('60°F')).toBeInTheDocument();
        });

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('fetches new data if cache is expired', async () => {
        const cachedData = {
            city: 'Old City',
            temp: 50,
            description: 'Cloudy'
        };
        // 2 hours ago (TTL is 1 hour)
        const timestamp = Date.now() - (2 * 60 * 60 * 1000);
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            data: cachedData,
            timestamp
        }));

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => ({ city: 'New City', latitude: 10, longitude: 20 })
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    current_weather: { temperature: 80, weathercode: 0 }
                })
            });

        render(
            <OSProvider>
                <Taskbar {...mockProps} />
            </OSProvider>
        );

        const weatherBtn = screen.getByTestId('sys-tray-weather');
        fireEvent.click(weatherBtn);

        await waitFor(() => {
            expect(screen.getByText('New City')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalled();
    });
});
