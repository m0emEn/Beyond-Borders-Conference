# Implementation Plan — Premium Admin Dashboard System

We will implement a premium, high-impact **Admin Command Center** for the Beyond Borders Conference. Designed for the AIESEC Organizing Committee, it acts as the centralized brain for managing all operations, registrations, logistics, finance, programs, and risk management.

---

## 1. User Review Required

> [!IMPORTANT]
> **Database Synchronicity**: We will add Prisma models for Tasks, Campaigns, Sponsors, Income/Expenses, Logistics, Risks, Feedback, and OC Members. We will execute `npm run db:push` to apply these database extensions.
> To ensure robustness, the dashboard views will utilize standard fallback mock generators. If the Postgres instance is offline or credentials fail, the UI will degrade gracefully to memory/session-based local caching, maintaining a fully functional showcase state.

> [!TIP]
> **Aesthetic Design Choice - Premium SVG Charts**: Next.js 14 App Router frequently experiences hydration warnings or sizing glitches when rendering standard charting libraries like Recharts due to server-side rendering (SSR) of dynamic canvas elements. 
> To deliver a stunning, visually superior, and 100% fluid responsive experience, we propose utilizing bespoke, hand-crafted **SVG Glassmorphic Charts** (area, bar, radial, line) styled with exact Tailwind gradients, floating cyber-glow borders, and animated path reveals. This ensures optimal rendering, high performance, and absolute alignment with the dark mode/glassmorphic look.

---

## 2. Proposed Changes

We will introduce a password-protected admin hub under `/admin` using a shared premium sidebar layout system. We will also expand the database model coverage in the Prisma schema.

### Database Component

#### [MODIFY] [schema.prisma](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/prisma/schema.prisma)
Extend the database schema to include relational tables for OC Members, Tasks, Sponsors, Finances, Logistics Items, Risks, and Feedback, matching AIESEC roles and tracking needs.

```prisma
// Extended database structures in schema.prisma

enum OCRole {
  ADMIN
  OCP
  OCVP
  OC_MEMBER
}

enum OCDepartment {
  LOGISTICS
  FINANCE
  MARKETING
  EXPERIENCE
  PROGRAM
  GENERAL
}

model OCMember {
  id                    String                 @id @default(cuid())
  fullName              String
  email                 String                 @unique
  role                  OCRole                 @default(OC_MEMBER)
  department            OCDepartment           @default(GENERAL)
  avatar                String?
  tasks                 Task[]                 @relation("AssignedTasks")
  campaigns             Campaign[]
  risks                 Risk[]
  logistics             LogisticsItem[]
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  @@map("oc_members")
}

model Task {
  id                    String                 @id @default(cuid())
  title                 String
  description           String?
  assignedToId          String?
  assignedTo            OCMember?              @relation("AssignedTasks", fields: [assignedToId], references: [id], onDelete: SetNull)
  deadline              DateTime
  priority              TaskPriority           @default(MEDIUM)
  status                TaskStatus             @default(PENDING)
  department            OCDepartment           @default(GENERAL)
  notes                 String?
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  @@map("tasks")
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  DELAYED
}

model Sponsor {
  id                    String                 @id @default(cuid())
  companyName           String
  contactPerson         String
  email                 String?
  phone                 String?
  outreachStatus        SponsorStatus          @default(CONTACTED)
  sponsorshipPackage    SponsorPackage         @default(BRONZE)
  contributionAmount    Float                  @default(0.0)
  deliverables          String[]
  brandingObligations   String?
  followUpDate          DateTime?
  notes                 String?
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  @@map("sponsors")
}

enum SponsorStatus {
  CONTACTED
  MEETING_SCHEDULED
  NEGOTIATING
  CONFIRMED
  REJECTED
}

enum SponsorPackage {
  BRONZE
  SILVER
  GOLD
  PLATINUM
  CUSTOM
}

model Campaign {
  id                    String                 @id @default(cuid())
  title                 String
  platform              MarketingPlatform
  status                CampaignStatus         @default(DRAFT)
  publishDate           DateTime?
  reach                 Int                    @default(0)
  engagement            Int                    @default(0)
  clicks                Int                    @default(0)
  conversions           Int                    @default(0) // Registrations generated
  audienceGrowth        Int                    @default(0)
  notes                 String?
  ownerId               String?
  owner                 OCMember?              @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  @@map("campaigns")
}

enum MarketingPlatform {
  INSTAGRAM_POST
  INSTAGRAM_STORY
  INSTAGRAM_REEL
  PARTNERSHIP
  AMBASSADOR
  EMAIL_CAMPAIGN
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  PAUSED
}

model FinancialTransaction {
  id                    String                 @id @default(cuid())
  type                  TransactionType
  category              TransactionCategory
  amount                Float
  date                  DateTime               @default(now())
  description           String?
  createdAt             DateTime               @default(now())

  @@map("financial_transactions")
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum TransactionCategory {
  REGISTRATIONS
  SPONSORSHIPS
  PARTNERSHIPS
  MERCHANDISE
  EXTERNAL_SUPPORT
  VENUE
  TRANSPORTATION
  ACCOMMODATION
  MEALS
  MATERIALS
  MARKETING
  MEDIA
  EMERGENCY_FUND
  OTHER
}

model LogisticsItem {
  id                    String                 @id @default(cuid())
  item                  String
  category              LogisticsCategory
  quantity              Int                    @default(1)
  assignedToId          String?
  assignedTo            OCMember?              @relation(fields: [assignedToId], references: [id], onDelete: SetNull)
  status                LogisticsStatus        @default(PENDING)
  notes                 String?
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  @@map("logistics_items")
}

enum LogisticsCategory {
  ACCOMMODATION
  TRANSPORTATION
  MEALS
  MATERIALS
  TECHNICAL_EQUIPMENT
  VENUE_SETUP
  OTHER
}

enum LogisticsStatus {
  PENDING
  ORDERED
  RECEIVED
  READY
}

model Risk {
  id                    String                 @id @default(cuid())
  title                 String
  category              RiskCategory
  probability           Int                    @default(1) // 1 - 5
  impact                Int                    @default(1) // 1 - 5
  preventionStrategy    String
  contingencyPlan       String
  ownerId               String?
  owner                 OCMember?              @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  mitigated             Boolean                @default(false)
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  @@map("risks")
}

enum RiskCategory {
  FINANCIAL
  OPERATIONAL
  LOGISTICS
  TECHNICAL
  EXPERIENCE_DELIVERY
  SAFETY
  LOW_REGISTRATIONS
  FACILITATOR_CANCELLATION
}

model FeedbackSurvey {
  id                    String                 @id @default(cuid())
  delegateSatisfaction  Int                    @default(5) // 1 - 5
  sessionRating         Int                    @default(5)
  facilitatorRating     Int                    @default(5)
  logisticsRating       Int                    @default(5)
  overallScore          Int                    @default(5)
  comments              String?
  createdAt             DateTime               @default(now())

  @@map("feedback_surveys")
}
```

