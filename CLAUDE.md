# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (port 5173, or 5174 if busy)
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
```

## Architecture Overview

This is a cold email sequence generator that uses AI (OpenRouter) to create 4-email sequences following cold email best practices.

### Data Flow

```
User Input (Forms) → FormDataContext → emailGenerator → OpenRouter API → EmailSequence → OutputPanel
```

### Key Architectural Patterns

**State Management**: Uses React Context + custom singleton store pattern (no external state libraries)
- `FormDataContext` - Form state with localStorage persistence
- `AIContext` - API key and model selection
- `useGenerationStore` - Singleton pattern for generation state shared across components

**Rules Engine** (`src/lib/rules/emailRules.ts`): Enforces cold email best practices
- Word count validation (50-80 words)
- "Me First" opener detection (emails must start with THEM, not I/We)
- Forbidden patterns (lazy follow-ups, call asks in Email 1)
- Subject line rules (2-4 words, no {{firstName}})

**AI Integration**:
- `src/lib/api/openrouter.ts` - OpenRouter API client with JSON mode support
- `src/lib/api/scraper.ts` - Jina Reader API for prospect website scraping
- `src/lib/generators/emailGenerator.ts` - Builds system prompts with rules baked in

### Component Organization

- `components/forms/` - Input forms (ICP, Offer, Brand, Social Proof)
- `components/output/` - Generated content display (EmailCard, ValidationChecklist, IcebreakerPanel)
- `components/layout/` - Page structure (InputPanel, OutputPanel, Header)
- `components/ui/` - Reusable primitives (Button, Card, Input, TagInput, Toast)

## Tailwind CSS v4 Configuration

This project uses Tailwind v4 with the CSS-based configuration system:

- **PostCSS plugin**: Use `@tailwindcss/postcss` (not `tailwindcss` directly)
- **Theme definition**: In `src/index.css` using `@theme { }` blocks
- **Custom colors**: `background`, `foreground`, `accent` (coral), `success`, `warning`, `error`
- **Custom fonts**: `--font-display` (Fraunces), `--font-sans` (DM Sans)

## Type System

All types are centralized in `src/types/index.ts`:
- `FormData` - Contains `ICPData`, `OfferData`, `BrandData`, `SocialProofData`
- `EmailSequence` - Contains `Email[]`, `icebreakerPrompt`, `validationResults`
- `AIConfig` - API key, model, configuration status

## Future Development

See `docs/PRD-MULTI-USER.md` for planned Supabase auth + Stripe payments integration.
