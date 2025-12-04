# Session Handoff - Cold Email Sequencer

## TL;DR

MVP is complete. Next step: Add Supabase auth + Stripe payments to enable multi-user SaaS.

## What's Done

- Complete React app with email sequence generation
- OpenRouter AI integration for email generation
- Jina Reader for prospect website scraping
- Dark theme UI with Tailwind CSS v4
- localStorage persistence (to be migrated)
- GitHub repo: https://github.com/aisandler/email-sequencer

## What's Next (Priority Order)

1. **Supabase Auth** - User accounts, login/signup
2. **Database** - Replace localStorage with Postgres
3. **Usage Tracking** - Limit free tier to 1 generation/month
4. **Stripe** - Subscriptions ($19 Starter, $49 Pro)
5. **Paywall UI** - Upgrade prompts when limit reached

## Quick Commands

```bash
cd /Users/adamsandler/projects/email-sequencer
npm run dev      # Start dev server (port 5173 or 5174)
npm run build    # Build for production
```

## Key Files to Understand

- [src/App.tsx](src/App.tsx) - Main app layout
- [src/lib/generators/emailGenerator.ts](src/lib/generators/emailGenerator.ts) - AI generation logic
- [src/lib/rules/emailRules.ts](src/lib/rules/emailRules.ts) - Cold email validation rules
- [src/context/FormDataContext.tsx](src/context/FormDataContext.tsx) - Form state (migrate to Supabase)
- [src/types/index.ts](src/types/index.ts) - All TypeScript interfaces

## Detailed Plan

See [PRD-MULTI-USER.md](PRD-MULTI-USER.md) for:
- Full database schema
- Pricing tiers breakdown
- Implementation phases with time estimates
- Future features roadmap

## User Requirements (Direct Quotes)

> "The plan is to deploy and launch this for user accounts at some point, so i want to ensure all of the capabilities are able to be transferrable as such."

> "im also going to want to enable payments/subscriptions and have some kind of free tier, maybe 1 generation or run."

## Tech Decisions (Already Made)

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth/DB | Supabase | All-in-one, good free tier |
| Payments | Stripe | Industry standard |
| AI | OpenRouter | Model flexibility |
| Styling | Tailwind v4 | Already configured |
| Deploy | Vercel | Best for Vite/React |