---

### UI Core Layout

We will create a stunning, responsive cyber-mesh dashboard frame. The workspace is enveloped in deep neon gradients, frosted-glass backdrops (`backdrop-blur-md`), and glowing status states.

#### [NEW] [layout.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/layout.tsx)
Builds the core Admin navigation shell. It features:
* A collapsible premium left sidebar containing high-contrast action icons for each of the dashboard systems.
* A contextual header housing the conference countdown ticker, an active **OC Member simulated persona selector**, and a simulated **Role Permission selector** (Admin, OCP, OCVP, OC Member) which triggers structural permission constraints globally.
* Instant, smooth routing transition states.

#### [NEW] [login/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/login/page.tsx)
A gorgeous immersive static credentials gateway utilizing responsive security code entry fields and floating ambient lights.

---

### Dashboard Modules

We will modularize all 15 operational systems into separate page routing layers to ensure clean code segregation and maintainability:

```
app/admin/
├── page.tsx               # 1. Central Operational Command Overview (Metrics, SVG charts)
├── timeline/page.tsx      # 2. Project Task Tracker (Kanban, Gantt-Timeline, Calendar, Grid)
├── finances/page.tsx      # 3. Financial Tracker (P&L ledger, sponsor logs, break-even visualizer)
├── delegates/page.tsx     # 4. Delegate Registry (Payment status review, Room/Bus manager, Export utilities)
├── facilitators/page.tsx  # 5. Facilitator Reviews (Session proposal vetting & rating portal)
├── sessions/page.tsx      # 6. Session Scheduler (Thematic timeline, capacity limits, calendar scheduler)
├── marketing/page.tsx     # 7. Marketing Campaign conversion analytics, social post calendars
├── sponsorship/page.tsx   # 8. Sponsorship CRM Outreach Pipeline (CRM cards, contribution trackers)
├── logistics/page.tsx     # 9. Logistics Board (Accommodation lists, room assignments, checklists)
├── risks/page.tsx         # 10. Risk Management Heatmap (Interactive Risk Matrix card creation)
├── oc/page.tsx            # 11. OC Performance Matrix (KPI trackers, workload load analytics)
├── feedback/page.tsx      # 12. Delegate Feedback Sentiment & Survey review charts
├── media/page.tsx         # 13. Content Operations (Publishing pipelines for photo/video briefs)
└── announcements/page.tsx # 14. CMS Updates Publisher (Category selection, priority/pin updates)
```

