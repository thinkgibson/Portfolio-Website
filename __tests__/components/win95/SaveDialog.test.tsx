import { render, screen, fireEvent } from '@testing-library/react';
import { SaveDialog } from '../../../components/win95/SaveDialog';

describe('SaveDialog', () => {
    const defaultProps = {
        onSave: jest.fn(),
        onCancel: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default filename', () => {
        render(<SaveDialog {...defaultProps} />);
        const input = screen.getByDisplayValue('document') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('document');
    });

    it('renders with custom default filename', () => {
        render(<SaveDialog {...defaultProps} defaultFilename="my_work" />);
        const input = screen.getByDisplayValue('my_work') as HTMLInputElement;
        expect(input).toBeInTheDocument();
    });

    it('updates filename on input change', () => {
        render(<SaveDialog {...defaultProps} />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'new_filename' } });
        expect(input.value).toBe('new_filename');
    });

    it('calls onSave with trimmed filename when Save button is clicked', () => {
        render(<SaveDialog {...defaultProps} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '  trimmed_file  ' } });
        
        const saveButton = screen.getByText('Download');
        fireEvent.click(saveButton);
        
        expect(defaultProps.onSave).toHaveBeenCalledWith('trimmed_file');
    });

    it('calls onSave when Enter key is pressed', () => {
        render(<SaveDialog {...defaultProps} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'enter_file' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        
        expect(defaultProps.onSave).toHaveBeenCalledWith('enter_file');
    });

    it('does not call onSave if filename is empty or only whitespace', () => {
        render(<SaveDialog {...defaultProps} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '   ' } });
        
        const saveButton = screen.getByText('Download');
        fireEvent.click(saveButton);
        
        expect(defaultProps.onSave).not.toHaveBeenCalled();
    });

    it('calls onCancel when Cancel button is clicked', () => {
        render(<SaveDialog {...defaultProps} />);
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('calls onCancel when X button is clicked', () => {
        render(<SaveDialog {...defaultProps} />);
        const xButton = screen.getByRole('button', { name: '' }); // The X button has no text but contains the Lucide X icon
        // More robust way to find X button: it's in the title bar next to "Save As"
        const closeButton = screen.getAllByRole('button')[0]; 
        fireEvent.click(closeButton);
        
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('calls onCancel when Escape key is pressed', () => {
        render(<SaveDialog {...defaultProps} />);
        const input = screen.getByRole('textbox');
        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
        
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });
});
