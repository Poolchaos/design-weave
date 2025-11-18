import { NextRequest, NextResponse } from 'next/server'
import { generateDesign, getAvailableProvider } from '@/lib/ai/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be 500 characters or less' },
        { status: 400 }
      )
    }

    const provider = getAvailableProvider()
    if (!provider) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY' },
        { status: 500 }
      )
    }

    const design = await generateDesign(prompt)

    return NextResponse.json({ design, provider }, { status: 200 })
  } catch (error) {
    console.error('Design generation error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}
