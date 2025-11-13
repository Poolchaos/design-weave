'use client'

import { PromptInput } from '@/components/prompt-input'
import { CanvasPreview } from '@/components/canvas-preview'
import { useDesignStore } from '@/lib/store/design-store'

export default function Home() {
  const {
    currentDesign,
    isGenerating,
    error,
    setCurrentDesign,
    addPromptToHistory,
    setIsGenerating,
    setError,
  } = useDesignStore()

  const handleGenerateDesign = async (prompt: string) => {
    setIsGenerating(true)
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
      addPromptToHistory(prompt)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate design'
      setError(errorMessage)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">DesignWeave</h1>
          <p className="text-muted-foreground">
            Describe your design, watch it render in real-time
          </p>
        </div>
      </header>

      <main className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Design Prompt</h2>
            <PromptInput
              onSubmit={handleGenerateDesign}
              isLoading={isGenerating}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Preview</h2>
          <CanvasPreview design={currentDesign} className="min-h-[400px]" />
        </div>
      </main>
    </div>
  )
}
