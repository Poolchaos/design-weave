import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportModal } from '../export-modal'
import type { DesignSpec } from '@/lib/claude/client'

const mockDesign: DesignSpec = {
  layout: 'flex-col',
  components: [
    {
      type: 'card',
      props: {},
      styles: {
        className: 'bg-blue-500 p-4',
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

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

describe('ExportModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when design is null', () => {
    const { container } = render(<ExportModal design={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders export button when design exists', () => {
    render(<ExportModal design={mockDesign} />)
    expect(screen.getByRole('button', { name: /export code/i })).toBeInTheDocument()
  })

  it('opens modal when export button clicked', async () => {
    const user = userEvent.setup()
    render(<ExportModal design={mockDesign} />)

    const button = screen.getByRole('button', { name: /export code/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/choose your preferred format/i)).toBeInTheDocument()
    })
  })

  it('displays React component code by default', async () => {
    const user = userEvent.setup()
    render(<ExportModal design={mockDesign} />)

    const button = screen.getByRole('button', { name: /export code/i })
    await user.click(button)

    await waitFor(() => {
      const code = screen.getByRole('code')
      expect(code.textContent).toContain('export function GeneratedDesign')
    })
  })

  it('copies code to clipboard', async () => {
    const user = userEvent.setup()
    render(<ExportModal design={mockDesign} />)

    await user.click(screen.getByRole('button', { name: /export code/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
    })

    const copyButton = screen.getByRole('button', { name: /^copy$/i })
    await user.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
      expect(screen.getByText(/copied!/i)).toBeInTheDocument()
    })
  })

  it('shows copied state temporarily', async () => {
    const user = userEvent.setup()
    jest.useFakeTimers()
    render(<ExportModal design={mockDesign} />)

    await user.click(screen.getByRole('button', { name: /export code/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
    })

    const copyButton = screen.getByRole('button', { name: /^copy$/i })
    await user.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument()
    })

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(screen.queryByText(/copied!/i)).not.toBeInTheDocument()
    })

    jest.useRealTimers()
  })

  it('triggers download with correct filename', async () => {
    const user = userEvent.setup()
    const createElementSpy = jest.spyOn(document, 'createElement')
    const appendChildSpy = jest.spyOn(document.body, 'appendChild')
    const removeChildSpy = jest.spyOn(document.body, 'removeChild')

    render(<ExportModal design={mockDesign} />)

    await user.click(screen.getByRole('button', { name: /export code/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^download$/i })).toBeInTheDocument()
    })

    const downloadButton = screen.getByRole('button', { name: /^download$/i })
    await user.click(downloadButton)

    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalled()
    })

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})
