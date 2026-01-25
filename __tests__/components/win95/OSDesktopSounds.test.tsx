import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { OSDesktop } from '../../../components/win95/OSDesktop';
import '@testing-library/jest-dom';

const mockPlaySound = jest.fn().mockResolvedValue(undefined);
const mockSetVolume = jest.fn();

jest.mock('../../../lib/soundSystem', () => ({
    getSoundSystem: jest.fn(() => ({
        playSound: mockPlaySound,
        setVolume: mockSetVolume,
        loadConfig: jest.fn().mockResolvedValue(undefined)
    }))
}));

describe('OSDesktop Sounds', () => {
    const mockWindows = [
        { id: 'test', title: 'Test Window', iconType: 'folder' as const, content: <div>Test</div> }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock Audio if needed (though soundSystem is mocked)
        global.Audio = jest.fn().mockImplementation(() => ({
            play: jest.fn().mockResolvedValue(undefined),
            pause: jest.fn(),
            currentTime: 0,
            volume: 1,
        }));
    });

    it('does not trigger click sound on background desktop click', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        const desktop = screen.getByTestId('desktop-container');
        fireEvent.mouseDown(desktop);

        // Should NOT be called for background click anymore
        expect(mockPlaySound).not.toHaveBeenCalledWith('click');
    });

    it('triggers click sound on Start Button click', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        const startButton = screen.getByTestId('taskbar-start-button');
        fireEvent.click(startButton);

        await waitFor(() => {
            expect(mockPlaySound).toHaveBeenCalledWith('click');
        }, { timeout: 2000 });
    });

    it('triggers click sound on Desktop Icon click', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        const icon = screen.getByTestId('desktop-icon-test-window');
        fireEvent.click(icon);

        await waitFor(() => {
            expect(mockPlaySound).toHaveBeenCalledWith('click');
        }, { timeout: 2000 });
    });

    it('triggers boot sound when boot sequence completes', async () => {
        jest.useFakeTimers();
        render(<OSDesktop windows={mockWindows} skipBoot={false} skipWelcome={true} />);

        // Advance through boot sequence
        act(() => {
            jest.advanceTimersByTime(10000); // 300ms * 21 messages + delays
        });

        await waitFor(() => {
            expect(mockPlaySound).toHaveBeenCalledWith('boot');
        }, { timeout: 2000 });

        jest.useRealTimers();
    });

    it('triggers shutdown sound on reboot', async () => {
        render(<OSDesktop windows={mockWindows} skipBoot={true} skipWelcome={true} />);

        // Right click to open context menu
        const desktop = screen.getByTestId('desktop-container');
        fireEvent.contextMenu(desktop);

        // Click reboot
        const rebootItem = screen.getByText('System reboot');
        fireEvent.click(rebootItem);

        await waitFor(() => {
            expect(mockPlaySound).toHaveBeenCalledWith('shutdown');
        }, { timeout: 2000 });
    });
});
