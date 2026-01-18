import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Win95Window } from '../../../components/win95/Win95Window';
import '@testing-library/jest-dom';

// Mock matchMedia
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

describe('Win95Window', () => {
    const defaultProps = {
        title: 'Test Window',
        children: <div>Content</div>,
        onClose: jest.fn(),
        onMinimize: jest.fn(),
        onMaximize: jest.fn(),
        onResize: jest.fn(),
    };

    it('renders the window title', () => {
        render(<Win95Window {...defaultProps} />);
        expect(screen.getByText('Test Window')).toBeInTheDocument();
    });

    it('calls onMinimize when minimize button is clicked', () => {
        render(<Win95Window {...defaultProps} />);
        fireEvent.click(screen.getByTestId('window-minimize'));
        expect(defaultProps.onMinimize).toHaveBeenCalled();
    });

    it('calls onClose when close button is clicked', () => {
        render(<Win95Window {...defaultProps} />);
        fireEvent.click(screen.getByTestId('window-close'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onMaximize when maximize button is clicked', () => {
        render(<Win95Window {...defaultProps} />);
        fireEvent.click(screen.getByTestId('window-maximize'));
        expect(defaultProps.onMaximize).toHaveBeenCalled();
    });

    it('renders menu bar items', () => {
        render(<Win95Window {...defaultProps} />);
        expect(screen.getByText('File')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();
    });

    it('toggles dropdown menus', () => {
        render(<Win95Window {...defaultProps} />);
        const fileMenu = screen.getByText('File');

        fireEvent.click(fileMenu);
        expect(screen.getByText('Maximize')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();

        fireEvent.click(fileMenu);
        expect(screen.queryByText('Maximize')).not.toBeInTheDocument();
    });

    it('toggles search bar visibility', () => {
        render(<Win95Window {...defaultProps} />);
        fireEvent.click(screen.getByText('Search'));
        fireEvent.click(screen.getByText('Open Search'));

        expect(screen.getByText('Find:')).toBeInTheDocument();
        const searchInput = screen.getByRole('textbox');
        expect(searchInput).toBeInTheDocument();

        // Close search
        fireEvent.click(screen.getByText('X'));
        expect(screen.queryByText('Find:')).not.toBeInTheDocument();
    });

    it('calls onAbout when About... is clicked', () => {
        const onAbout = jest.fn();
        render(<Win95Window {...defaultProps} onAbout={onAbout} />);

        fireEvent.click(screen.getByText('Help'));
        fireEvent.click(screen.getByText('About...'));

        expect(onAbout).toHaveBeenCalled();
    });

    it('highlights text when search term is entered', () => {
        render(
            <Win95Window {...defaultProps}>
                <div>Hello World</div>
            </Win95Window>
        );

        fireEvent.click(screen.getByText('Search'));
        fireEvent.click(screen.getByText('Open Search'));

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'Hello' } });

        const highlight = screen.getByText('Hello');
        expect(highlight.tagName).toBe('MARK');
    });

    describe('mobile constraints', () => {
        const originalInnerWidth = window.innerWidth;
        const originalInnerHeight = window.innerHeight;

        beforeAll(() => {
            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
            Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
        });

        afterAll(() => {
            Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
            Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight });
        });

        it('detects mobile and renders', () => {
            (window.matchMedia as jest.Mock).mockImplementation(query => ({
                matches: query === "(max-width: 639px)",
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }));

            render(<Win95Window {...defaultProps} />);
            const windowElement = screen.getByTestId('window-test-window');
            expect(windowElement).toBeInTheDocument();

            // Cleanup mock for other tests
            (window.matchMedia as jest.Mock).mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }));
        });
    });

    it.skip('calls onResize when resize handle is dragged', () => {
        render(<Win95Window {...defaultProps} width={500} height={400} />);

        // Find the resize handle (it's the SVG in the bottom right)
        // We'll need to select it structurally since it doesn't have a testid
        const resizeHandle = document.querySelector('.cursor-se-resize');
        expect(resizeHandle).toBeInTheDocument();

        fireEvent.pointerDown(resizeHandle!, { clientX: 500, clientY: 400 });

        // Move mouse to resize
        fireEvent.pointerMove(document, { clientX: 550, clientY: 450 });

        // Check if onResize was called with new dimensions
        // Initial 500 + delta 50 = 550
        // Initial 400 + delta 50 = 450
        expect(defaultProps.onResize).toHaveBeenCalledWith(550, 450);

        fireEvent.pointerUp(document);
    });

    it('does not render resize handle when maximized', () => {
        render(<Win95Window {...defaultProps} isMaximized={true} />);
        const resizeHandle = document.querySelector('.cursor-se-resize');
        expect(resizeHandle).not.toBeInTheDocument();
    });
});
