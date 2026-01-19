import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WallpaperSelector, WALLPAPERS } from '../../../components/win95/WallpaperSelector';
import '@testing-library/jest-dom';

describe('WallpaperSelector', () => {
    const mockOnApply = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all wallpaper options', () => {
        render(
            <WallpaperSelector
                currentWallpaperId="teal"
                onApply={mockOnApply}
                onCancel={mockOnCancel}
            />
        );

        WALLPAPERS.forEach(wp => {
            expect(screen.getByText(wp.name)).toBeInTheDocument();
        });
    });

    it('selects a wallpaper on click', () => {
        render(
            <WallpaperSelector
                currentWallpaperId="teal"
                onApply={mockOnApply}
                onCancel={mockOnCancel}
            />
        );

        const cloudsOption = screen.getByTestId('wallpaper-option-clouds');
        fireEvent.click(cloudsOption);

        // Check if Apply button calls onApply with clouds wallpaper
        fireEvent.click(screen.getByTestId('wallpaper-apply'));
        expect(mockOnApply).toHaveBeenCalledWith(WALLPAPERS.find(w => w.id === 'clouds'));
    });

    it('calls onCancel when Cancel button is clicked', () => {
        render(
            <WallpaperSelector
                currentWallpaperId="teal"
                onApply={mockOnApply}
                onCancel={mockOnCancel}
            />
        );

        fireEvent.click(screen.getByTestId('wallpaper-cancel'));
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('pre-selects current wallpaper', () => {
        render(
            <WallpaperSelector
                currentWallpaperId="clouds"
                onApply={mockOnApply}
                onCancel={mockOnCancel}
            />
        );

        // Applying without changing should return "clouds"
        fireEvent.click(screen.getByTestId('wallpaper-apply'));
        expect(mockOnApply).toHaveBeenCalledWith(WALLPAPERS.find(w => w.id === 'clouds'));
    });
});
