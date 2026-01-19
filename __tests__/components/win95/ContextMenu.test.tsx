import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from '../../../components/win95/ContextMenu';
import '@testing-library/jest-dom';

describe('ContextMenu', () => {
    const mockItems = [
        { label: 'Item 1', action: jest.fn() },
        { label: 'Item 2', action: jest.fn(), disabled: true },
        { label: 'Item 3', action: jest.fn() },
    ];
    const mockClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all menu items', () => {
        render(<ContextMenu x={100} y={100} items={mockItems} onClose={mockClose} />);

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('calls action and onClose when an item is clicked', () => {
        render(<ContextMenu x={100} y={100} items={mockItems} onClose={mockClose} />);

        fireEvent.click(screen.getByText('Item 1'));

        expect(mockItems[0].action).toHaveBeenCalled();
        expect(mockClose).toHaveBeenCalled();
    });

    it('does not call action when a disabled item is clicked', () => {
        render(<ContextMenu x={100} y={100} items={mockItems} onClose={mockClose} />);

        fireEvent.click(screen.getByText('Item 2'));

        expect(mockItems[1].action).not.toHaveBeenCalled();
        // The background overlay click might still trigger onClose if not handled correctly, 
        // but the button itself is disabled.
    });

    it('calls onClose when clicking the background overlay', () => {
        render(<ContextMenu x={100} y={100} items={mockItems} onClose={mockClose} />);

        // The fixed inset div is the overlay
        const overlay = screen.getByTestId('context-menu').parentElement as HTMLElement;
        fireEvent.click(overlay);

        expect(mockClose).toHaveBeenCalled();
    });
});
