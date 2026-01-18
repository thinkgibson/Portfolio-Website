import React from 'react';
import { render } from '@testing-library/react';
import * as Icons from '../../../components/win95/icons';
import '@testing-library/jest-dom';

describe('Win95 Icons', () => {
    const iconList = Object.entries(Icons).filter(([name]) => name.endsWith('Icon'));

    test.each(iconList)('renders %s correctly', (name, Component: any) => {
        const { container } = render(<Component />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('applies custom size to icons', () => {
        const { container } = render(<Icons.FolderIcon size={48} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
    });

    it('passes additional props to the svg element', () => {
        const { container } = render(<Icons.FolderIcon data-testid="custom-icon" className="custom-class" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('data-testid', 'custom-icon');
        expect(svg).toHaveClass('custom-class');
    });
});
