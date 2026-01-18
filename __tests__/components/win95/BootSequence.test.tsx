import { render, screen, fireEvent, act } from '@testing-library/react';
import { BootSequence } from '../../../components/win95/BootSequence';

describe('BootSequence', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('displays boot messages over time', () => {
        const onComplete = jest.fn();
        render(<BootSequence onComplete={onComplete} />);

        // Initially no messages (or first line depending on timing)

        // Advance time to see messages
        act(() => {
            jest.advanceTimersByTime(300 * 5);
        });

        expect(screen.getByText(/BIOS Version/)).toBeInTheDocument();
        expect(screen.getByText(/CPU: Antigravity/)).toBeInTheDocument();
        expect(onComplete).not.toHaveBeenCalled();
    });

    it('calls onComplete after finishing boot sequence', () => {
        const onComplete = jest.fn();
        render(<BootSequence onComplete={onComplete} />);

        // Advance all timers
        act(() => {
            jest.runAllTimers();
        });

        expect(onComplete).toHaveBeenCalled();
    });

    it('skips when clicked', () => {
        const onComplete = jest.fn();
        render(<BootSequence onComplete={onComplete} />);

        const container = screen.getByText(/Click anywhere to skip/).parentElement;
        if (!container) throw new Error('Container not found');

        fireEvent.click(container);
        expect(onComplete).toHaveBeenCalled();
    });
});
