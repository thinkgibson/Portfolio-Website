import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Taskbar } from '../../../components/win95/Taskbar';
import { OSProvider } from '../../../components/win95/OSContext';
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

// Polyfill PointerEvent for JSDOM
if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
        public pointerType: string;
        constructor(type: string, params: any = {}) {
            super(type, params);
            this.pointerType = params.pointerType;
        }
    }
    global.PointerEvent = PointerEvent as any;
}

describe('Taskbar', () => {
    const defaultProps = {
        openWindows: [
            { id: '1', title: 'Window 1', isActive: true, iconType: 'about' as const },
            { id: '2', title: 'Window 2', isActive: false, iconType: 'folder' as const },
        ],
        onWindowClick: jest.fn(),
        onStartClick: jest.fn(),
        onMinimizeWindow: jest.fn(),
        onCloseWindow: jest.fn(),
        onMinimizeAllWindows: jest.fn(),
        onCloseAllWindows: jest.fn(),
    };

    const renderTaskbar = (props = defaultProps) => {
        return render(
            <OSProvider>
                <Taskbar {...props} />
            </OSProvider>
        );
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
        renderTaskbar();
        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('Window 1')).toBeInTheDocument();
        expect(screen.getByText('Window 2')).toBeInTheDocument();
    });

    it('calls onStartClick when start button is clicked', () => {
        renderTaskbar();
        fireEvent.click(screen.getByText('Start'));
        expect(defaultProps.onStartClick).toHaveBeenCalled();
    });

    it('calls onWindowClick when a window button is clicked', () => {
        renderTaskbar();
        fireEvent.click(screen.getByText('Window 2'));
        expect(defaultProps.onWindowClick).toHaveBeenCalledWith('2');
    });

    it('updates time every second (24-hour format)', () => {
        const mockDate = new Date('2026-01-17T12:00:00');
        jest.setSystemTime(mockDate);

        renderTaskbar();
        // Noon should show 12:00 (not 12:00 PM)
        const timeElement = screen.getByText(/12:00/);
        expect(timeElement).toBeInTheDocument();
        expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(60000); // 1 minute
        });

        expect(screen.getByText(/12:01/)).toBeInTheDocument();
    });

    it('displays PM time in 24-hour format', () => {
        const mockDate = new Date('2026-01-17T19:05:00');
        jest.setSystemTime(mockDate);

        renderTaskbar();
        // 7:05 PM should show 19:05
        expect(screen.getByText('19:05')).toBeInTheDocument();
        expect(screen.queryByText(/PM/)).not.toBeInTheDocument();
    });

    it('displays morning time with zero padding in 24-hour format', () => {
        const mockDate = new Date('2026-01-17T07:00:00');
        jest.setSystemTime(mockDate);

        renderTaskbar();
        // 7:00 AM should show 07:00
        expect(screen.getByText('07:00')).toBeInTheDocument();
        expect(screen.queryByText(/AM/)).not.toBeInTheDocument();
    });

    it('toggles volume slider', () => {
        renderTaskbar();
        const volumeBtn = screen.getByTitle('Volume');

        fireEvent.click(volumeBtn);
        expect(screen.getByText('Mute')).toBeInTheDocument();

        fireEvent.click(volumeBtn);
        expect(screen.queryByText('Mute')).not.toBeInTheDocument();
    });

    it('fetches weather and shows tooltip on hover', async () => {
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

        renderTaskbar();
        const weatherBtn = screen.getByTitle('Weather');

        // Hover to show
        fireEvent.pointerEnter(weatherBtn, { pointerType: 'mouse' });

        expect(await screen.findByText('New York')).toBeInTheDocument();
        expect(screen.getByText('Sunny')).toBeInTheDocument();
        expect(screen.getByText('72°F')).toBeInTheDocument();

        // Leave to hide
        fireEvent.pointerLeave(weatherBtn, { pointerType: 'mouse' });
        expect(screen.queryByText('New York')).not.toBeInTheDocument();
    });

    it('toggles weather tooltip on click', async () => {
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

        renderTaskbar();
        const weatherBtn = screen.getByTitle('Weather');

        // Click to show (simulate touch or keyboard where pointerType is not mouse for the hover part)
        // If we just click, isHovering is false. So it SHOULD toggle.
        fireEvent.click(weatherBtn);
        expect(await screen.findByText('New York')).toBeInTheDocument();

        // Click again to hide
        fireEvent.click(weatherBtn);
        expect(screen.queryByText('New York')).not.toBeInTheDocument();
    });

    it('measures ping and shows tooltip on hover', async () => {
        // Mock success
        (global.fetch as jest.Mock).mockResolvedValueOnce({});

        renderTaskbar();
        const networkBtn = screen.getByTitle('Network');

        // Hover to show
        fireEvent.pointerEnter(networkBtn, { pointerType: 'mouse' });
        expect(screen.getByText('Measuring ping...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Latency:/)).toBeInTheDocument();
        });

        // Leave to hide
        fireEvent.pointerLeave(networkBtn, { pointerType: 'mouse' });
        expect(screen.queryByText(/Latency:/)).not.toBeInTheDocument();
    });

    it('toggles network tooltip on mouse click', async () => {
        // Mock success
        (global.fetch as jest.Mock).mockResolvedValueOnce({});

        renderTaskbar();
        const networkBtn = screen.getByTitle('Network');

        // Click to show
        fireEvent.click(networkBtn);
        expect(screen.getByText('Measuring ping...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Latency:/)).toBeInTheDocument();
        });

        // Click again to hide
        fireEvent.click(networkBtn);
        expect(screen.queryByText(/Latency:/)).not.toBeInTheDocument();
    });

    it('opens context menu on right click of window button', () => {
        renderTaskbar();
        const windowBtn = screen.getByText('Window 2');

        fireEvent.contextMenu(windowBtn);

        expect(screen.getByText('Restore')).toBeInTheDocument();
        expect(screen.getByText('Minimize')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('calls onWindowClick when Restore is clicked in context menu', () => {
        renderTaskbar();
        fireEvent.contextMenu(screen.getByText('Window 2'));

        fireEvent.click(screen.getByText('Restore'));

        expect(defaultProps.onWindowClick).toHaveBeenCalledWith('2');
    });

    it('calls onMinimizeWindow when Minimize is clicked in context menu', () => {
        renderTaskbar();
        fireEvent.contextMenu(screen.getByText('Window 2'));

        fireEvent.click(screen.getByText('Minimize'));

        expect(defaultProps.onMinimizeWindow).toHaveBeenCalledWith('2');
    });

    it('calls onCloseWindow when Close is clicked in context menu', () => {
        renderTaskbar();
        fireEvent.contextMenu(screen.getByText('Window 2'));

        fireEvent.click(screen.getByText('Close'));

        expect(defaultProps.onCloseWindow).toHaveBeenCalledWith('2');
    });

    it('closes context menu when clicking outside', async () => {
        renderTaskbar();
        fireEvent.contextMenu(screen.getByText('Window 2'));

        expect(screen.getByText('Restore')).toBeInTheDocument();

        // Clicking the overlay should close the menu
        const menu = screen.getByTestId('taskbar-context-menu');
        const overlay = menu.parentElement!;
        fireEvent.click(overlay);

        await waitFor(() => {
            expect(screen.queryByText('Restore')).not.toBeInTheDocument();
        });
    });

    it('keeps weather tooltip open when clicked after hover (Desktop behavior)', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: () => Promise.resolve({
                current_weather: { temperature: 72, weathercode: 0 },
                latitude: 40, longitude: -70, city: 'New York'
            })
        });

        renderTaskbar();
        const weatherBtn = screen.getByTitle('Weather');

        // Hover -> Open
        fireEvent.pointerEnter(weatherBtn, { pointerType: 'mouse' });
        expect(await screen.findByText('New York')).toBeInTheDocument();

        // Click -> Should stay open (User Issue: it was closing)
        fireEvent.click(weatherBtn, { pointerType: 'mouse' });

        // Assert it is STILL open
        expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('keeps network tooltip open when clicked after hover (Desktop behavior)', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({});

        renderTaskbar();
        const networkBtn = screen.getByTitle('Network');

        // Hover -> Open
        fireEvent.pointerEnter(networkBtn, { pointerType: 'mouse' });
        expect(screen.getByText('Measuring ping...')).toBeInTheDocument();

        // Click -> Should stay open
        fireEvent.click(networkBtn, { pointerType: 'mouse' });
        expect(screen.getByText('Measuring ping...')).toBeInTheDocument();
    });
});
