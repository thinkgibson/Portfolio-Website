import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Notepad } from '../../../components/win95/Notepad';
import { OSProvider } from '../../../components/win95/OSContext';
import '@testing-library/jest-dom';

describe('Notepad Component', () => {
    const renderWithOS = (ui: React.ReactElement) => {
        return render(<OSProvider>{ui}</OSProvider>);
    };

    // Mock document.execCommand and queryCommandState
    const originalExecCommand = document.execCommand;
    const originalQueryCommandState = document.queryCommandState;
    const originalRAF = window.requestAnimationFrame;

    // Track command states for mocking
    let commandStates: { bold: boolean; italic: boolean; underline: boolean };

    beforeAll(() => {
        // Initialize command states
        commandStates = { bold: false, italic: false, underline: false };

        // Mock execCommand to toggle the state
        document.execCommand = jest.fn((command: string) => {
            if (command === 'bold') commandStates.bold = !commandStates.bold;
            if (command === 'italic') commandStates.italic = !commandStates.italic;
            if (command === 'underline') commandStates.underline = !commandStates.underline;
            return true;
        });

        // Mock queryCommandState to return tracked state
        document.queryCommandState = jest.fn((command: string) => {
            if (command === 'bold') return commandStates.bold;
            if (command === 'italic') return commandStates.italic;
            if (command === 'underline') return commandStates.underline;
            return false;
        });

        // Mock requestAnimationFrame to run synchronously
        window.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
            callback(0);
            return 0;
        });
    });

    beforeEach(() => {
        // Reset command states before each test
        commandStates = { bold: false, italic: false, underline: false };
        jest.clearAllMocks();
    });

    afterAll(() => {
        document.execCommand = originalExecCommand;
        document.queryCommandState = originalQueryCommandState;
        window.requestAnimationFrame = originalRAF;
    });

    it('renders the toolbar and editor', () => {
        renderWithOS(<Notepad />);
        expect(screen.getByTestId('notepad-bold')).toBeInTheDocument();
        expect(screen.getByTestId('notepad-italic')).toBeInTheDocument();
        expect(screen.getByTestId('notepad-underline')).toBeInTheDocument();
        expect(screen.getByTestId('notepad-editor')).toBeInTheDocument();
    });

    it('toggles bold when Bold button is clicked', () => {
        renderWithOS(<Notepad />);
        const boldButton = screen.getByTestId('notepad-bold');
        fireEvent.mouseDown(boldButton);
        expect(document.execCommand).toHaveBeenCalledWith('bold', false);
    });

    it('toggles italic when Italic button is clicked', () => {
        renderWithOS(<Notepad />);
        const italicButton = screen.getByTestId('notepad-italic');
        fireEvent.mouseDown(italicButton);
        expect(document.execCommand).toHaveBeenCalledWith('italic', false);
    });

    it('toggles underline when Underline button is clicked', () => {
        renderWithOS(<Notepad />);
        const underlineButton = screen.getByTestId('notepad-underline');
        fireEvent.mouseDown(underlineButton);
        expect(document.execCommand).toHaveBeenCalledWith('underline', false);
    });

    it('renders the save button', () => {
        renderWithOS(<Notepad />);
        expect(screen.getByTitle('Save')).toBeInTheDocument();
    });

    it('shows "Modified" status when text is typed', () => {
        renderWithOS(<Notepad />);
        const editor = screen.getByTestId('notepad-editor');
        fireEvent.input(editor, { target: { innerText: 'Some changes' } });
        expect(screen.getByText('Status: Modified')).toBeInTheDocument();
    });


    it('highlights the bold button when active', async () => {
        renderWithOS(<Notepad />);
        const boldButton = screen.getByTestId('notepad-bold');

        // Click the button to toggle it on
        await act(async () => {
            fireEvent.mouseDown(boldButton);
        });

        await waitFor(() => {
            expect(boldButton).toHaveClass('win95-beveled-inset');
        });
    });

    it('toggles bold button visual state back and forth', async () => {
        renderWithOS(<Notepad />);
        const boldButton = screen.getByTestId('notepad-bold');

        // Initially should be win95-button (off)
        expect(boldButton).toHaveClass('win95-button');

        // First click - should toggle on
        await act(async () => {
            fireEvent.mouseDown(boldButton);
        });
        await waitFor(() => {
            expect(boldButton).toHaveClass('win95-beveled-inset');
        });

        // Second click - should toggle off
        await act(async () => {
            fireEvent.mouseDown(boldButton);
        });
        await waitFor(() => {
            expect(boldButton).toHaveClass('win95-button');
        });

        // Third click - should toggle on again
        await act(async () => {
            fireEvent.mouseDown(boldButton);
        });
        await waitFor(() => {
            expect(boldButton).toHaveClass('win95-beveled-inset');
        });
    });

    it('toggles each button independently', async () => {
        renderWithOS(<Notepad />);
        const boldButton = screen.getByTestId('notepad-bold');
        const italicButton = screen.getByTestId('notepad-italic');
        const underlineButton = screen.getByTestId('notepad-underline');

        // Toggle bold on
        await act(async () => {
            fireEvent.mouseDown(boldButton);
        });
        await waitFor(() => {
            expect(boldButton).toHaveClass('win95-beveled-inset');
        });
        expect(italicButton).toHaveClass('win95-button');
        expect(underlineButton).toHaveClass('win95-button');

        // Toggle italic on
        await act(async () => {
            fireEvent.mouseDown(italicButton);
        });
        await waitFor(() => {
            expect(italicButton).toHaveClass('win95-beveled-inset');
        });
        expect(boldButton).toHaveClass('win95-beveled-inset');
        expect(underlineButton).toHaveClass('win95-button');

        // Toggle underline on
        await act(async () => {
            fireEvent.mouseDown(underlineButton);
        });
        await waitFor(() => {
            expect(underlineButton).toHaveClass('win95-beveled-inset');
        });
        expect(boldButton).toHaveClass('win95-beveled-inset');
        expect(italicButton).toHaveClass('win95-beveled-inset');
    });
});
