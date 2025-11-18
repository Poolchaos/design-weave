'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Copy, Check } from 'lucide-react'
import type { DesignSpec } from '@/lib/claude/client'
import {
  generateReactComponent,
  generateTailwindClasses,
  generatePlainCSS,
} from '@/lib/codegen/generators'

interface ExportModalProps {
  design: DesignSpec | null
}

type ExportFormat = 'react' | 'tailwind' | 'css'

export function ExportModal({ design }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('react')
  const [copied, setCopied] = useState(false)

  if (!design) return null

  const getCode = () => {
    switch (format) {
      case 'react':
        return generateReactComponent(design)
      case 'tailwind':
        return generateTailwindClasses(design)
      case 'css':
        return generatePlainCSS(design)
      default:
        return ''
    }
  }

  const getFileExtension = () => {
    switch (format) {
      case 'react':
        return 'tsx'
      case 'tailwind':
        return 'txt'
      case 'css':
        return 'css'
      default:
        return 'txt'
    }
  }

  const handleCopy = async () => {
    const code = getCode()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const code = getCode()
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `design.${getFileExtension()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!design}>
          <Download className="mr-2 h-4 w-4" />
          Export Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Choose your preferred format and export the code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={format}
              onValueChange={value => setFormat(value as ExportFormat)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React Component</SelectItem>
                <SelectItem value="tailwind">Tailwind Classes</SelectItem>
                <SelectItem value="css">Plain CSS</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="outline" size="sm">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="relative">
            <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
              <code className="text-sm">{getCode()}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
