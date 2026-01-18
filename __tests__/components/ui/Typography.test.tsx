import { render, screen } from '@testing-library/react';
import { H1, H2, H3, P } from '../../../components/ui/Typography';

describe('Typography', () => {
    describe('H1', () => {
        it('renders text as h1 by default', () => {
            render(<H1>Title</H1>);
            const element = screen.getByRole('heading', { level: 1 });
            expect(element).toBeInTheDocument();
            expect(element.tagName).toBe('H1');
        });

        it('renders as different component if specified', () => {
            render(<H1 as="h2">Title</H1>);
            const element = screen.getByRole('heading', { level: 2 });
            expect(element).toBeInTheDocument();
            expect(element.tagName).toBe('H2');
        });
    });

    describe('H2', () => {
        it('renders text as h2 by default', () => {
            render(<H2>Subtitle</H2>);
            const element = screen.getByRole('heading', { level: 2 });
            expect(element).toBeInTheDocument();
        });
    });

    describe('H3', () => {
        it('renders text as h3 by default', () => {
            render(<H3>Small Title</H3>);
            const element = screen.getByRole('heading', { level: 3 });
            expect(element).toBeInTheDocument();
        });
    });

    describe('P', () => {
        it('renders text as paragraph', () => {
            render(<P>Some text</P>);
            const element = screen.getByText('Some text');
            expect(element.tagName).toBe('P');
        });
    });
});
