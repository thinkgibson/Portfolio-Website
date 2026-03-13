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

        const forestOption = screen.getByTestId('wallpaper-option-forest');
        fireEvent.click(forestOption);

        // Check if Apply button calls onApply with forest wallpaper
        fireEvent.click(screen.getByTestId('wallpaper-apply'));
        expect(mockOnApply).toHaveBeenCalledWith(WALLPAPERS.find(w => w.id === 'forest'));
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
                currentWallpaperId="forest"
                onApply={mockOnApply}
                onCancel={mockOnCancel}
            />
        );

        // Applying without changing should return "forest"
        fireEvent.click(screen.getByTestId('wallpaper-apply'));
        expect(mockOnApply).toHaveBeenCalledWith(WALLPAPERS.find(w => w.id === 'forest'));
    });

    it('calls onPreview when a wallpaper is clicked', () => {
        const mockOnPreview = jest.fn();
        render(
            <WallpaperSelector
                currentWallpaperId="teal"
                onApply={mockOnApply}
                onCancel={mockOnCancel}
                onPreview={mockOnPreview}
            />
        );

        const forestOption = screen.getByTestId('wallpaper-option-forest');
        fireEvent.click(forestOption);

        expect(mockOnPreview).toHaveBeenCalledWith(WALLPAPERS.find(w => w.id === 'forest'));
    });
});
