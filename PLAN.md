# Perfect Home (完美家居) — Product Design Plan

## 1. Business Concept

**Core Service:** AI-powered floor plan diagnostic tool that identifies structural, flow, lighting, and Feng Shui problems — no sugar-coating, only actionable issues.

**Tagline:** 只讲问题，不讲空话 (Only problems, no empty talk)

**Target Users:**
- Home buyers/renters evaluating a property
- Current homeowners looking to optimize
- Real estate agents providing added value

**Pain Point Solved:** When buying/renting, everyone amplifies the pros. This service exposes the cons — ensuring you know what you're living with for years.

---

## 2. Product Flow

```
User uploads floor plan → AI analyzes 8 categories → Diagnostic report generated → Infographic export
```

**Step-by-step:**
1. User arrives → sees value proposition + sample reports
2. Uploads floor plan (image, CAD, hand-drawn, screenshot)
3. Optionally fills context form: city, direction, floor, external environment, occupants, current issues
4. AI analyzes → identifies problems across 8 categories
5. Report page renders:
   - Annotated floor plan with numbered problem markers
   - Problem list (位置 → 问题 → 因果)
   - Causal chain (A→B→C, so fix D first)
   - Priority matrix (structural → flow → sleep → humidity/lighting → furniture)
   - Specific actionable recommendations
6. User can download/share as infographic (9:16 or 16:9)
7. User can save to history, share on social (WeChat, WhatsApp, etc.)

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Web)                        │
│  Next.js 14 (App Router) + Tailwind CSS + shadcn/ui     │
├─────────────────────────────────────────────────────────┤
│                    API Layer                             │
│  Next.js API Routes / Python FastAPI (separate service) │
├─────────────────────────────────────────────────────────┤
│                    AI Pipeline                           │
│  GPT-4 Vision / Claude Vision → Structured JSON Output  │
│  + Image generation pipeline (Replicate / DALL-E 3)     │
├─────────────────────────────────────────────────────────┤
│                    Storage & Database                    │
│  PostgreSQL (Neon/Supabase) + S3-compatible (R2/Minio)  │
├─────────────────────────────────────────────────────────┤
│                    Auth & Payments                       │
│  Clerk / NextAuth + Stripe (pay-per-use / subscription) │
└─────────────────────────────────────────────────────────┘
```

**Mobile apps** (Phase 2): React Native (code-share with web), then native wrappers for iOS/Android.

---

## 4. Tech Stack

### Web (Phase 1 — MVP)
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14 (App Router)** | SSR, SEO, API routes, file uploads |
| Styling | **Tailwind CSS v4** | Rapid UI, consistent design system |
| UI Components | **shadcn/ui** | Accessible, customizable, professional |
| State | **Zustand + React Query** | Lightweight, server-state caching |
| Forms | **React Hook Form + Zod** | Validation, type safety |
| Auth | **NextAuth.js / Clerk** | Social login, session management |
| DB ORM | **Prisma** | Type-safe, migrations |
| Database | **Neon (PostgreSQL)** | Serverless, branching |
| Storage | **Cloudflare R2** | S3-compatible, no egress fees |
| AI Vision | **GPT-4 Vision / Claude 3.5 Sonnet** | Floor plan analysis |
| Image Gen | **Replicate (SDXL/FLUX) + custom overlay** | Infographic generation |

### Mobile (Phase 2)
- **React Native** (code reuse from web)
- Camera integration for real-time floor plan photo
- Offline draft support
- Push notifications for report completion

---

## 5. Data Model

### Core Entities

```
User
├── id: UUID
├── email: String
├── name: String
├── avatar_url: String?
├── subscription_tier: Enum(FREE, PRO, ENTERPRISE)
├── credits_remaining: Int
├── created_at: DateTime
└── updated_at: DateTime

FloorPlan
├── id: UUID
├── user_id: UUID? (nullable for anonymous)
├── image_url: String (original upload)
├── thumbnail_url: String
├── context: JSON {
│     city?: string,
│     district?: string,
│     direction?: string,       // 入户门朝向
│     balcony_direction?: string,
│     floor?: number,
│     total_floors?: number,
│     external_environment?: string[], // 路,桥,医院,学校
│     occupants?: number,
│     current_issues?: string[], // 睡眠,健康,事业
│     renovation_scope?: string // 可调家具/小改/不动水电
│   }
├── status: Enum(PENDING, ANALYZING, COMPLETED, FAILED)
├── created_at: DateTime
└── updated_at: DateTime

