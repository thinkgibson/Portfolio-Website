import React from 'react';
import { render, screen } from '@testing-library/react';
import { Notepad } from './Notepad';
import '@testing-library/jest-dom';

// Mock OSContext
jest.mock('./OSContext', () => ({
    useOS: () => ({
        registerCloseInterceptor: jest.fn(),
        unregisterCloseInterceptor: jest.fn(),
        registerSaveHandler: jest.fn(),
        unregisterSaveHandler: jest.fn(),
    }),
}));

describe('Notepad', () => {
    it('renders without crashing', () => {
        render(<Notepad />);
        expect(screen.getByTestId('notepad-editor')).toBeInTheDocument();
        expect(screen.getByTestId('notepad-status-label')).toBeInTheDocument();
        expect(screen.getByTestId('notepad-save')).toBeInTheDocument();

        // Check for specific text content
        expect(screen.getByText('Rich Text Mode')).toBeInTheDocument();
    });
});
