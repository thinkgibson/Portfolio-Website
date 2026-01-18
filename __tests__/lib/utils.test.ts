import { cn } from '@/lib/utils'

describe('cn utility', () => {
    // Happy Path
    it('should merge Tailwind classes correctly', () => {
        const result = cn('text-red-500', 'text-blue-500')
        expect(result).toBe('text-blue-500')
    })

    it('should combine conditional classes', () => {
        const result = cn('base-class', true && 'active-class', false && 'inactive-class')
        expect(result).toBe('base-class active-class')
    })

    // Edge Cases
    it('should handle empty inputs', () => {
        expect(cn()).toBe('')
    })

    it('should handle undefined/null/false values', () => {
        expect(cn('start', undefined, null, false, 'end')).toBe('start end')
    })

    it('should handle array inputs', () => {
        expect(cn(['foo', 'bar'])).toBe('foo bar')
    })
})
