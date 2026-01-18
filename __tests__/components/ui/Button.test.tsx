import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
    // Happy Path
    it('should render children correctly', () => {
        render(<Button>Click Me</Button>)
        expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('should render with default props', () => {
        render(<Button>Default</Button>)
        const button = screen.getByRole('button', { name: /default/i })
        // Default is primary (bg-bauhaus-red) and square (rounded-none)
        expect(button).toHaveClass('bg-bauhaus-red')
        expect(button).toHaveClass('rounded-none')
    })

    // Variants
    it('should render primary variant classes', () => {
        render(<Button variant="primary">Primary</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-bauhaus-red')
    })

    it('should render secondary variant classes', () => {
        render(<Button variant="secondary">Secondary</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-bauhaus-blue')
    })

    it('should render accent variant classes', () => {
        render(<Button variant="accent">Accent</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-bauhaus-yellow')
    })

    it('should render outline variant classes', () => {
        render(<Button variant="outline">Outline</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-transparent')
    })

    // Shapes
    it('should render square shape classes', () => {
        render(<Button shape="square">Square</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('rounded-none')
    })

    it('should render pill shape classes', () => {
        render(<Button shape="pill">Pill</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('rounded-full')
    })

    // Interaction & Attributes
    it('should call onClick handler when clicked', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Clickable</Button>)
        fireEvent.click(screen.getByText('Clickable'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('should have correct type attribute', () => {
        render(<Button type="submit">Submit</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('type', 'submit')
    })

    it('should pass through additional classNames', () => {
        render(<Button className="custom-class">Custom</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('custom-class')
    })
})
