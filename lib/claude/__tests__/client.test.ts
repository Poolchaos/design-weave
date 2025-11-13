import { generateDesign } from '../client'

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  const mockResponse = {
    id: 'msg_test123',
    type: 'message',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          layout: 'flex-col',
          components: [
            {
              type: 'card',
              props: {},
              styles: {
                className:
                  'bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg',
              },
            },
          ],
          theme: {
            colors: {
              primary: '#3b82f6',
              secondary: '#8b5cf6',
            },
            spacing: {
              sm: '8px',
              md: '16px',
              lg: '24px',
            },
            typography: {
              base: '16px',
              heading: '24px',
            },
          },
        }),
      },
    ],
    model: 'claude-3-5-sonnet-20241022',
    stop_reason: 'end_turn',
    stop_sequence: null,
    usage: {
      input_tokens: 150,
      output_tokens: 200,
    },
  }

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue(mockResponse),
      },
    })),
  }
})

describe('Claude Client', () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generateDesign', () => {
    it('should generate design spec from prompt', async () => {
      const prompt = 'gradient card with glassmorphism, 3 columns, shadows'
      const result = await generateDesign(prompt)

      expect(result).toHaveProperty('layout')
      expect(result).toHaveProperty('components')
      expect(result).toHaveProperty('theme')
      expect(Array.isArray(result.components)).toBe(true)
    })

    it('should parse JSON response correctly', async () => {
      const prompt = 'simple button with primary color'
      const result = await generateDesign(prompt)

      expect(result.theme.colors).toHaveProperty('primary')
      expect(result.components.length).toBeGreaterThan(0)
    })

    it('should return proper theme structure', async () => {
      const prompt = 'test design'
      const result = await generateDesign(prompt)

      expect(result.theme).toHaveProperty('colors')
      expect(result.theme).toHaveProperty('spacing')
      expect(result.theme).toHaveProperty('typography')
    })
  })
})
