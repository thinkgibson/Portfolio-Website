import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { HomeClient } from '@/components/HomeClient'

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
    bodyHtml: '<p>Body</p>'
}

describe('Home Page', () => {
    it('renders a heading', async () => {
        render(<HomeClient content={mockContent} />)

        const heading = await screen.findByRole('heading', { level: 1 })

        expect(heading).toBeInTheDocument()
    })
})
