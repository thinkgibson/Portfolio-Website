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

    it('applies mobile positioning when isMobile is true', () => {
        (hooks.useIsMobile as jest.Mock).mockReturnValue(true);
        render(<StartSubMenu items={mockItems} onItemClick={mockOnItemClick} onClose={mockOnClose} depth={1} />);

        const menu = screen.getByTestId('start-submenu-depth-1');
        expect(menu).toHaveStyle({
            left: '0px',
            bottom: '100%',
            top: 'auto'
        });
        // Should NOT have left-full class
        expect(menu).not.toHaveClass('left-full');
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
