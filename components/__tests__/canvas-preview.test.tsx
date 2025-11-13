import { render, screen } from '@testing-library/react'
import { CanvasPreview } from '../canvas-preview'
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
        className: 'bg-green-500 text-white',
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

describe('CanvasPreview', () => {
  it('shows placeholder when no design provided', () => {
    render(<CanvasPreview design={null} />)

    expect(
      screen.getByText(/your design will appear here/i)
    ).toBeInTheDocument()
  })

  it('renders design components', () => {
    render(<CanvasPreview design={mockDesign} />)

    const components = screen.getAllByTestId(
      (content, element) =>
        element?.getAttribute('data-component-type') !== null
    )

    expect(components.length).toBe(2)
  })

  it('applies flex-col layout', () => {
    render(<CanvasPreview design={mockDesign} />)

    const container = screen.getByTestId(
      (content, element) =>
        element?.className.includes('flex-col') || false
    )

    expect(container).toBeInTheDocument()
  })

  it('applies flex-row layout', () => {
    const rowDesign: DesignSpec = {
      ...mockDesign,
      layout: 'flex-row',
    }

    render(<CanvasPreview design={rowDesign} />)

    const container = screen.getByTestId(
      (content, element) =>
        element?.className.includes('flex-row') || false
    )

    expect(container).toBeInTheDocument()
  })

  it('applies grid layout', () => {
    const gridDesign: DesignSpec = {
      ...mockDesign,
      layout: 'grid',
    }

    render(<CanvasPreview design={gridDesign} />)

    const container = screen.getByTestId(
      (content, element) => element?.className.includes('grid') || false
    )

    expect(container).toBeInTheDocument()
  })

  it('applies component styles', () => {
    render(<CanvasPreview design={mockDesign} />)

    const cardComponent = screen.getByTestId(
      (content, element) =>
        element?.getAttribute('data-component-type') === 'card'
    )

    expect(cardComponent).toHaveClass('bg-blue-500', 'p-4', 'rounded')
  })

  it('renders card component placeholder content', () => {
    render(<CanvasPreview design={mockDesign} />)

    const cardComponent = screen.getByTestId(
      (content, element) =>
        element?.getAttribute('data-component-type') === 'card'
    )

    expect(cardComponent.querySelector('.space-y-2')).toBeInTheDocument()
  })

  it('renders button component', () => {
    render(<CanvasPreview design={mockDesign} />)

    const buttonElement = screen.getByRole('button', { name: /button/i })
    expect(buttonElement).toBeInTheDocument()
    expect(buttonElement).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <CanvasPreview design={mockDesign} className="custom-class" />
    )

    const previewContainer = container.firstChild as HTMLElement
    expect(previewContainer).toHaveClass('custom-class')
  })

  it('sets CSS custom properties for theme colors', () => {
    const { container } = render(<CanvasPreview design={mockDesign} />)

    const designContainer = container.querySelector(
      '[style*="--color-primary"]'
    )
    expect(designContainer).toBeInTheDocument()
  })
})
