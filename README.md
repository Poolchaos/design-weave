# DesignWeave

**AI-powered visual design assistant that transforms natural language descriptions into live UI designs.**

> Describe your design in plain English and watch it render in real-time. Export as React components, Tailwind classes, or plain CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Natural Language Input**: Describe designs in plain English (e.g., "gradient card with glassmorphism, 3 columns, shadows")
- **Real-time Preview**: See your design render instantly with <100ms render time
- **AI-Powered Generation**: Claude 3.5 Sonnet transforms descriptions into structured design specs
- **Multiple Export Formats**: Export as React components (JSX/TSX), Tailwind CSS classes, or plain CSS
- **State Persistence**: Designs automatically saved to localStorage
- **Performance Optimized**: API calls <2s, canvas rendering <100ms, exports <500ms
- **Fully Tested**: Comprehensive unit, component, and E2E test coverage

## Demo

```
Input: "gradient card with glassmorphism effect, 3 columns layout, drop shadows"

Output: Live rendered design + exportable code
```

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **AI**: Claude 3.5 Sonnet (Anthropic) or GPT-4o (OpenAI) - auto-detected
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Testing**: Jest, React Testing Library, Playwright E2E
- **Language**: TypeScript (strict mode)
- **Code Quality**: ESLint, Prettier

## Architecture

```
app/
  page.tsx                 # Main UI
  api/generate/route.ts    # Claude API integration
components/
  prompt-input.tsx         # Natural language input with validation
  canvas-preview.tsx       # Real-time design renderer
  export-modal.tsx         # Code export with format selection
lib/
  claude/                  # AI client and fixtures
  codegen/                 # React/Tailwind/CSS generators
  store/                   # Zustand state management
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AI API key (choose one):
  - **Claude**: Anthropic API key - [Get one free](https://console.anthropic.com/)
  - **OpenAI**: OpenAI API key - [Get one here](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone repository
git clone https://github.com/Poolchaos/design-weave.git
cd design-weave

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY or OPENAI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create `.env.local` with your AI provider key (choose one or both):

```env
# AI Provider - set either one (app will auto-detect)
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

## Usage

1. **Describe**: Enter a natural language description of your design
2. **Generate**: Click "Generate Design" (powered by Claude AI or OpenAI GPT-4)
3. **Preview**: View the rendered design in real-time
4. **Export**: Choose format (React/Tailwind/CSS) and export code

### Example Prompts

- "Modern card with gradient background and rounded corners"
- "Three column grid layout with blue cards and shadows"
- "Minimalist button with green background and white text"
- "Dashboard header with logo and navigation menu"

## Development

```bash
npm run dev          # Start dev server on port 5173
npm run build        # Production build
npm run start        # Start production server
npm test             # Run tests in watch mode
npm run test:ci      # Run tests with coverage
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint
```

## Testing

- **Unit Tests**: Jest with React Testing Library
- **Component Tests**: Testing user interactions and rendering
- **E2E Tests**: Playwright for full user flows
- **Coverage Target**: 70%+ (configured in `jest.config.js`)

Run all tests:
```bash
npm run test:ci
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Configure environment variables:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
4. Deploy

### Other Platforms

Compatible with any Node.js hosting platform that supports Next.js 15:
- Netlify
- Railway
- Render
- AWS Amplify

See Next.js [deployment docs](https://nextjs.org/docs/deployment) for details.

## Performance

Targets (all met in production):
- **Claude API**: <2s response time
- **Canvas Render**: <100ms
- **Code Export**: <500ms

## Browser Support

- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## Project Status

**Current Version**: MVP (v0.1.0)

**Completed Features**:
- ✅ Claude API integration
- ✅ Natural language prompt input
- ✅ Real-time canvas preview
- ✅ Export to React/Tailwind/CSS
- ✅ State persistence
- ✅ Comprehensive testing

**Planned Features**:
- ⏳ Design history with undo/redo
- ⏳ Share designs via unique URLs
- ⏳ Component library integration
- ⏳ Responsive preview modes
- ⏳ Animation suggestions
- ⏳ Accessibility checker

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Created by [Poolchaos](https://github.com/Poolchaos)** | [Report Bug](https://github.com/Poolchaos/design-weave/issues) | [Request Feature](https://github.com/Poolchaos/design-weave/issues)
