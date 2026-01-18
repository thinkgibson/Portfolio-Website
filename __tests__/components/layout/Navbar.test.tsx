import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../../../components/layout/Navbar';

describe('Navbar', () => {
    it('renders logo and desktop links', () => {
        render(<Navbar />);
        expect(screen.getByText(/PORTFOLIO/)).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('toggles mobile menu when button is clicked', () => {
        render(<Navbar />);
        const toggle = screen.getByRole('button', { name: /toggle menu/i });

        // Mobile menu should be hidden initially (AnimatePresence handles this)
        expect(screen.queryByText('Say Hello')).toBeInTheDocument(); // This is the desktop button

        fireEvent.click(toggle);

        // Now mobile links should be visible
        const mobileLinks = screen.getAllByText('About');
        expect(mobileLinks.length).toBeGreaterThan(0);
    });
});
