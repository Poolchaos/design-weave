'use client'

import { useState } from 'react'
import { Sparkles, Palette, LayoutGrid } from 'lucide-react'

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void
  disabled?: boolean
}

const SIMPLE_EXAMPLES = [
  "Modern pricing card with gradient header, feature list with checkmarks, and prominent CTA button",
  "Hero section with large bold heading, gradient text, subtitle, and two action buttons side by side",
  "Glassmorphism card with frosted glass effect, subtle border, backdrop blur, and inner shadow",
  "Professional dashboard stat card with icon, large metric number, label, and trend indicator",
  "Minimalist testimonial card with quote, 5-star rating, author name, and circular avatar placeholder",
  "Feature section with icon, bold heading, descriptive text, and 'Learn more' link with arrow",
]

const REAL_WORLD_EXAMPLES = [
  "Contact form with name and email inputs, large message textarea, gradient submit button with hover effect, and helper text",
  "Product showcase grid with 3 columns, each card has image placeholder, product name, price tag, 4-star rating, and add to cart button",
  "Landing page hero with oversized gradient heading, compelling subtitle, email signup input with inline button, and trust badges below",
  "Pricing comparison table with 3 tiers (Basic, Pro, Enterprise), checkmark feature lists, highlighted popular plan, and distinct CTAs per tier",
  "Blog post card with featured image placeholder, category badge, heading, excerpt text, read time, author info, and read more link",
  "Authentication modal with social login buttons (Google, GitHub), divider with 'or', email/password fields, remember me checkbox, and sign in button",
  "Dashboard sidebar navigation with logo at top, menu items with icons, active state highlighting, user profile section at bottom",
  "E-commerce product card with large image, wishlist heart icon, product title, star rating with review count, price with discount badge, size selector, and add to bag button",
  "Newsletter signup section with attention-grabbing heading, benefit points with checkmarks, email input with inline subscribe button, and privacy policy link",
  "Team member profile card with circular avatar, name, role title, short bio, social media icon links, and contact button",
  "Feature comparison section with 4 feature cards in a grid, each with gradient icon, feature name, description, and prominent metric or benefit",
  "Testimonial carousel card with large quote, 5-star rating, customer photo, name, company, and navigation dots",
]

type TabType = 'simple' | 'real-world'

export function ExamplePrompts({ onSelectPrompt, disabled = false }: ExamplePromptsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('simple')

  const examples = activeTab === 'simple' ? SIMPLE_EXAMPLES : REAL_WORLD_EXAMPLES

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Try these examples:</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('simple')}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'simple'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Palette className="h-4 w-4" />
          Simple
        </button>
        <button
          onClick={() => setActiveTab('real-world')}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'real-world'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <LayoutGrid className="h-4 w-4" />
          Real-World
        </button>
      </div>

      {/* Example Prompts */}
      <div className="flex flex-wrap gap-2">
        {examples.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            disabled={disabled}
            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none text-left"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
