'use client'

import { useEffect, useRef, useState } from 'react'
import type { DesignSpec } from '@/lib/claude/client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { designToHTML } from '@/lib/design/html-renderer'

interface CanvasPreviewProps {
  design: DesignSpec | null
  className?: string
  isLoading?: boolean
}

export function CanvasPreview({ design, className, isLoading = false }: CanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [renderTime, setRenderTime] = useState<number>(0)
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    if (!design) {
      setHtmlContent('')
      return
    }

    const startTime = performance.now()

    // Convert design to HTML string
    const html = designToHTML(design)
    setHtmlContent(html)

    // Measure after render completes
    requestAnimationFrame(() => {
      const endTime = performance.now()
      setRenderTime(endTime - startTime)
    })
  }, [design])

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border-2 border-dashed border-primary/25 bg-primary/5 p-12 animate-pulse',
          className
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-primary">Generating your design...</p>
        </div>
      </div>
    )
  }

  if (!design) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-12',
          className
        )}
      >
        <p className="text-muted-foreground">
          Your design will appear here
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn('relative rounded-lg border bg-background p-6', className)}
      ref={containerRef}
    >
      {/* Render time indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && renderTime > 0 && (
        <div className="absolute right-2 top-2 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
          Rendered in {renderTime.toFixed(2)}ms
        </div>
      )}

      {/* Design preview - render HTML string */}
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
