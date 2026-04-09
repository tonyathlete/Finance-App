# CLAUDE.md

## Project Overview

**VulneraCan** — A French-Canadian financial vulnerability assessment tool built with React, TypeScript, and Google Gemini AI. Users complete a financial survey, and the app provides an AI-powered analysis with a vulnerability score (0–100), risk zone classification (Green/Yellow/Red), and personalized recommendations in the Canadian financial context (REER, CELI, etc.).

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **AI**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS (CDN) + Font Awesome icons (CDN)
- **Target**: ES2022, ESM modules

## Project Structure

```
├── App.tsx                  # Root component, main state management
├── index.tsx                # Entry point
├── index.html               # HTML template (loads Tailwind/FA via CDN)
├── types.ts                 # Shared TypeScript types (AnalysisResult, SurveyData, LeadInfo)
├── components/
│   ├── SurveyForm.tsx       # 3-section financial data form (profile, finances, retirement)
│   ├── ResultView.tsx       # Displays AI analysis results with vulnerability zones
│   └── LeadCaptureModal.tsx # Modal for capturing user contact info
├── services/
│   └── geminiService.ts     # Gemini API integration, prompt engineering, structured output
├── vite.config.ts           # Vite config (port 3000, path aliases)
├── tsconfig.json            # TypeScript config (strict, bundler resolution)
├── package.json             # Dependencies and scripts
└── metadata.json            # App metadata
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000, host 0.0.0.0)
npm run build        # Production build
npm run preview      # Preview production build
```

## Environment Variables

The app requires a Gemini API key:

```
GEMINI_API_KEY=<your-key>
```

Set in `.env.local` (gitignored). Vite injects it via the `define` config in `vite.config.ts`.

## Architecture

**Data flow**: SurveyForm → LeadCaptureModal → geminiService → ResultView

- State lives in `App.tsx` using React hooks (`useState`)
- Components communicate via props and callbacks
- `geminiService.ts` handles all AI interaction with structured JSON output via Gemini's schema validation
- The AI model used is `gemini-3-flash-preview`

## Code Conventions

- **Language**: All UI text is in French; code (variable names, comments) is in English
- **Components**: Functional components with hooks, no class components
- **Types**: Centralized in `types.ts`, no inline type definitions for shared structures
- **Styling**: Tailwind utility classes inline, dark theme (slate-950 base), responsive with `md:` breakpoints
- **Path aliases**: `@/*` maps to the project root (configured in tsconfig and vite)

## No Testing or CI

No test framework, linter, or CI/CD pipeline is configured. The project is in early development.
