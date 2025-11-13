import {
  generateReactComponent,
  generateTailwindClasses,
  generatePlainCSS,
} from '../generators'
import type { DesignSpec } from '@/lib/claude/client'

const mockDesign: DesignSpec = {
  layout: 'flex-col',
  components: [
    {
      type: 'card',
      props: {},
      styles: {
        className: 'bg-blue-500 p-4 rounded',
      },
    },
    {
      type: 'button',
      props: {},
      styles: {
        className: 'bg-green-500 text-white px-4 py-2',
      },
    },
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
    },
    spacing: {
      sm: '8px',
      md: '16px',
    },
    typography: {
      base: '16px',
      heading: '24px',
    },
  },
}

describe('Code Generators', () => {
  describe('generateReactComponent', () => {
    it('generates valid React component code', () => {
      const code = generateReactComponent(mockDesign)

      expect(code).toContain('export function GeneratedDesign')
      expect(code).toContain('return (')
      expect(code).toContain('</div>')
    })

    it('includes layout className', () => {
      const code = generateReactComponent(mockDesign)

      expect(code).toContain('flex flex-col gap-4')
    })

    it('includes theme colors as CSS variables', () => {
      const code = generateReactComponent(mockDesign)

      expect(code).toContain("'--color-primary': '#3b82f6'")
      expect(code).toContain("'--color-secondary': '#10b981'")
    })

    it('generates card component markup', () => {
      const code = generateReactComponent(mockDesign)

      expect(code).toContain('bg-blue-500 p-4 rounded')
      expect(code).toContain('space-y-2')
    })

    it('generates button component markup', () => {
      const code = generateReactComponent(mockDesign)

      expect(code).toContain('<button')
      expect(code).toContain('bg-green-500 text-white px-4 py-2')
    })

    it('handles grid layout', () => {
      const gridDesign: DesignSpec = {
        ...mockDesign,
        layout: 'grid',
      }

      const code = generateReactComponent(gridDesign)
      expect(code).toContain('grid grid-cols-3 gap-4')
    })
  })

  describe('generateTailwindClasses', () => {
    it('generates Tailwind class list', () => {
      const classes = generateTailwindClasses(mockDesign)

      expect(classes).toContain('/* Layout */')
      expect(classes).toContain('flex flex-col gap-4')
      expect(classes).toContain('/* Components */')
    })

    it('includes component classes', () => {
      const classes = generateTailwindClasses(mockDesign)

      expect(classes).toContain('bg-blue-500 p-4 rounded')
      expect(classes).toContain('bg-green-500 text-white px-4 py-2')
    })

    it('labels each component', () => {
      const classes = generateTailwindClasses(mockDesign)

      expect(classes).toContain('Component 1 (card)')
      expect(classes).toContain('Component 2 (button)')
    })
  })

  describe('generatePlainCSS', () => {
    it('generates valid CSS', () => {
      const css = generatePlainCSS(mockDesign)

      expect(css).toContain('.design-container {')
      expect(css).toContain('display: flex;')
      expect(css).toContain('flex-direction: column;')
      expect(css).toContain('}')
    })

    it('includes CSS custom properties for colors', () => {
      const css = generatePlainCSS(mockDesign)

      expect(css).toContain('--color-primary: #3b82f6;')
      expect(css).toContain('--color-secondary: #10b981;')
    })

    it('generates component-specific CSS', () => {
      const css = generatePlainCSS(mockDesign)

      expect(css).toContain('.component-1 {')
      expect(css).toContain('.component-2 {')
    })

    it('converts Tailwind background colors to CSS', () => {
      const css = generatePlainCSS(mockDesign)

      expect(css).toContain('background-color: #3b82f6;')
      expect(css).toContain('background-color: #10b981;')
    })

    it('converts Tailwind padding to CSS', () => {
      const css = generatePlainCSS(mockDesign)

      expect(css).toContain('padding: 1rem;')
    })

    it('handles grid layout', () => {
      const gridDesign: DesignSpec = {
        ...mockDesign,
        layout: 'grid',
      }

      const css = generatePlainCSS(gridDesign)
      expect(css).toContain('display: grid;')
      expect(css).toContain('grid-template-columns: repeat(3, 1fr);')
    })
  })
})
