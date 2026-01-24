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

    // Helper to dispatch pointer events with coordinates
    const dispatchPointerEvent = (element: Element | Document, type: string, props: any) => {
        const event = new Event(type, { bubbles: true });
        Object.assign(event, props);
        fireEvent(element, event);
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


    it('respects minWidth and minHeight constraints', () => {
        const onResize = jest.fn();
        render(<Win95Window {...defaultProps} onResize={onResize} minWidth={300} minHeight={400} width={300} height={400} />);

        // Mock getBoundingClientRect
        const windowElement = screen.getByTestId('window-test-window');
        jest.spyOn(windowElement, 'getBoundingClientRect').mockReturnValue({
            width: 300,
            height: 400,
            top: 0,
            left: 0,
            bottom: 400,
            right: 300,
            x: 0,
            y: 0,
            toJSON: () => { }
        });

        const resizeHandle = document.querySelector('.cursor-se-resize');
        // Initial size 300x400

        // Drag to make it smaller (200x200)
        // fireEvent.pointerDown(resizeHandle!, { clientX: 300, clientY: 400 });
        dispatchPointerEvent(resizeHandle!, 'pointerdown', { clientX: 300, clientY: 400 });

        // fireEvent.pointerMove(document, { clientX: 200, clientY: 200 });
        dispatchPointerEvent(document, 'pointermove', { clientX: 200, clientY: 200 });

        // fireEvent.pointerUp(document);
        dispatchPointerEvent(document, 'pointerup', {});

        // Should be capped at min dimensions
        expect(onResize).toHaveBeenCalledWith(300, 400);
    });

    it('locks aspect ratio when resizing', () => {
        const onResize = jest.fn();
        // Start with 100x100 (1:1 ratio)
        render(<Win95Window {...defaultProps} onResize={onResize} lockAspectRatio={true} width={100} height={100} minWidth={50} minHeight={50} />);

        const windowElement = screen.getByTestId('window-test-window');
        jest.spyOn(windowElement, 'getBoundingClientRect').mockReturnValue({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            bottom: 100,
            right: 100,
            x: 0,
            y: 0,
            toJSON: () => { }
        });

        const resizeHandle = document.querySelector('.cursor-se-resize');

        // Start drag at bottom-right corner
        // fireEvent.pointerDown(resizeHandle!, { clientX: 100, clientY: 100 });
        dispatchPointerEvent(resizeHandle!, 'pointerdown', { clientX: 100, clientY: 100 });

        // Move mouse to 200x150 (width increases by 100, height by 50)
        // If locked to 1:1, width=200 should force height=200
        // fireEvent.pointerMove(document, { clientX: 200, clientY: 150 });
        dispatchPointerEvent(document, 'pointermove', { clientX: 200, clientY: 150 });

        // Check if aspect ratio was maintained (driven by width in our implementation)
        // calculated width = 100 + (200-100) = 200
        // calculated height = 200 / 1 = 200
        expect(onResize).toHaveBeenCalledWith(200, 200);

        // fireEvent.pointerUp(document);
        dispatchPointerEvent(document, 'pointerup', {});
    });

    it('respects min dimensions while locking aspect ratio', () => {
        const onResize = jest.fn();
        // Start with 200x200 (1:1 ratio), min size 100x100
        render(<Win95Window {...defaultProps} onResize={onResize} lockAspectRatio={true} width={200} height={200} minWidth={100} minHeight={100} />);

        const windowElement = screen.getByTestId('window-test-window');
        jest.spyOn(windowElement, 'getBoundingClientRect').mockReturnValue({
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            bottom: 200,
            right: 200,
            x: 0,
            y: 0,
            toJSON: () => { }
        });

        const resizeHandle = document.querySelector('.cursor-se-resize');

        // fireEvent.pointerDown(resizeHandle!, { clientX: 200, clientY: 200 });
        dispatchPointerEvent(resizeHandle!, 'pointerdown', { clientX: 200, clientY: 200 });

        // Try to shrink to 50x50
        // fireEvent.pointerMove(document, { clientX: 50, clientY: 50 });
        dispatchPointerEvent(document, 'pointermove', { clientX: 50, clientY: 50 });

        // Should stop at 100x100
        expect(onResize).toHaveBeenCalledWith(100, 100);

        // fireEvent.pointerUp(document);
        dispatchPointerEvent(document, 'pointerup', {});
    });

    it('does not render maximize button when canMaximize is false', () => {
        render(<Win95Window {...defaultProps} canMaximize={false} />);
        expect(screen.queryByTestId('window-maximize')).not.toBeInTheDocument();
    });
});
