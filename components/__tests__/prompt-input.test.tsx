import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptInput } from '../prompt-input'

describe('PromptInput', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders textarea and submit button', () => {
    render(<PromptInput onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/describe your design/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate design/i })).toBeInTheDocument()
  })

  it('shows character count', () => {
    render(<PromptInput onSubmit={mockOnSubmit} maxLength={500} />)

    expect(screen.getByText('500 characters remaining')).toBeInTheDocument()
  })

  it('updates character count as user types', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={mockOnSubmit} maxLength={500} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, 'test design')

    expect(screen.getByText('489 characters remaining')).toBeInTheDocument()
  })

  it('disables submit when textarea is empty', () => {
    render(<PromptInput onSubmit={mockOnSubmit} />)

    const button = screen.getByRole('button', { name: /generate design/i })
    expect(button).toBeDisabled()
  })

  it('enables submit when textarea has content', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={mockOnSubmit} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, 'gradient card')

    const button = screen.getByRole('button', { name: /generate design/i })
    expect(button).not.toBeDisabled()
  })

  it('calls onSubmit with trimmed prompt', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue(undefined)
    render(<PromptInput onSubmit={mockOnSubmit} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, '  gradient card  ')

    const button = screen.getByRole('button', { name: /generate design/i })
    await user.click(button)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('gradient card')
    })
  })

  it('shows error when prompt is empty on submit', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={mockOnSubmit} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, '   ')

    const button = screen.getByRole('button', { name: /generate design/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/please enter a design description/i)).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows error when prompt exceeds max length', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={mockOnSubmit} maxLength={10} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, 'this is a very long prompt')

    const button = screen.getByRole('button', { name: /generate design/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/must be 10 characters or less/i)).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows loading state during submission', () => {
    render(<PromptInput onSubmit={mockOnSubmit} isLoading={true} />)

    expect(screen.getByText(/generating design.../i)).toBeInTheDocument()
    expect(screen.getByLabelText(/describe your design/i)).toBeDisabled()
  })

  it('handles submission errors', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockRejectedValue(new Error('API error'))
    render(<PromptInput onSubmit={mockOnSubmit} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, 'test design')

    const button = screen.getByRole('button', { name: /generate design/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument()
    })
  })

  it('highlights character count in red when below 50 characters', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={mockOnSubmit} maxLength={100} />)

    const textarea = screen.getByLabelText(/describe your design/i)
    await user.type(textarea, 'a'.repeat(55))

    const charCount = screen.getByText('45 characters remaining')
    expect(charCount).toHaveClass('text-destructive')
  })
})
