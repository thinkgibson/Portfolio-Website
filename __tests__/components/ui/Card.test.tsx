import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/Card'

describe('Card Component', () => {
    // Happy Path
    it('should render children', () => {
        render(<Card>Card Content</Card>)
        expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    // Decorations
    it('should render no decoration by default', () => {
        const { container } = render(<Card>No Decoration</Card>)
        // Look for absolute positioned elements which act as decorations
        // The basic card has specific border classes, we want to ensure no extra decorative divs
        // Since decorations are div.absolute.top-4.right-4, we can query by that if possible,
        // or easier: inspect the container's HTML structure via snapshot or query
        const decoration = container.querySelector('.absolute.top-4.right-4')
        expect(decoration).not.toBeInTheDocument()
    })

    it('should render circle decoration', () => {
        const { container } = render(<Card decoration="circle">Circle</Card>)
        const decoration = container.querySelector('.rounded-full.bg-bauhaus-red')
        expect(decoration).toBeInTheDocument()
    })

    it('should render square decoration', () => {
        const { container } = render(<Card decoration="square">Square</Card>)
        const decoration = container.querySelector('.bg-bauhaus-blue')
        expect(decoration).toBeInTheDocument()
    })

    it('should render triangle decoration', () => {
        const { container } = render(<Card decoration="triangle">Triangle</Card>)
        // Triangles are made with complex borders
        const decoration = container.querySelector('.border-b-bauhaus-yellow')
        expect(decoration).toBeInTheDocument()
    })

    // Edge Cases
    it('should merge custom classes with default classes', () => {
        render(<Card className="my-custom-class">Custom Class</Card>)
        // The card is a div, so we can get it by text and check parent or direct
        // Card component spreads props to the div
        const cardDiv = screen.getByText('Custom Class')
        expect(cardDiv).toHaveClass('my-custom-class')
        // Also check a default class exists
        expect(cardDiv).toHaveClass('bg-white')
    })
})
