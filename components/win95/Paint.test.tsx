import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Paint } from './Paint';
import { OSProvider } from './OSContext';
import '@testing-library/jest-dom';

// Mock canvas commands
const mockContext = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    clearRect: jest.fn(),
};

describe('Paint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock HTMLCanvasElement.getContext
        HTMLCanvasElement.prototype.getContext = jest.fn((contextId) => {
            if (contextId === '2d') {
                return mockContext as any;
            }
            return null;
        });
    });

    it('renders the paint application', () => {
        render(
            <OSProvider>
                <Paint />
            </OSProvider>
        );
        expect(screen.getByText(/For Help/)).toBeInTheDocument();
        expect(screen.getByTitle('Pencil')).toBeInTheDocument();
    });

    it('selects tools', () => {
        render(
            <OSProvider>
                <Paint />
            </OSProvider>
        );
        const brush = screen.getByTitle('Brush');
        fireEvent.click(brush);
        expect(brush).toHaveClass('border-black');
    });

    it('draws on canvas', () => {
        render(
            <OSProvider>
                <Paint />
            </OSProvider>
        );
        const canvas = screen.getByTestId('paint-canvas');

        fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.moveTo).toHaveBeenCalled(); // toHaveBeenCalledWith(10, 10) depending on JSDOM rect

        fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
        expect(mockContext.lineTo).toHaveBeenCalled();
        expect(mockContext.stroke).toHaveBeenCalled();

        fireEvent.mouseUp(canvas);
    });
});
