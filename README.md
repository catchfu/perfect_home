# Perfect Home — Honest Floor Plan Diagnostics

AI-powered tool that analyzes floor plans and exposes problems — not sugar-coats them. Before you buy or rent, know exactly what you'll be living with.

## How It Works

1. **Upload** — Drop in any floor plan (developer drawing, CAD, hand sketch, screenshot)
2. **AI Diagnosis** — AI scans 8 categories of issues: entrance flow, circulation, living spaces, bedrooms, kitchen, bathroom, lighting & ventilation, storage, and Feng Shui
3. **Get Report** — Receive a visual diagnostic report with numbered problem markers, priority rankings, causal chain analysis, and actionable fixes

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | Custom design system (cream + ink blue palette) |
| State | TanStack React Query + Zustand |
| Forms | React Hook Form + Zod |
| Auth | NextAuth.js (Google / GitHub OAuth) |
| Database | PostgreSQL + Prisma ORM |
| Storage | Local filesystem (pluggable to S3/R2) |
| AI | GPT-4 Vision / Claude (mock pipeline for MVP) |
| Payments | Stripe (checkout sessions + webhooks) |
| OG Images | @vercel/og (Satori) |
| Analytics | PostHog |
| Animations | Framer Motion |
| PWA | Manifest + Service Worker + Offline page |

## Getting Started

```bash
npm install
cp .env.example .env  # configure your env vars
npx prisma db push     # sync DB schema
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth encryption secret |
| `NEXTAUTH_URL` | App URL (e.g. http://localhost:3000) |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth app credentials |
| `GOOGLE_ID` / `GOOGLE_SECRET` | Google OAuth app credentials |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog instance URL |

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page with samples |
| `/analyze` | Static | Upload floor plan + context form |
| `/analyze/result/[id]` | Dynamic | Full diagnosis report |
| `/dashboard` | Static | User history + credits |
| `/pricing` | Static | Subscription plans |
| `/how-it-works` | Static | Feature explanation |
| `/auth/signin` | Static | OAuth sign in |
| `/offline` | Static | PWA offline fallback |
| `/og` | Edge | Dynamic OG image |
| `/og/report/[id]` | Edge | Report OG image |

### API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Submit floor plan for analysis |
| `/api/analysis/[id]` | GET | Poll analysis status / get report |
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Stripe payment webhook |
| `/api/user/reports` | GET | User's report history |
| `/api/user/payments` | GET | User's payment history |
| `/api/auth/[...nextauth]` | * | NextAuth handler |

## Project Structure

```
app/                    # Next.js App Router pages
├── analyze/            # Upload + report flow
├── api/                # API routes
├── auth/               # Sign in page
├── dashboard/          # User dashboard
├── og/                 # OG image generation
├── layout.tsx          # Root layout
└── page.tsx            # Landing page
components/             # Shared components
├── ui/                 # Button, Card, Input, Label, Progress
├── layout/             # Header, Footer
├── pricing/            # Pricing section
├── report/             # Share buttons, PDF export
├── animations.tsx      # Framer Motion wrappers
├── providers.tsx       # Session + Query + PostHog
└── service-worker-register.tsx
hooks/                  # use-localization, use-analysis, use-checkout
lib/                    # auth, i18n, prisma, stripe, utils
messages/               # en.json, zh.json
prisma/                 # Schema + generated client
public/                 # Static assets, icons, sw.js
types/                  # TypeScript types
scripts/                # Icon generation script
```

## Deployment

Optimized for Vercel. Push to `main` and Vercel auto-deploys.

```bash
vercel --prod
```

## License

Private — All rights reserved.
