import { render, screen } from '@testing-library/react';
import { Section } from '../../../components/ui/Section';

describe('Section', () => {
    it('renders children correctly', () => {
        render(<Section>Test Content</Section>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with container by default', () => {
        const { container } = render(<Section>Test Content</Section>);
        expect(container.querySelector('.container')).toBeInTheDocument();
    });

    it('renders without container when specified', () => {
        const { container } = render(<Section container={false}>Test Content</Section>);
        expect(container.querySelector('.container')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<Section className="custom-class">Test Content</Section>);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