#### [NEW] [page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/page.tsx)
*Central Dashboard Command Center*: Renders high-end animated numeric widgets (KPI counters), a live countdown clock, a multi-department summary visualizer, and custom Area & Bar chart containers displaying:
1. Registrations over time.
2. Financial actuals (Revenue vs Expenses vs remaining budget).
3. Nationality breakdown map/grid.

#### [NEW] [timeline/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/timeline/page.tsx)
*Operations Timeline Tracker*: Features a dynamic view toggle (Kanban Board cards / Gantt-style timeline rows / Calendar grid / Grid Table). Users can move, add, edit, or filter tasks by priority, department, and assigned owner.

#### [NEW] [finances/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/finances/page.tsx)
*Financial System*: Contains budget ledger inputs, actual cashflow analytics, and an interactive **Break-even calculator**. Includes warning alarms for high burn rates or delayed sponsorships.

#### [NEW] [delegates/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/delegates/page.tsx)
*Delegate Registry*: Displays a detailed grid of all registrants with dynamic searching. Features:
* Reviewing uploaded proof-of-payment.
* Approving/Rejecting registrations.
* Assigning hotel rooms and airport transportation buses.
* Simulated CSV/PDF list export buttons.

#### [NEW] [facilitators/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/facilitators/page.tsx)
*Facilitator application tracker*: Previews details of candidate session profiles, nationalities, experience logs, and workshop objectives. Integrates a scoring review modal and status controllers (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`).

#### [NEW] [sessions/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/sessions/page.tsx)
*Session Scheduling Matrix*: Supports assigning rooms, capacity ceilings, category tags, and session scheduling blocks, displaying visual warning banners if duration conflicts or rooms are over capacity.

#### [NEW] [marketing/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/marketing/page.tsx)
*Marketing Conversions*: Monitors active marketing briefs (Instagram, Email campaigns) and tracks engagement rates and delegate sign-up conversions.

#### [NEW] [sponsorship/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/sponsorship/page.tsx)
*Outreach pipeline CRM*: Shows outreach cards mapped to funnel categories (`Contacted` -> `Scheduled` -> `Negotiating` -> `Confirmed` -> `Rejected`). Integrates sponsorship targets vs actual trackers.

#### [NEW] [logistics/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/logistics/page.tsx)
*Logistics Hub*: Integrates meal planning, supply checklists, equipment inventory tracker, and setup checklists.

#### [NEW] [risks/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/risks/page.tsx)
*Risk Mitigation Heatmap*: Incorporates an interactive **Risk Probability vs Impact Heatmap** (5x5 matrix). Users map and position operational, technical, or financial risks into color-coded heat tiles, with mitigation strategy editors.

#### [NEW] [oc/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/oc/page.tsx)
*OC Accountability Panel*: Displays workload allocation widgets and department throughput statistics.

#### [NEW] [feedback/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/feedback/page.tsx)
*Feedback & Ratings Dashboard*: Visualizes event satisfaction metrics, food/logistics evaluation scores, and comment summaries.

#### [NEW] [media/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/media/page.tsx)
*Content Tracker*: Centralizes photographer briefs, recap editing status, and countdown deadlines for visual promos.

#### [NEW] [announcements/page.tsx](file:///c:/Users/admin/Documents/aiesec/Beyond%20Borders/website/Beyond-Borders-Conference/app/admin/announcements/page.tsx)
*CMS Publisher*: Incorporates draft setups, pinning controls, update streams, and emergency notice alerts.

---

## 3. Verification Plan

### Automated Verification
1. Execute `npm run db:push` to ensure schema integrity is successfully extended and validated in Prisma.
2. Compile the application using `npm run build` to guarantee there are no TypeScript, bundler, or page-routing inconsistencies.
3. Run `npm run lint` to enforce clean styling, formatting, and structural guidelines.

### Manual Verification
1. We will verify the admin access flow by trying to view pages (redirecting correctly to `/admin/login` or loading authenticated content).
2. We will test the sidebar navigation, layout responsiveness on laptop/tablet bounds, modal operations, and task filter toggles.
3. We will toggle the simulated "Active Profile" (e.g. Finance VP) and "Access Permission" (e.g. OC Member) widgets, confirming that read/write barriers and menus successfully shift according to security profiles.
