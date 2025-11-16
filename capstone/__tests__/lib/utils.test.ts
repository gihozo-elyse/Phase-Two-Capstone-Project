import { slugify, formatDate, generateExcerpt } from '@/lib/utils'

describe('utils', () => {
  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test 123!')).toBe('test-123')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })
  })

  describe('generateExcerpt', () => {
    it('generates excerpt from content', () => {
      const content = 'This is a very long piece of content that should be truncated to create an excerpt for the post preview.'
      const excerpt = generateExcerpt(content, 50)
      expect(excerpt.length).toBeLessThanOrEqual(53) // 50 + '...'
      expect(excerpt).toContain('...')
    })

    it('returns full content if shorter than length', () => {
      const content = 'Short content'
      const excerpt = generateExcerpt(content, 50)
      expect(excerpt).toBe(content)
    })
  })
})

