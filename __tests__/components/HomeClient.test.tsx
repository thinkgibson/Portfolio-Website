import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomeClient } from '../../components/HomeClient';
import '@testing-library/jest-dom';

// Mock OSDesktop since we're testing HomeClient's definition of windows
jest.mock('../../components/win95/OSDesktop', () => ({
    OSDesktop: ({ windows }: any) => (
        <div data-testid="mock-os-desktop">
            {windows.map((w: any) => (
                <div key={w.id} data-testid={`window-def-${w.id}`}>
                    {w.title}
                </div>
            ))}
        </div>
    )
}));

describe('HomeClient', () => {
    const mockContent = {
        hero: {
            titleHtml: 'Test Hero',
            subtitle: 'Test Subtitle',
            buttonPrimary: 'Btn1',
            buttonSecondary: 'Btn2',
        },
        about: {
            title: 'About Title',
            techStackTitle: 'Tech Stack',
        },
        projects: [
            {
                id: 'p1',
                title: 'Project 1',
                category: 'Cat',
                description: 'Desc',
                technologies: ['React'],
                color: 'blue' as const,
            }
        ],
        skills: ['JavaScript'],
        contact: {
            title: 'Contact Title',
            description: 'Contact Desc',
            buttonText: 'Email Me',
            email: 'test@example.com',
        },
        bodyHtml: '<p>About body</p>',
        jobHistory: { jobs: [] },
        skillsData: { categories: [] },
        videoData: {
            documentaries: [],
            livestreams: []
        },
    };

    it('renders OSDesktop with correct window definitions', () => {
        render(<HomeClient content={mockContent as any} />);

        expect(screen.getByTestId('mock-os-desktop')).toBeInTheDocument();
        expect(screen.getByTestId('window-def-welcome')).toBeInTheDocument();
        expect(screen.getByTestId('window-def-about')).toBeInTheDocument();
        expect(screen.getByTestId('window-def-projects')).toBeInTheDocument();
        expect(screen.getByTestId('window-def-contact')).toBeInTheDocument();
        expect(screen.getByTestId('window-def-portfolio')).toBeInTheDocument();
    });
});
