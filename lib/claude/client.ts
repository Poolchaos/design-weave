import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface DesignSpec {
  layout: string
  components: Array<{
    type: string
    props: Record<string, unknown>
    styles: Record<string, string>
  }>
  theme: {
    colors: Record<string, string>
    spacing: Record<string, string>
    typography: Record<string, string>
  }
}

export async function generateDesign(
  prompt: string
): Promise<DesignSpec> {
  const systemPrompt = `You are a UI design expert that converts natural language descriptions into structured design specifications.
  
Return a JSON object with this structure:
{
  "layout": "flex-col | grid | flex-row",
  "components": [
    {
      "type": "div | button | card | header",
      "props": {},
      "styles": {
        "className": "tailwind classes here"
      }
    }
  ],
  "theme": {
    "colors": {"primary": "#...", "secondary": "#..."},
    "spacing": {"sm": "8px", "md": "16px"},
    "typography": {"base": "16px", "heading": "24px"}
  }
}

Only return valid JSON, no markdown, no explanation.`

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    return JSON.parse(content.text) as DesignSpec
  } catch (error) {
    throw new Error(
      `Failed to parse Claude response: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
