import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StartMenu } from '../../../components/win95/StartMenu';
import '@testing-library/jest-dom';
import * as hooks from '../../../lib/hooks';

jest.mock('../../../lib/hooks', () => ({
    ...jest.requireActual('../../../lib/hooks'),
    useIsMobile: jest.fn(),
}));

describe('StartMenu', () => {
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
    const mockOnReboot = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (hooks.useIsMobile as jest.Mock).mockReturnValue(false);
    });

    it('renders all menu items', () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        expect(screen.getByText('Folder 1')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Windows')).toBeInTheDocument();
        expect(screen.getByText('95')).toBeInTheDocument();
    });

    it('shows submenu on hover (desktop)', async () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        const folderItem = screen.getByText('Folder 1').closest('button')!;
        fireEvent.mouseEnter(folderItem);

        await waitFor(() => {
            expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
        }, { timeout: 1000 });
    });

    it('calls onItemClick and onClose when a subitem is clicked', async () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        const folderItem = screen.getByText('Folder 1').closest('button')!;
        fireEvent.mouseEnter(folderItem);

        const subItem = await screen.findByText('Sub Item 1');
        fireEvent.click(subItem);

        expect(mockOnItemClick).toHaveBeenCalledWith('subitem1');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('opens submenu on click and does NOT close menu (desktop)', async () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Folder 1'));

        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
        expect(mockOnItemClick).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('opens submenu on click and does NOT close menu (mobile)', () => {
        (hooks.useIsMobile as jest.Mock).mockReturnValue(true);
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Folder 1'));

        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
        expect(mockOnItemClick).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onReboot and onClose when "Reboot..." is clicked', () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Reboot...'));

        expect(mockOnReboot).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});
