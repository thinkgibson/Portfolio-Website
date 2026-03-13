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

// Polyfill matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

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
            { id: '1', title: 'Window 1', isActive: true, isMinimized: false, iconType: 'about' as const },
            { id: '2', title: 'Window 2', isActive: false, isMinimized: false, iconType: 'folder' as const },
        ],
        onWindowClick: jest.fn(),
        onStartClick: jest.fn(),
        onMinimizeWindow: jest.fn(),
        onCloseWindow: jest.fn(),
        onMinimizeAllWindows: jest.fn(),
        onCloseAllWindows: jest.fn(),
    };

    const renderTaskbar = async (props = defaultProps) => {
        let result: any;
        await act(async () => {
            result = render(
                <OSProvider>
                    <Taskbar {...props} />
                </OSProvider>
            );
        });
        // Wait for taskbar to be in the document
        expect(await screen.findByTestId('taskbar')).toBeInTheDocument();
        return result;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders start button and open windows', async () => {
        await renderTaskbar();
        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('Window 1')).toBeInTheDocument();
        expect(screen.getByText('Window 2')).toBeInTheDocument();
    });

    it('calls onStartClick when start button is clicked', async () => {
        await renderTaskbar();
        await act(async () => {
            fireEvent.click(screen.getByText('Start'));
        });
        expect(defaultProps.onStartClick).toHaveBeenCalled();
    });

    it('calls onWindowClick when a window button is clicked', async () => {
        await renderTaskbar();
        await act(async () => {
            fireEvent.click(screen.getByText('Window 2'));
        });
        expect(defaultProps.onWindowClick).toHaveBeenCalledWith('2');
    });

    it('updates time every second (24-hour format)', async () => {
        const mockDate = new Date('2026-01-17T12:00:00');
        jest.setSystemTime(mockDate);

        await renderTaskbar();
        // Noon should show 12:00 (not 12:00 PM)
        const timeElement = screen.getByText(/12:00/);
        expect(timeElement).toBeInTheDocument();
        expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(60000); // 1 minute
        });

        expect(screen.getByText(/12:01/)).toBeInTheDocument();
    });

    it('displays PM time in 24-hour format', async () => {
        const mockDate = new Date('2026-01-17T19:05:00');
        jest.setSystemTime(mockDate);

        await renderTaskbar();
        // 7:05 PM should show 19:05
        expect(screen.getByText('19:05')).toBeInTheDocument();
        expect(screen.queryByText(/PM/)).not.toBeInTheDocument();
    });

    it('displays morning time with zero padding in 24-hour format', async () => {
        const mockDate = new Date('2026-01-17T07:00:00');
        jest.setSystemTime(mockDate);

        await renderTaskbar();
        // 7:00 AM should show 07:00
        expect(screen.getByText('07:00')).toBeInTheDocument();
        expect(screen.queryByText(/AM/)).not.toBeInTheDocument();
    });

    it('toggles volume slider', async () => {
        await renderTaskbar();
        const volumeBtn = screen.getByTitle('Volume');

        await act(async () => {
            fireEvent.click(volumeBtn);
        });
        expect(screen.getByText('Mute')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(volumeBtn);
        });
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

        await renderTaskbar();
        const weatherBtn = screen.getByTitle('Weather');

        // Hover to show
        await act(async () => {
            fireEvent.pointerEnter(weatherBtn, { pointerType: 'mouse' });
        });

        expect(await screen.findByText('New York')).toBeInTheDocument();
        expect(screen.getByText('Sunny')).toBeInTheDocument();
        expect(screen.getByText('72°F')).toBeInTheDocument();

        // Leave to hide
        await act(async () => {
            fireEvent.pointerLeave(weatherBtn, { pointerType: 'mouse' });
        });
        
        await waitFor(() => {
            expect(screen.queryByText('New York')).not.toBeInTheDocument();
        });
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

        await renderTaskbar();
        const weatherBtn = screen.getByTitle('Weather');

        // Click to show (simulate touch or keyboard where pointerType is not mouse for the hover part)
        // If we just click, isHovering is false. So it SHOULD toggle.
        await act(async () => {
            fireEvent.click(weatherBtn);
        });
        expect(await screen.findByText('New York')).toBeInTheDocument();

        // Click again to hide
        await act(async () => {
            fireEvent.click(weatherBtn);
        });
        expect(screen.queryByText('New York')).not.toBeInTheDocument();
    });

    it('measures ping and shows tooltip on hover', async () => {
        // Mock success with slight delay to ensure loading state is seen
        (global.fetch as jest.Mock).mockImplementationOnce(() => 
            new Promise(resolve => setTimeout(() => resolve({}), 50))
        );

        await renderTaskbar();
        const networkBtn = screen.getByTitle('Network');

        // Hover to show
        await act(async () => {
            fireEvent.pointerEnter(networkBtn, { pointerType: 'mouse' });
        });

        await act(async () => {
            jest.advanceTimersByTime(10);
        });
        expect(await screen.findByText(/Measuring ping/i)).toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
            expect(screen.getByText(/Latency:/)).toBeInTheDocument();
        });

        // Leave to hide
        await act(async () => {
            fireEvent.pointerLeave(networkBtn, { pointerType: 'mouse' });
        });
        await waitFor(() => {
            expect(screen.queryByText(/Latency:/)).not.toBeInTheDocument();
        });
    });

    it('toggles network tooltip on mouse click', async () => {
        // Mock success with slight delay
        (global.fetch as jest.Mock).mockImplementationOnce(() => 
            new Promise(resolve => setTimeout(() => resolve({}), 50))
        );

        await renderTaskbar();
        const networkBtn = screen.getByTitle('Network');

        // Click to show
        await act(async () => {
            fireEvent.click(networkBtn);
        });

        await act(async () => {
            jest.advanceTimersByTime(10);
        });
        expect(await screen.findByText(/Measuring ping/i)).toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
            expect(screen.getByText(/Latency:/)).toBeInTheDocument();
        });

        // Click again to hide
        await act(async () => {
            fireEvent.click(networkBtn);
        });
        await waitFor(() => {
            expect(screen.queryByText(/Latency:/)).not.toBeInTheDocument();
        });
    });

    it('shows Minimize option when window is not minimized', async () => {
        await renderTaskbar();
        const windowBtn = screen.getByText('Window 2');

        await act(async () => {
            fireEvent.contextMenu(windowBtn);
        });

        expect(screen.getByText('Minimize')).toBeInTheDocument();
        expect(screen.queryByText('Restore')).not.toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('shows Restore option when window is minimized', async () => {
        const props = {
            ...defaultProps,
            openWindows: [
                { id: '1', title: 'Window 1', isActive: true, isMinimized: false, iconType: 'about' as const },
                { id: '2', title: 'Window 2', isActive: false, isMinimized: true, iconType: 'folder' as const },
            ]
        };
        await renderTaskbar(props);
        const windowBtn = screen.getByText('Window 2');

        await act(async () => {
            fireEvent.contextMenu(windowBtn);
        });

        expect(screen.getByText('Restore')).toBeInTheDocument();
        expect(screen.queryByText('Minimize')).not.toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('calls onWindowClick when Restore is clicked in context menu', async () => {
        const props = {
            ...defaultProps,
            openWindows: [
                { id: '2', title: 'Window 2', isActive: false, isMinimized: true, iconType: 'folder' as const },
            ]
        };
        await renderTaskbar(props);
        await act(async () => {
            fireEvent.contextMenu(screen.getByText('Window 2'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Restore'));
        });

        expect(defaultProps.onWindowClick).toHaveBeenCalledWith('2');
    });

    it('calls onMinimizeWindow when Minimize is clicked in context menu', async () => {
        await renderTaskbar();
        await act(async () => {
            fireEvent.contextMenu(screen.getByText('Window 2'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Minimize'));
        });

        expect(defaultProps.onMinimizeWindow).toHaveBeenCalledWith('2');
    });

    it('calls onCloseWindow when Close is clicked in context menu', async () => {
        await renderTaskbar();
        await act(async () => {
            fireEvent.contextMenu(screen.getByText('Window 2'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Close'));
        });

        expect(defaultProps.onCloseWindow).toHaveBeenCalledWith('2');
    });

    it('closes context menu when clicking outside', async () => {
        await renderTaskbar();
        await act(async () => {
            fireEvent.contextMenu(screen.getByText('Window 2'));
        });

        expect(await screen.findByText('Minimize')).toBeInTheDocument();

        // Clicking the overlay should close the menu
        const menu = await screen.findByTestId('taskbar-context-menu');
        const overlay = menu.parentElement!;
        
        await act(async () => {
            fireEvent.click(overlay);
        });

        await waitFor(() => {
            expect(screen.queryByText('Minimize')).not.toBeInTheDocument();
        });
    });

    it('keeps weather tooltip open when clicked after hover (Desktop behavior)', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: () => Promise.resolve({
                current_weather: { temperature: 72, weathercode: 0 },
                latitude: 40, longitude: -70, city: 'New York'
            })
        });

        await renderTaskbar();
        const weatherBtn = screen.getByTitle('Weather');

        // Hover -> Open
        await act(async () => {
            fireEvent.pointerEnter(weatherBtn, { pointerType: 'mouse' });
        });
        expect(await screen.findByText('New York')).toBeInTheDocument();

        // Click -> Should stay open (User Issue: it was closing)
        await act(async () => {
            fireEvent.click(weatherBtn, { pointerType: 'mouse' });
        });

        // Assert it is STILL open
        expect(await screen.findByText('New York')).toBeInTheDocument();
    });

    it('keeps network tooltip open when clicked after hover (Desktop behavior)', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => 
            new Promise(resolve => setTimeout(() => resolve({}), 50))
        );

        await renderTaskbar();
        const networkBtn = screen.getByTitle('Network');

        // Hover -> Open
        await act(async () => {
            fireEvent.pointerEnter(networkBtn, { pointerType: 'mouse' });
        });

        await act(async () => {
            jest.advanceTimersByTime(10);
        });
        expect(await screen.findByText(/Measuring ping/i)).toBeInTheDocument();

        // Click -> Should stay open
        await act(async () => {
            fireEvent.click(networkBtn, { pointerType: 'mouse' });
        });
        expect(await screen.findByText(/Measuring ping/i)).toBeInTheDocument();
    });
});
