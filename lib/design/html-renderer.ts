import type { DesignSpec } from '@/lib/ai/client'

type ContentChild = {
  type: string
  content: string | ContentChild[] | null | undefined
  className?: string
}

type Content = string | ContentChild[] | null | undefined

/**
 * Recursively converts nested content structure to HTML string
 */
function renderContentToHTML(content: Content): string {
  if (!content) return ''

  // If content is a string, escape it and return
  if (typeof content === 'string') {
    return escapeHTML(content)
  }

  // If content is an array, recursively render each child
  if (Array.isArray(content)) {
    return content.map(child => {
      const tag = child.type || 'div'
      const className = child.className ? ` class="${escapeHTML(child.className)}"` : ''
      const isVoidElement = ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tag)

      if (isVoidElement) {
        return `<${tag}${className} />`
      }

      const childContent = renderContentToHTML(child.content)
      return `<${tag}${className}>${childContent}</${tag}>`
    }).join('')
  }

  return ''
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHTML(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

/**
 * Converts a DesignSpec to a complete HTML string
 */
export function designToHTML(design: DesignSpec): string {
  const layoutClass =
    design.layout === 'flex-col' ? 'flex flex-col gap-4' :
    design.layout === 'flex-row' ? 'flex flex-row gap-4' :
    design.layout === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3' :
    'flex flex-col gap-4'

  const components = design.components.map(component => {
    const tag = component.type || 'div'
    const className = component.styles.className || ''
    const content = renderContentToHTML(component.content)

    return `<${tag} class="${escapeHTML(className)}" data-testid="design-component" data-component-type="${escapeHTML(tag)}">${content}</${tag}>`
  }).join('')

  // Add custom CSS variables for theme colors
  const cssVars = `--color-primary: ${design.theme.colors.primary}; --color-secondary: ${design.theme.colors.secondary};`

  return `<div class="${layoutClass}" style="${cssVars}" data-testid="design-container">${components}</div>`
}
