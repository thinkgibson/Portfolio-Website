import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { HomeClient } from '../components/HomeClient'
import { BootSequence } from '../components/win95/BootSequence'

jest.mock('../components/win95/BootSequence', () => ({
    BootSequence: ({ onComplete }: any) => {
        // Immediate completion in tests to avoid animation issues
        React.useEffect(() => {
            onComplete();
        }, [onComplete]);
        return null;
    }
}))

const mockContent = {
    hero: {
        titleHtml: 'Hero',
        subtitle: 'Sub',
        buttonPrimary: 'Btn1',
        buttonSecondary: 'Btn2'
    },
    about: {
        title: 'About',
        techStackTitle: 'Tech Stack'
    },
    projects: [] as any[],
    skills: [] as string[],
    contact: {
        title: 'Contact',
        description: 'Desc',
        buttonText: 'Btn',
        email: 'test@test.com'
    },
    bodyHtml: '<p>Body</p>',
    jobHistory: { jobs: [] },
    skillsData: { categories: [] },
    videoData: {
        documentaries: [],
        livestreams: [],
        essays: []
    },
    bootContent: []
}

describe('Home Page', () => {
    it('renders a heading', async () => {
        render(<HomeClient content={mockContent} />)

        const heading = await screen.findByRole('heading', { level: 1 })

        expect(heading).toBeInTheDocument()
    })
})
