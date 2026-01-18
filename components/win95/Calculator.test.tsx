import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from './Calculator';
import '@testing-library/jest-dom';

describe('Calculator', () => {
    it('renders the calculator with initial display 0', () => {
        render(<Calculator />);
        expect(screen.getByText('0', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('updates display when numbers are clicked', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('7'));
        fireEvent.click(screen.getByText('8'));
        expect(screen.getByText('78', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('performs addition', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('1'));
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('3', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('performs subtraction', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('5'));
        fireEvent.click(screen.getByText('-'));
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('3', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('performs multiplication', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('3'));
        fireEvent.click(screen.getByText('*'));
        fireEvent.click(screen.getByText('4'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('12', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('performs division', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('8'));
        fireEvent.click(screen.getByText('/'));
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('4', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('clears the display', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('5'));
        fireEvent.click(screen.getByText('C'));
        expect(screen.getByText('0', { selector: '.bg-white' })).toBeInTheDocument();
    });

    it('chains operations', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText('3'));
        fireEvent.click(screen.getByText('*')); // Should calculate 2+3=5 then set op to *
        expect(screen.getByText('5', { selector: '.bg-white' })).toBeInTheDocument();
        fireEvent.click(screen.getByText('4'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('20', { selector: '.bg-white' })).toBeInTheDocument();
    });
});
