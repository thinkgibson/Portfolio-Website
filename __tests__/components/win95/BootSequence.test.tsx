import { render, screen, fireEvent, act } from '@testing-library/react';
import { BootSequence } from '../../../components/win95/BootSequence';

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ ip: '127.0.0.1' }),
    })
) as jest.Mock;

describe('BootSequence', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('displays boot messages over time', async () => {
        const onComplete = jest.fn();
        await act(async () => {
            render(<BootSequence bootContent={[]} onComplete={onComplete} />);
        });

        // Advance time to see messages
        await act(async () => {
            jest.advanceTimersByTime(300 * 5);
        });

        expect(screen.getByText(/BIOS Version/)).toBeInTheDocument();
        expect(screen.getByText(/CPU: Antigravity/)).toBeInTheDocument();
        expect(onComplete).not.toHaveBeenCalled();
    });

    it('calls onComplete after finishing boot sequence', async () => {
        const onComplete = jest.fn();
        await act(async () => {
            render(<BootSequence bootContent={[]} onComplete={onComplete} />);
        });

        // Advance all timers
        await act(async () => {
            jest.runAllTimers();
        });

        expect(onComplete).toHaveBeenCalled();
    });

    it('skips when clicked', async () => {
        const onComplete = jest.fn();
        await act(async () => {
            render(<BootSequence bootContent={[]} onComplete={onComplete} />);
        });

        const container = screen.getByText(/Click anywhere to skip/).parentElement;
        if (!container) throw new Error('Container not found');

        fireEvent.click(container);
        expect(onComplete).toHaveBeenCalled();
    });
});
