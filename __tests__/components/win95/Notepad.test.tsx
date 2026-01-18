import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    beforeAll(() => {
        document.execCommand = jest.fn();
        document.queryCommandState = jest.fn().mockReturnValue(false);
    });
    afterAll(() => {
        document.execCommand = originalExecCommand;
        document.queryCommandState = originalQueryCommandState;
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
        expect(document.execCommand).toHaveBeenCalledWith('bold', false, undefined);
    });

    it('toggles italic when Italic button is clicked', () => {
        renderWithOS(<Notepad />);
        const italicButton = screen.getByTestId('notepad-italic');
        fireEvent.mouseDown(italicButton);
        expect(document.execCommand).toHaveBeenCalledWith('italic', false, undefined);
    });

    it('toggles underline when Underline button is clicked', () => {
        renderWithOS(<Notepad />);
        const underlineButton = screen.getByTestId('notepad-underline');
        fireEvent.mouseDown(underlineButton);
        expect(document.execCommand).toHaveBeenCalledWith('underline', false, undefined);
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


    it('highlights the bold button when active', () => {
        (document.queryCommandState as jest.Mock).mockReturnValueOnce(true);
        renderWithOS(<Notepad />);
        const boldButton = screen.getByTestId('notepad-bold');
        // We trigger selectionchange to update the state
        fireEvent(document, new Event('selectionchange'));
        expect(boldButton).toHaveClass('win95-beveled-inset');
    });
});
