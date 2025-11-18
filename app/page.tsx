'use client'

import { useState, useEffect } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { CanvasPreview } from '@/components/canvas-preview'
import { ExportModal } from '@/components/export-modal'
import { ExamplePrompts } from '@/components/example-prompts'
import { useDesignStore } from '@/lib/store/design-store'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Trash2 } from 'lucide-react'

export default function Home() {
  const [promptValue, setPromptValue] = useState('')
  const [aiProvider, setAiProvider] = useState<'claude' | 'openai' | null>(null)
  const [localIsGenerating, setLocalIsGenerating] = useState(false)
  const {
    currentDesign,
    error,
    setCurrentDesign,
    addPromptToHistory,
    setError,
    clearDesign,
  } = useDesignStore()

  // Use local state for loading to ensure immediate UI updates
  const isGenerating = localIsGenerating

  const handleGenerateDesign = async (prompt: string) => {
    setLocalIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate design')
      }

      const data = await response.json()
      setCurrentDesign(data.design)
      setAiProvider(data.provider || null)
      addPromptToHistory(prompt)
      setPromptValue('')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate design'
      setError(errorMessage)
      throw err
    } finally {
      setLocalIsGenerating(false)
    }
  }

  const handleSelectPrompt = (prompt: string) => {
    setPromptValue(prompt)
  }

  const handleClearDesign = () => {
    clearDesign()
    setAiProvider(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      {/* Header */}
      <header className="animate-fade-in border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-ai">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-ai-text">DesignWeave</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Design Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>
                Powered by {aiProvider === 'openai' ? 'OpenAI GPT-4' : aiProvider === 'claude' ? 'Claude AI' : 'AI'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="animate-slide-up container mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl font-bold gradient-ai-text md:text-5xl">
          Transform Words into Designs
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Describe your design in plain English and watch AI render it in real-time.
          Export as React components, Tailwind classes, or plain CSS.
        </p>
      </section>

      {/* Main Content */}
      <main className="container mx-auto grid gap-8 px-4 pb-12 lg:grid-cols-2">
        {/* Left Column - Input */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Design Prompt</h3>
            <PromptInput
              onSubmit={handleGenerateDesign}
              isLoading={isGenerating}
              value={promptValue}
              onChange={setPromptValue}
            />
          </div>

          <ExamplePrompts
            onSelectPrompt={handleSelectPrompt}
            disabled={isGenerating}
          />

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Preview</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearDesign}
                disabled={!currentDesign}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
              <ExportModal design={currentDesign} />
            </div>
          </div>
          <CanvasPreview
            design={currentDesign}
            className="min-h-[400px]"
            isLoading={isGenerating}
          />
        </div>
      </main>
    </div>
  )
}
