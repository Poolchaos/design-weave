'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>
  isLoading?: boolean
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
}

export function PromptInput({
  onSubmit,
  isLoading = false,
  maxLength = 500,
  value: externalValue,
  onChange: externalOnChange,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Use external value if provided, otherwise use internal state
  const prompt = externalValue !== undefined ? externalValue : internalValue
  const setPrompt = externalOnChange || setInternalValue

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

      <Button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={cn(
          "w-full transition-all",
          !isLoading && "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
          isLoading && "cursor-wait"
        )}
      >
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
