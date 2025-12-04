# Cold Email Sequencer - Multi-User Platform PRD

## Project Overview

**Product**: One Button Cold Email Sequence Generator
**Current State**: MVP Complete (client-side only)
**GitHub**: https://github.com/aisandler/email-sequencer
**Goal**: Transform from single-user client-side app to multi-user SaaS platform with authentication, payments, and usage limits.

---

## Current Architecture (MVP)

### Tech Stack
- **Frontend**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom dark theme
- **State**: localStorage + React Context + custom singleton store
- **AI**: OpenRouter API (user provides API key)
- **Scraping**: Jina Reader API for prospect enrichment

### Core Features (Implemented)
1. **Input Forms**: ICP Builder, Offer Builder, Brand Context, Social Proof
2. **AI Generation**: 4-email sequence following cold email best practices
3. **Rules Engine**: Word count, forbidden openers, CTA validation
4. **Icebreaker Modes**: Export prompt OR live testing with email input
5. **Validation Checklist**: Pass/fail indicators for each rule

### Key Files
```
src/
├── components/
│   ├── forms/           # ICPBuilder, OfferBuilder, BrandContext, SocialProof
│   ├── output/          # EmailSequenceDisplay, ValidationChecklist, IcebreakerPanel
│   ├── settings/        # SettingsDrawer, APIKeyInput, ModelSelector
│   └── ui/              # Button, Card, Badge, TagInput, Toast
├── context/
│   ├── FormDataContext.tsx    # Form state + localStorage persistence
│   └── AIContext.tsx          # API key, model selection
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useCopyToClipboard.ts
│   └── useGenerationStore.ts  # Generation state (singleton pattern)
├── lib/
│   ├── api/
│   │   ├── openrouter.ts      # OpenRouter API client
│   │   └── scraper.ts         # Jina Reader integration
│   ├── rules/
│   │   └── emailRules.ts      # Validation rules constants
│   └── generators/
│       └── emailGenerator.ts  # AI prompt + validation logic
└── types/
    └── index.ts               # TypeScript interfaces
```

---

## Target Architecture (Multi-User SaaS)

### Tech Stack Additions
| Layer | Technology | Purpose |
|-------|------------|---------|
| Auth | Supabase Auth | Email/password, Google OAuth, magic links |
| Database | Supabase Postgres | Users, campaigns, sequences, usage tracking |
| Payments | Stripe | Subscriptions, checkout sessions, webhooks |
| Edge Functions | Supabase Functions | Webhook handlers, usage enforcement |

### Database Schema

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'starter', 'pro'
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE public.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generations_used INTEGER DEFAULT 0,
  generations_limit INTEGER NOT NULL,
  UNIQUE(user_id, period_start)
);

-- Saved campaigns (form data)
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles NOT NULL,
  name TEXT NOT NULL,
  icp_data JSONB NOT NULL,
  offer_data JSONB NOT NULL,
  brand_data JSONB NOT NULL,
  social_proof_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated sequences
CREATE TABLE public.sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles NOT NULL,
  campaign_id UUID REFERENCES public.campaigns,
  emails JSONB NOT NULL,
  icebreaker_prompt TEXT,
  validation_results JSONB,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables...
```

### Pricing Tiers

| Tier | Price | Generations/Month | Features |
|------|-------|-------------------|----------|
| Free | $0 | 1 | Basic generation, no saved campaigns |
| Starter | $19/mo | 50 | Save campaigns, history, priority support |
| Pro | $49/mo | Unlimited | All features, API access, team seats (future) |

### Stripe Products

```javascript
// Products to create in Stripe Dashboard
const products = {
  starter: {
    name: 'Starter Plan',
    price: 1900, // cents
    interval: 'month',
    metadata: {
      tier: 'starter',
      generations_limit: 50
    }
  },
  pro: {
    name: 'Pro Plan',
    price: 4900,
    interval: 'month',
    metadata: {
      tier: 'pro',
      generations_limit: -1 // unlimited
    }
  }
};
```

---

## Implementation Phases

### Phase 1: Supabase Setup (2-3 hours)
1. Create Supabase project
2. Set up database schema (tables + RLS)
3. Configure auth providers (email, Google)
4. Create `src/lib/supabase.ts` client
5. Add environment variables

**Files to create:**
- `src/lib/supabase.ts` - Supabase client initialization
- `src/hooks/useAuth.ts` - Auth state management
- `src/context/AuthContext.tsx` - Auth provider wrapper

### Phase 2: Auth Integration (3-4 hours)
1. Create auth pages (login, signup, forgot password)
2. Protected route wrapper component
3. Update header with user menu
4. Migrate localStorage data to database on first login

**Files to create:**
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/UserMenu.tsx`

