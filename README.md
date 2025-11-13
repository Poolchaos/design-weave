# DesignWeave

AI-powered visual design assistant that transforms natural language descriptions into live UI designs using Claude API.

## Features

- Natural language to UI design generation
- Real-time canvas preview
- Export to React, Tailwind CSS, or plain CSS
- Design state persistence
- Performance optimized (API <2s, canvas <100ms)

## Tech Stack

- **Framework:** Next.js 15 + React 19
- **AI:** Claude API (Anthropic)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand with localStorage persistence
- **Testing:** Jest, React Testing Library, Playwright
- **TypeScript:** Strict mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Poolchaos/design-weave.git
cd design-weave

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Required:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

## Development

```bash
npm run dev        # Start dev server
npm test          # Run tests (watch mode)
npm run test:ci   # Run tests (CI mode)
npm run test:e2e  # Run E2E tests
npm run format    # Format code
npm run lint      # Lint code
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

## Usage

1. Enter design description (e.g., "gradient card with glassmorphism, 3 columns, shadows")
2. Click "Generate Design"
3. View real-time rendered design
4. Export as React/Tailwind/CSS

## License

MIT


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
