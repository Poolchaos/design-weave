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
const mockWriteText = jest.fn(() => Promise.resolve())
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

describe('ExportModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockWriteText.mockClear()
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

  it('displays copy and download buttons in modal', async () => {
    const user = userEvent.setup()
    render(<ExportModal design={mockDesign} />)

    // Open modal
    await user.click(screen.getByRole('button', { name: /export code/i }))

    // Wait for modal content and verify action buttons exist
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const copyButton = buttons.find(btn => btn.textContent?.includes('Copy'))
      const downloadButton = buttons.find(btn => btn.textContent?.includes('Download'))

      expect(copyButton).toBeInTheDocument()
      expect(downloadButton).toBeInTheDocument()
    })
  })
})
