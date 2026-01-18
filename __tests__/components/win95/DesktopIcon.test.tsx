import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopIcon } from '../../../components/win95/DesktopIcon';

describe('DesktopIcon', () => {
    const defaultProps = {
        id: 'test-icon',
        label: 'Test Icon',
        iconType: 'folder' as const,
        onOpen: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with correct label', () => {
        render(<DesktopIcon {...defaultProps} />);
        expect(screen.getByText('Test Icon')).toBeInTheDocument();
    });

    it('calls onOpen on single click', () => {
        render(<DesktopIcon {...defaultProps} />);
        const icon = screen.getByTestId('desktop-icon-test-icon');

        fireEvent.click(icon);
        expect(defaultProps.onOpen).toHaveBeenCalledWith('test-icon');
    });

    it('renders different icon types', () => {
        const { rerender } = render(<DesktopIcon {...defaultProps} iconType="about" />);
        // Icons are SVG or components, we just check they render without crashing
        expect(screen.getByText('Test Icon')).toBeInTheDocument();

        rerender(<DesktopIcon {...defaultProps} iconType="projects" />);
        expect(screen.getByText('Test Icon')).toBeInTheDocument();

        rerender(<DesktopIcon {...defaultProps} iconType="contact" />);
        expect(screen.getByText('Test Icon')).toBeInTheDocument();

        rerender(<DesktopIcon {...defaultProps} iconType="drive" />);
        expect(screen.getByText('Test Icon')).toBeInTheDocument();
    });
});