DiagnosisReport
├── id: UUID
├── floor_plan_id: UUID (1:1)
├── title: String // "户型问题诊断图"
├── direction_assumption: String? // "上北下南，左西右东"
├── problems: JSON[{
│     id: String,           // "01"
│     zone: String,         // "入户区"
│     issue: String,        // "开门见厅且无缓冲"
│     consequence: String,  // "隐私弱，气流过快"
│     category: Enum(ENTRANCE, FLOW, LIVING_ROOM, BEDROOM, KITCHEN, BATHROOM, LIGHTING, STORAGE, FENG_SHUI)
│     severity: Int,        // 1-5
│     position: {x, y}      // marker position on floor plan
│   }]
├── causal_chain: String    // "入户无缓冲→视线气流直泄→客厅空散感→应先补玄关"
├── priorities: JSON[{
│     level: Int,           // 1-4
│     title: String,        // "入户缓冲"
│     description: String
│   }]
├── recommendations: JSON[{
│     zone: String,         // "玄关"
│     action: String,       // "增加半高柜、地毯或屏风"
│     effect: String,       // "让入户视线先停一下"
│     cost: Enum(LOW, MEDIUM, HIGH)
│   }]
├── bottom_line: String     // "门一泄，厅就散；卧不稳，人难安。"
├── infographic_urls: JSON { portrait, landscape }
├── raw_ai_response: JSON   // for debug/improvement
├── created_at: DateTime
└── updated_at: DateTime

AnalysisJob
├── id: UUID
├── floor_plan_id: UUID
├── status: Enum(QUEUED, PROCESSING, COMPLETED, FAILED)
├── progress: Int           // 0-100
├── error_message: String?
├── started_at: DateTime?
├── completed_at: DateTime?
└── created_at: DateTime
```

---

## 6. Page Structure & Component Tree

### Web Pages

```
/                    → Landing page
/analyze             → Upload flow (upload + context form)
/analyze/result/:id  → Full diagnostic report
/dashboard           → User history
/pricing             → Subscription plans
/how-it-works        → Educational / trust builder
/about               → About the service
```

### Key Components

```
Layout
├── Header
│   ├── Logo
│   ├── Nav (分析, 历史, 定价)
│   ├── UserMenu / LoginButton
│   └── LanguageSwitch (zh/en)
├── Footer
└── (per page)

Landing Page
├── HeroSection (value prop + CTA)
├── SampleReports (carousel of sample1-5)
├── HowItWorks (3-step: 上传→分析→报告)
├── Testimonials
└── PricingPreview

Analyze Page (multi-step form)
├── StepIndicator (4 steps)
├── Step1: UploadFloorPlan
│   ├── DragDropZone
│   ├── ImagePreview
│   └── CameraCapture (mobile)
├── Step2: ContextForm
│   ├── DirectionInput (compass widget)
│   ├── LocationInput (city/district)
│   ├── ExternalEnvironment (multi-select)
│   ├── OccupantsInput
│   └── CurrentIssues (multi-select)
├── Step3: Review & Confirm
│   ├── ImageSummary
│   ├── ContextSummary
│   └── SubmitButton
└── Step4: AnalysisProgress
    ├── ProgressBar
    ├── StatusMessages (抽取户型结构→分析问题→生成报告)
    └── CancelButton

Report Page
├── ReportHeader
│   ├── Title
│   ├── Date
│   ├── DownloadButtons (PNG/PDF, 9:16/16:9)
│   └── ShareButtons
├── AnnotatedFloorPlan (canvas/svg)
│   ├── FloorPlanImage
│   ├── ProblemMarkers (numbered, clickable)
│   ├── FunctionZones (colored overlays)
│   └── DirectionIndicator
├── ProblemList
│   └── ProblemCard × N
│       ├── NumberedBadge
│       ├── ZoneLabel
│       ├── IssueText
│       └── ConsequenceText
├── CausalChain (flow diagram)
├── PriorityMatrix
│   └── PriorityCard × 4
│       ├── Level
│       ├── Title
│       └── Description
├── RecommendationsList
│   └── RecCard × N
│       ├── Zone
│       ├── Action
│       ├── Effect
│       └── CostIndicator
├── BottomLine (big quote card)
└── VerificationSection
    ├── DataSourceDisclaimer
    └── UserGuidance (7天/21天观察)