### Phase 3: Database Migration (2-3 hours)
1. Replace localStorage with Supabase queries
2. Create campaign CRUD operations
3. Add sequence saving after generation
4. Build campaign selector/manager UI

**Files to modify:**
- `src/context/FormDataContext.tsx` - Use Supabase instead of localStorage
- `src/hooks/useGenerationStore.ts` - Save sequences to database

**Files to create:**
- `src/hooks/useCampaigns.ts` - Campaign CRUD
- `src/components/campaigns/CampaignSelector.tsx`
- `src/components/campaigns/CampaignManager.tsx`

### Phase 4: Usage Tracking (2-3 hours)
1. Create usage tracking service
2. Check limits before generation
3. Display usage in UI
4. Reset usage on billing cycle

**Files to create:**
- `src/lib/usage.ts` - Usage tracking functions
- `src/hooks/useUsage.ts` - Usage state hook
- `src/components/UsageDisplay.tsx` - Usage meter component

### Phase 5: Stripe Integration (4-5 hours)
1. Set up Stripe products/prices in dashboard
2. Create checkout session endpoint (Supabase function)
3. Handle webhooks for subscription events
4. Build upgrade/billing UI
5. Implement paywall for free tier

**Files to create:**
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `supabase/functions/create-portal/index.ts`
- `src/components/billing/PricingTable.tsx`
- `src/components/billing/UpgradeModal.tsx`
- `src/pages/Billing.tsx`

### Phase 6: Polish & Launch (2-3 hours)
1. Error handling and edge cases
2. Loading states and skeletons
3. Email templates (welcome, subscription confirmation)
4. Analytics setup (Plausible or PostHog)
5. Production deployment (Vercel)

---

## Future Features (Post-Launch)

### Website Auto-Fill
Scrape user's own website to pre-populate Brand Context and ICP fields.

```typescript
// src/lib/api/websiteAnalyzer.ts
export async function analyzeWebsite(url: string): Promise<{
  companyName: string;
  industry: string;
  valueProp: string;
  offerings: string[];
  targetAudience: string;
}> {
  const content = await scrapeWebsite(url);
  // Use AI to extract structured data
  return callOpenRouterJSON([
    { role: 'system', content: WEBSITE_ANALYSIS_PROMPT },
    { role: 'user', content }
  ], config);
}
```

### Guided Chat Onboarding
AI-powered conversational interface to collect form data.

```typescript
// Conversation flow
const ONBOARDING_STEPS = [
  { id: 'company', question: 'What does your company do?' },
  { id: 'audience', question: 'Who is your ideal customer?' },
  { id: 'pain', question: 'What problems do you solve for them?' },
  { id: 'proof', question: 'What results have you achieved?' },
  // ...
];
```

### Team Features (Pro+)
- Multiple user seats
- Shared campaigns
- Team billing
- Role-based permissions

### API Access (Pro)
- REST API for programmatic generation
- Webhook notifications
- n8n/Zapier integrations

---

## Environment Variables

```bash
# .env.local (client-side, prefixed with VITE_)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase Functions (server-side)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## API Key Strategy

### Current (MVP)
User provides their own OpenRouter API key, stored in localStorage.

### Future Options

**Option A: Shared API Key (Recommended for simplicity)**
- Platform provides OpenRouter API key
- Cost included in subscription
- Easier UX, no setup required

**Option B: BYOK (Bring Your Own Key)**
- Users continue to provide own key
- Lower platform costs
- More setup friction

**Option C: Hybrid**
- Platform key for paid tiers (included in price)
- BYOK option for free tier

---

## Security Considerations

1. **API Keys**: Store encrypted in database, never expose to client
2. **RLS**: All tables have row-level security enabled
3. **Webhooks**: Verify Stripe signatures
4. **Rate Limiting**: Implement at edge function level
5. **Input Validation**: Sanitize all user inputs before AI prompts

---

## Success Metrics

| Metric | Target (Month 1) |
|--------|------------------|
| Signups | 100 |
| Free → Paid Conversion | 5% |
| Generations per User | 3+ |
| Churn Rate | <10% |

---

## Quick Start for New Session

1. **Read this PRD** to understand the full context
2. **Run the app**: `npm run dev` (starts at localhost:5173 or 5174)
3. **Start with Phase 1**: Set up Supabase project and schema
4. **Test locally** with Supabase local dev (`supabase start`)
5. **Deploy** to Vercel when ready

**Key decisions already made:**
- Supabase for auth + database (not Firebase, Clerk, etc.)
- Stripe for payments (not Paddle, Lemonsqueezy)
- Keep OpenRouter for AI (model flexibility)
- Dark theme with coral accents (design system established)
