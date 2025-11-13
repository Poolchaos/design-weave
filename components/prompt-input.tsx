'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>
  isLoading?: boolean
  maxLength?: number
}

export function PromptInput({
  onSubmit,
  isLoading = false,
  maxLength = 500,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!prompt.trim()) {
      setError('Please enter a design description')
      return
    }

    if (prompt.length > maxLength) {
      setError(`Description must be ${maxLength} characters or less`)
      return
    }

    try {
      await onSubmit(prompt.trim())
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate design'
      )
    }
  }

  const remainingChars = maxLength - prompt.length

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt">Describe your design</Label>
        <Textarea
          id="prompt"
          placeholder="e.g., gradient card with glassmorphism, 3 columns, shadows"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={isLoading}
          maxLength={maxLength}
          className="min-h-[120px] resize-none"
          aria-describedby="prompt-hint prompt-error"
        />
        <div className="flex justify-between text-sm">
          <span id="prompt-hint" className="text-muted-foreground">
            Natural language description of your design
          </span>
          <span
            className={
              remainingChars < 50 ? 'text-destructive' : 'text-muted-foreground'
            }
            aria-live="polite"
          >
            {remainingChars} characters remaining
          </span>
        </div>
        {error && (
          <p id="prompt-error" className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating design...
          </>
        ) : (
          'Generate Design'
        )}
      </Button>
    </form>
  )
}