```

---

## 7. AI Pipeline Design

```
Step 1: Floor Plan Understanding
─────────────────────────────────
Input:  User's floor plan image + context
Model:  GPT-4 Vision / Claude 3.5 Sonnet
Output: Structured JSON (room layout, dimensions, doors, windows, direction)

Step 2: Problem Diagnosis
─────────────────────────────────
Input:  Floor plan structure + DiagnosisPrompt (from perfect_home.txt)
Model:  GPT-4 / Claude 3.5 Sonnet
Output: Structured problems[], causal_chain, priorities[], recommendations[], bottom_line

Step 3: Infographic Generation
─────────────────────────────────
Method A: Data-driven SVG/HTML→Image rendering (recommended — full control)
  - Layout engine renders the diagnostic template
  - Places problem markers at calculated positions
  - Generates high-res PNG/PDF

Method B: AI image generation (Replicate SDXL / DALL-E 3)
  - Prompt-engineered from structured output
  - Less precise but more "designed" look

Recommended: Hybrid
  - Use Method A for the interactive web report
  - Use Method B (or controlled pipeline) for downloadable infographic
```

---

## 8. Visual Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#F5F0EB` | Cream white background |
| `bg-card` | `#EDE8E1` | Card surfaces |
| `text-primary` | `#2C2C2C` | Main text |
| `text-secondary` | `#6B6B6B` | Secondary text |
| `accent-soft` | `#C4B8A8` | Muted beige accents |
| `problem-low` | `#8B8B8B` | Low severity |
| `problem-mid` | `#A0522D` | Medium severity (sienna) |
| `problem-high` | `#8B2500` | High severity (dark red) |
| `accent-blue` | `#2C4A5A` | Ink blue highlights |

### Typography
- Headings: Noto Serif SC / Playfair Display (衬线)
- Body: Noto Sans SC / Inter (无衬线)

### Visual Style
- Generous whitespace
- Thin border lines (1px)
- Subtle shadow / paper texture
- Clean grid layouts
- Problem markers as numbered circles (dark red)
- Zone overlays as semi-transparent low-saturation fills

---

## 9. Implementation Roadmap

### Phase 1: Web MVP (Weeks 1-4)
- [ ] Project scaffold (Next.js + Tailwind + shadcn/ui + Prisma)
- [ ] Database schema + migrations
- [ ] Landing page with sample showcase
- [ ] Upload flow (drag-drop + context form)
- [ ] AI pipeline integration (Vision → Diagnosis)
- [ ] Interactive report page
- [ ] Auth (email + social login)
- [ ] User dashboard / history
- [ ] Infographic PNG download
- [ ] Basic credit system

### Phase 2: Web Polish (Weeks 5-6)
- [ ] Stripe subscription integration
- [ ] Share to WeChat / WhatsApp
- [ ] PDF export
- [ ] SEO optimization
- [ ] i18n (EN version)
- [ ] Performance optimization
- [ ] Analytics (Plausible / PostHog)

### Phase 3: Mobile Apps (Weeks 7-10)
- [ ] React Native project setup
- [ ] Camera capture for floor plan
- [ ] Offline draft support
- [ ] Push notifications
- [ ] App Store / Play Store submission

---

## 10. Business Model

| Tier | Price | Credits | Features |
|------|-------|---------|----------|
| Free | ¥0 | 2 / month | Basic diagnosis, watermark |
| Pro | ¥29 / month | 20 / month | Full report, no watermark, PDF |
| Enterprise | Custom | Unlimited | API access, branding, team |

**Pay-per-use:** ¥19.9 per diagnosis (no subscription)

---

## 11. Key Technical Decisions

1. **Anonymous-first upload**: Allow upload without login → prompt at result screen to save
2. **Async processing**: Queue-based analysis with polling (WebSocket for progress)
3. **Hybrid infographic**: SVG-based interactive report + AI-generated downloadable image
4. **Image security**: Auto-orient, strip EXIF, virus scan uploads
5. **Caching**: Report caching (same floor plan → reuse diagnosis)
6. **Rate limiting**: Max 3 concurrent analyses per user
