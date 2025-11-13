'use client'

import { useEffect, useRef, useState } from 'react'
import type { DesignSpec } from '@/lib/claude/client'
import { cn } from '@/lib/utils'

interface CanvasPreviewProps {
  design: DesignSpec | null
  className?: string
}

export function CanvasPreview({ design, className }: CanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [renderTime, setRenderTime] = useState<number>(0)

  useEffect(() => {
    if (!design) return

    const startTime = performance.now()

    // Render logic happens through React re-render
    // Measure after render completes
    requestAnimationFrame(() => {
      const endTime = performance.now()
      setRenderTime(endTime - startTime)
    })
  }, [design])

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

      {/* Design preview */}
      <div
        className={cn(
          design.layout === 'flex-col' && 'flex flex-col gap-4',
          design.layout === 'flex-row' && 'flex flex-row gap-4',
          design.layout === 'grid' && 'grid grid-cols-3 gap-4'
        )}
        style={{
          ['--color-primary' as string]: design.theme.colors.primary,
          ['--color-secondary' as string]: design.theme.colors.secondary,
        }}
      >
        {design.components.map((component, index) => (
          <div
            key={index}
            className={component.styles.className}
            data-component-type={component.type}
          >
            {component.type === 'card' && (
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-current/10" />
                <div className="h-3 w-1/2 rounded bg-current/10" />
              </div>
            )}
            {component.type === 'button' && (
              <button className="px-4 py-2" disabled>
                Button
              </button>
            )}
            {component.type === 'header' && (
              <div className="space-y-2">
                <div className="h-6 w-1/2 rounded bg-current/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
