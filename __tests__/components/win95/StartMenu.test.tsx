import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StartMenu } from '../../../components/win95/StartMenu';
import '@testing-library/jest-dom';

describe('StartMenu', () => {
    const mockItems = [
        { id: 'item1', title: 'Item 1', iconType: 'folder' as const },
        { id: 'item2', title: 'Item 2', iconType: 'about' as const },
    ];
    const mockOnItemClick = jest.fn();
    const mockOnReboot = jest.fn();
    const mockOnClose = jest.fn();

    it('renders all menu items', () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Windows')).toBeInTheDocument();
        expect(screen.getByText('95')).toBeInTheDocument();
    });

    it('calls onItemClick and onClose when an item is clicked', () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Item 1'));

        expect(mockOnItemClick).toHaveBeenCalledWith('item1');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onReboot and onClose when "Reboot..." is clicked', () => {
        render(<StartMenu items={mockItems} onItemClick={mockOnItemClick} onReboot={mockOnReboot} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Reboot...'));

        expect(mockOnReboot).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});
