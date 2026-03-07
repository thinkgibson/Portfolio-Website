import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StartSubMenu } from '../../../components/win95/StartSubMenu';
import '@testing-library/jest-dom';
import * as hooks from '../../../lib/hooks';

jest.mock('../../../lib/hooks', () => ({
    ...jest.requireActual('../../../lib/hooks'),
    useIsMobile: jest.fn(),
}));

describe('StartSubMenu', () => {
    const mockItems = [
        {
            id: 'folder1',
            title: 'Folder 1',
            iconType: 'folder' as const,
            children: [
                { id: 'subitem1', title: 'Sub Item 1', iconType: 'notepad' as const }
            ]
        },
        { id: 'item1', title: 'Item 1', iconType: 'about' as const },
    ];
    const mockOnItemClick = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (hooks.useIsMobile as jest.Mock).mockReturnValue(false);
    });

    it('renders submenu items', () => {
        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        expect(screen.getByText('Folder 1')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('applies right-aligned fixed mobile positioning when isMobile is true', () => {
        (hooks.useIsMobile as jest.Mock).mockReturnValue(true);

        // Mock window.innerWidth and window.innerHeight
        const originalInnerWidth = window.innerWidth;
        const originalInnerHeight = window.innerHeight;
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 667
        });

        // Mock getBoundingClientRect for parent
        const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
            right: 256,
            left: 0,
            width: 256,
            height: 40,
            top: 100,
            bottom: 140
        });

        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        const menu = screen.getByTestId('start-submenu-depth-1');

        // Logic: position: fixed, right: 0, bottom: window.innerHeight (667) - parentRect.top (100) = 567px
        expect(menu).toHaveStyle({
            position: 'fixed',
            right: '0px',
            left: 'auto',
            bottom: '567px',
            width: '16rem'
        });
        // Should NOT have left-full class
        expect(menu).not.toHaveClass('left-full');

        // Cleanup
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: originalInnerHeight
        });
        Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('applies desktop positioning when isMobile is false', () => {
        (hooks.useIsMobile as jest.Mock).mockReturnValue(false);
        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        const menu = screen.getByTestId('start-submenu-depth-1');
        // Desktop uses className for left-full and style for top
        expect(menu).toHaveClass('left-full');
        expect(menu).toHaveStyle({
            top: '0px'
        });
    });

    it('calls onItemClick and onClose when a leaf item is clicked', () => {
        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        fireEvent.click(screen.getByText('Item 1'));

        expect(mockOnItemClick).toHaveBeenCalledWith('item1');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('toggles nested submenu when a folder item is clicked', async () => {
        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        // Initially subitem is not there
        expect(screen.queryByText('Sub Item 1')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Folder 1'));

        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();

        // Click again to close
        fireEvent.click(screen.getByText('Folder 1'));

        await waitFor(() => {
            expect(screen.queryByText('Sub Item 1')).not.toBeInTheDocument();
        });
    });

    it('shows submenu on hover (desktop)', async () => {
        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        const folderItem = screen.getByText('Folder 1').closest('button')!;
        fireEvent.mouseEnter(folderItem);

        await waitFor(() => {
            expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
        }, { timeout: 1000 });
    });
});
