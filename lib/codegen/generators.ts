import type { DesignSpec } from '@/lib/claude/client'

export function generateReactComponent(design: DesignSpec): string {
  const componentName = 'GeneratedDesign'
  
  const components = design.components
    .map((component, index) => {
      const className = component.styles.className || ''
      
      switch (component.type) {
        case 'card':
          return `    <div key={${index}} className="${className}">
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-current/10" />
        <div className="h-3 w-1/2 rounded bg-current/10" />
      </div>
    </div>`
        case 'button':
          return `    <button key={${index}} className="${className}">
      Button
    </button>`
        case 'header':
          return `    <header key={${index}} className="${className}">
      <div className="space-y-2">
        <div className="h-6 w-1/2 rounded bg-current/20" />
      </div>
    </header>`
        case 'div':
        default:
          return `    <div key={${index}} className="${className}" />`
      }
    })
    .join('\n')

  const layoutClass = 
    design.layout === 'flex-col' ? 'flex flex-col gap-4' :
    design.layout === 'flex-row' ? 'flex flex-row gap-4' :
    design.layout === 'grid' ? 'grid grid-cols-3 gap-4' :
    'flex flex-col gap-4'

  return `export function ${componentName}() {
  return (
    <div
      className="${layoutClass}"
      style={{
        '--color-primary': '${design.theme.colors.primary || '#000'}',
        '--color-secondary': '${design.theme.colors.secondary || '#666'}',
      } as React.CSSProperties}
    >
${components}
    </div>
  )
}
`
}

export function generateTailwindClasses(design: DesignSpec): string {
  const layoutClass = 
    design.layout === 'flex-col' ? 'flex flex-col gap-4' :
    design.layout === 'flex-row' ? 'flex flex-row gap-4' :
    design.layout === 'grid' ? 'grid grid-cols-3 gap-4' :
    'flex flex-col gap-4'

  const classes = [
    `/* Layout */`,
    layoutClass,
    '',
    `/* Components */`,
    ...design.components.map((component, index) => 
      `/* Component ${index + 1} (${component.type}) */\n${component.styles.className || 'No classes'}`
    ),
  ]

  return classes.join('\n')
}

export function generatePlainCSS(design: DesignSpec): string {
  const css = [
    `.design-container {`,
    `  display: ${design.layout === 'grid' ? 'grid' : 'flex'};`,
    design.layout === 'flex-col' ? `  flex-direction: column;` : '',
    design.layout === 'flex-row' ? `  flex-direction: row;` : '',
    design.layout === 'grid' ? `  grid-template-columns: repeat(3, 1fr);` : '',
    `  gap: 1rem;`,
    `  --color-primary: ${design.theme.colors.primary || '#000'};`,
    `  --color-secondary: ${design.theme.colors.secondary || '#666'};`,
    `}`,
    '',
  ]

  design.components.forEach((component, index) => {
    css.push(`.component-${index + 1} {`)
    
    // Convert Tailwind classes to CSS (basic conversion)
    const classes = component.styles.className?.split(' ') || []
    
    classes.forEach(cls => {
      if (cls.startsWith('bg-')) {
        const color = cls.replace('bg-', '')
        css.push(`  background-color: ${convertTailwindColor(color)};`)
      } else if (cls.startsWith('p-')) {
        const padding = cls.replace('p-', '')
        css.push(`  padding: ${convertTailwindSpacing(padding)};`)
      } else if (cls.includes('rounded')) {
        css.push(`  border-radius: ${cls === 'rounded' ? '0.25rem' : '0.5rem'};`)
      } else if (cls.startsWith('text-')) {
        const color = cls.replace('text-', '')
        css.push(`  color: ${convertTailwindColor(color)};`)
      }
    })
    
    css.push(`}`)
    css.push('')
  })

  return css.filter(Boolean).join('\n')
}

function convertTailwindColor(color: string): string {
  const colorMap: Record<string, string> = {
    'blue-500': '#3b82f6',
    'green-500': '#10b981',
    'red-500': '#ef4444',
    'purple-500': '#a855f7',
    'purple-600': '#9333ea',
    'gray-500': '#6b7280',
    'white': '#ffffff',
    'black': '#000000',
  }
  return colorMap[color] || color
}

function convertTailwindSpacing(spacing: string): string {
  const spacingMap: Record<string, string> = {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
  }
  return spacingMap[spacing] || '1rem'
}
