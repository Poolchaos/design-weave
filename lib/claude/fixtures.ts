export const mockDesignResponse = {
  id: 'msg_test123',
  type: 'message' as const,
  role: 'assistant' as const,
  content: [
    {
      type: 'text' as const,
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
          {
            type: 'div',
            props: {},
            styles: {
              className: 'grid grid-cols-3 gap-4 mt-4',
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
  stop_reason: 'end_turn' as const,
  stop_sequence: null,
  usage: {
    input_tokens: 150,
    output_tokens: 200,
  },
}

export const mockInsufficientInputResponse = {
  ...mockDesignResponse,
  content: [
    {
      type: 'text' as const,
      text: '[NEEDS_INPUT] Please provide more specific details about the design you want to create.',
    },
  ],
}
