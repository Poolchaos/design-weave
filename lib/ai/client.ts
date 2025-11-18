import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export interface DesignSpec {
  layout: string
  components: Array<{
    type: string
    content?: string | Array<{ type: string; content: string; className?: string }>
    props: Record<string, unknown>
    styles: Record<string, string>
  }>
  theme: {
    colors: Record<string, string>
    spacing: Record<string, string>
    typography: Record<string, string>
  }
}

export type AIProvider = 'claude' | 'openai' | null

export function getAvailableProvider(): AIProvider {
  if (process.env.ANTHROPIC_API_KEY) {
    return 'claude'
  }
  if (process.env.OPENAI_API_KEY) {
    return 'openai'
  }
  return null
}

const SYSTEM_PROMPT = `You are a senior UI/UX designer and frontend architect specializing in modern web design.

Core Design Principles:
- Use professional color palettes with proper contrast (WCAG AA minimum)
- Apply consistent spacing using Tailwind's spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Create visual hierarchy with typography (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl)
- Add depth with shadows (shadow-sm, shadow, shadow-md, shadow-lg) and proper layering
- Use subtle animations and transitions for polish
- Ensure responsive design with proper padding and margins
- Apply modern design trends: rounded corners (rounded-lg, rounded-xl), gradients, glassmorphism when appropriate

Tailwind Best Practices:
- Use semantic color classes: bg-primary, bg-secondary, text-foreground, text-muted-foreground
- Combine hover states: hover:bg-primary/90, hover:shadow-lg, hover:scale-105
- Add transitions: transition-all, transition-colors, transition-transform
- Use flexbox/grid properly: flex, grid, items-center, justify-between, gap-4
- Apply proper spacing: p-4, px-6, py-3, space-y-2, gap-3
- Use border utilities: border, border-2, border-primary/20, rounded-lg

CRITICAL: Return ONLY a valid JSON object with this EXACT structure:
{
  "layout": "flex-col" | "grid" | "flex-row",
  "components": [
    {
      "type": "div" | "button" | "section" | "header",
      "content": "text content" OR [
        {"type": "div", "content": "text", "className": "tailwind classes"},
        {"type": "h3", "content": "Heading", "className": "text-lg font-bold"},
        {"type": "p", "content": "Description", "className": "text-sm text-muted-foreground"}
      ],
      "props": {},
      "styles": {
        "className": "comprehensive tailwind classes with all styling, spacing, colors, hover states"
      }
    }
  ],
  "theme": {
    "colors": {"primary": "#hex", "secondary": "#hex", "accent": "#hex"},
    "spacing": {"sm": "8px", "md": "16px", "lg": "24px"},
    "typography": {"base": "16px", "heading": "24px", "subheading": "18px"}
  }
}

STRICT REQUIREMENTS:
1. "content" field is MANDATORY for every component - either string OR array of child elements
2. If component has multiple elements (image, title, description), use array format with nested objects
3. Each nested element MUST have: type, content, className
4. For images use: {"type": "div", "content": "", "className": "aspect-square bg-linear-to-br from-primary/20 to-primary/5 rounded-lg"}
5. For buttons use string content: "content": "Click Me"
6. Create 2-5 components minimum
7. Use professional color schemes
8. Add proper hover states and transitions
9. Return ONLY valid JSON - no markdown, no explanation, no code blocks, no backticks`

async function generateWithClaude(prompt: string): Promise<DesignSpec> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0.7,
    system: SYSTEM_PROMPT,
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

async function generateWithOpenAI(prompt: string): Promise<DesignSpec> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  try {
    return JSON.parse(content) as DesignSpec
  } catch (error) {
    throw new Error(
      `Failed to parse OpenAI response: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function generateDesign(prompt: string): Promise<DesignSpec> {
  const provider = getAvailableProvider()

  if (!provider) {
    throw new Error('No AI provider configured. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY')
  }

  if (provider === 'claude') {
    return generateWithClaude(prompt)
  } else {
    return generateWithOpenAI(prompt)
  }
}
