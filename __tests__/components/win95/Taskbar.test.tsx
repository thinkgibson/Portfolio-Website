import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Taskbar } from '../../../components/win95/Taskbar';
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
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('Taskbar', () => {
    const defaultProps = {
        openWindows: [
            { id: '1', title: 'Window 1', isActive: true, iconType: 'about' as const },
            { id: '2', title: 'Window 2', isActive: false, iconType: 'folder' as const },
        ],
        onWindowClick: jest.fn(),
        onStartClick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders start button and open windows', () => {
        render(<Taskbar {...defaultProps} />);
        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('Window 1')).toBeInTheDocument();
        expect(screen.getByText('Window 2')).toBeInTheDocument();
    });

    it('calls onStartClick when start button is clicked', () => {
        render(<Taskbar {...defaultProps} />);
        fireEvent.click(screen.getByText('Start'));
        expect(defaultProps.onStartClick).toHaveBeenCalled();
    });

    it('calls onWindowClick when a window button is clicked', () => {
        render(<Taskbar {...defaultProps} />);
        fireEvent.click(screen.getByText('Window 2'));
        expect(defaultProps.onWindowClick).toHaveBeenCalledWith('2');
    });

    it('updates time every second', () => {
        const mockDate = new Date('2026-01-17T12:00:00');
        jest.setSystemTime(mockDate);

        render(<Taskbar {...defaultProps} />);
        const timeElement = screen.getByText(/12:00/);
        expect(timeElement).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(60000); // 1 minute
        });

        expect(screen.getByText(/12:01/)).toBeInTheDocument();
    });

    it('toggles volume slider', () => {
        render(<Taskbar {...defaultProps} />);
        const volumeBtn = screen.getByTitle('Volume');

        fireEvent.click(volumeBtn);
        expect(screen.getByText('Mute')).toBeInTheDocument();

        fireEvent.click(volumeBtn);
        expect(screen.queryByText('Mute')).not.toBeInTheDocument();
    });

    it('fetches weather and shows tooltip', async () => {
        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url.includes('ipapi.co')) {
                return Promise.resolve({
                    json: () => Promise.resolve({ latitude: 40, longitude: -70, city: 'New York' })
                });
            }
            if (url.includes('open-meteo')) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        current_weather: { temperature: 72, weathercode: 0 }
                    })
                });
            }
        });

        render(<Taskbar {...defaultProps} />);
        const weatherBtn = screen.getByTitle('Weather');

        fireEvent.click(weatherBtn);

        expect(await screen.findByText('New York')).toBeInTheDocument();
        expect(screen.getByText('Sunny')).toBeInTheDocument();
        expect(screen.getByText('72°F')).toBeInTheDocument();
    });
});
