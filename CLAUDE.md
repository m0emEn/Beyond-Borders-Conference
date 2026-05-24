# CLAUDE.md — Beyond Borders Conference (MVP Edition)

> This file is the single source of truth for any AI agent or developer working on this project.
> Read it fully before writing a single line of code.

---

## 0. Project Identity

| Field | Value |
|---|---|
| **Project name** | Beyond Borders Conference |
| **Organizer** | AIESEC in Bizerte |
| **Audience** | Exchange Participants (EPs) — international youth |
| **Edition** | First-time summer conference |
| **Purpose** | Leadership, cultural exchange, personal growth |
| **Tone** | Premium · International · Energetic · Youthful |

---

## 1. Tech Stack (Simplified MVP)

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | SSR + SSG, fast, type-safe route boundaries, SEO-friendly |
| Language | **TypeScript** (strict mode) | Type safety across the entire application |
| Styling | **Tailwind CSS v3** | Utility-first with curated custom CSS variables |
| Animation | **Framer Motion** | Complex transition states, page fade-ins, and pop-layout modals |
| Icons | **Lucide React** | Sleek, consistent modern vector icons |
| Validation | **Zod** | Schema definition and strict runtime type verification |
| Charts & KPIs | **Recharts** | Fully responsive SVG charts for the Department Command Centers |
| Toasts | **Sonner** | Clean, responsive modern visual feedback triggers |
| Dates | **date-fns** | Date calculations and timezone management |

### Backend & Database
| Layer | Choice | Reason |
|---|---|---|
| Runtime | **Node.js 20 LTS** | Stable backend server execution environment |
| API Layer | **Next.js Route Handlers & Safe Actions** | Type-safe Server Actions (`next-safe-action`) & REST endpoints |
| Database | **PostgreSQL** via **Supabase** | Cloud-hosted secure relational database |
| ORM | **Prisma** | Modern database client mapping, migrations, and schema definition |
| Uploads | **UploadThing** | Direct-to-storage secure upload gateway for PDFs and payment proofs |
| Email | **Resend REST API** | Rapid transactional registration updates dispatched via native fetch requests |
| Check-in | **qrcode & react-qr-reader** | Dynamic QR code generation & client-side scanner logic |

### Authentication & Phase Status
*   **Public Access**: Completely public! EPs can submit registrations without creating an account.
*   **Admin Panel [FULLY OPERATIONAL]**: Protected admin dashboard for AIESEC Organizing Committee members. Features secure credential authentication with `bcryptjs` password hashing, root Next.js proxy routing protection via a secure `admin_session` cookie, role-based clearance limits, dynamic sidebar link filtering, and simulated debugging profiles.

---

## 2. Repository Structure

```
beyond-borders/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing pages
│   │   ├── layout.tsx            # Wraps pages with Navigation & Footer
│   │   ├── page.tsx              # Landing page (combines all section previews)
│   │   ├── about/page.tsx        # Pillar overview page
│   │   ├── agenda/page.tsx       # Timeline schedule [Phase 2 placeholder / Coming Soon]
│   │   ├── announcements/page.tsx # Notification updates stream (renders feed preview)
│   │   ├── contact/page.tsx      # Contact details & direct AIESEC entity info
│   │   ├── cultural-night/page.tsx # Immersive 'One Global Night' timeline & rules page
│   │   ├── facilitators/page.tsx  # Facilitators listing page [Phase 2 placeholder / Coming Soon]
│   │   ├── faq/page.tsx          # FAQ interactive accordion
│   │   ├── gallery/page.tsx      # Media gallery highlights [Phase 2 placeholder / Coming Soon]
│   │   ├── register/page.tsx     # Public registration form (multi-step wizard)
│   │   └── sessions/page.tsx     # Session list (renders sessions preview)
│   ├── api/                      # Backend route handlers
│   │   ├── register/             # Public registration API endpoint (POST)
│   │   └── facilitators/apply/   # Facilitator application API endpoint (POST)
│   ├── layout.tsx                # Root layout (fonts & meta configurations)
│   └── globals.css               # Core styling systems & HSL design tokens
├── components/
│   ├── ui/                       # Reusable visual atoms
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ComingSoon.tsx
│   │   ├── Countdown.tsx
│   │   └── PageHeader.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/                 # Landing page content modules
│       ├── About.tsx
│       ├── CulturalNightTeaser.tsx
│       ├── FAQ.tsx
│       ├── FacilitatorsPreview.tsx
│       ├── FeedPreview.tsx
│       ├── Hero.tsx
│       └── SessionsPreview.tsx
├── lib/
│   ├── prisma.ts                 # Prisma singleton client setup
│   ├── motion.ts                 # Framer Motion transition presets
│   ├── utils.ts                  # Tailwind class mergers (clsx + tailwind-merge)
│   └── constants.ts              # Global app constants (navigation, organizers, etc.)
├── hooks/
│   └── useCountdown.ts           # Hero countdown calculation hook
├── prisma/
│   ├── schema.prisma             # PostgreSQL Database schema
│   └── seed.ts                   # Seeds standard demo records
├── types/
│   └── index.ts                  # Type configurations
├── proxy.ts                      # Secure route proxy / authentication checks
```

---

## 3. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model Registration {
  id                   String             @id @default(cuid())
  delegateId           String             @unique // Format: "BBC-2026-XXXX"
  fullName             String
  email                String             @unique
  phone                String
  nationality          String
  gender               String
  universityOccupation String
  emergencyName       String
  emergencyPhone      String
  dietaryPrefs        String[]
  arrivalDate         DateTime?
  departureDate       DateTime?
  motivation          String
  paymentStatus       PaymentStatus      @default(PENDING)
  paymentProof        String?            // URL of optional uploaded proof
  status              RegistrationStatus @default(PENDING)
  termsAccepted       Boolean            @default(true)
  checkInAt           DateTime?
  qrToken             String             @unique @default(cuid())
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  @@map("registrations")
}

enum PaymentStatus {
  PENDING
  UPLOADED
  CONFIRMED
  REJECTED
}

enum RegistrationStatus {
  PENDING
  APPROVED
  REJECTED
  CHECKED_IN
}

model FacilitatorApplication {
  id                 String            @id @default(cuid())
  fullName           String
  email              String
  nationality        String
  experience         String
  sessionTitle       String
  sessionCategory    String
  sessionObjectives  String
  duration           Int               // Minutes (30/45/60/90)
  interactiveMethods String
  materialsNeeded    String?
  motivation         String
  sessionPlanUrl     String?           // Optional plan PDF URL
  status             ApplicationStatus @default(PENDING)
  reviewNotes        String?
  reviewedAt         DateTime?
  createdAt          DateTime          @default(now())

  @@map("facilitator_applications")
}

enum ApplicationStatus {
  PENDING
  UNDER_REVIEW
  APPROVED
  REJECTED
}

model Post {
  id        String   @id @default(cuid())
  type      PostType @default(ANNOUNCEMENT)
  title     String?
  content   String
  mediaUrl  String?
  tags      String[]
  pinned    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

enum PostType {
  ANNOUNCEMENT
  PROMO
  SPEAKER_SPOTLIGHT
  COUNTDOWN
  UPDATE
  REMINDER
}

model Session {
  id          String          @id @default(cuid())
  title       String
  description String
  objectives  String[]
  category    SessionCategory
  day         Int
  startTime   DateTime
  endTime     DateTime
  location    String
  capacity    Int?
  tags        String[]
  status      SessionStatus   @default(DRAFT)
  createdAt   DateTime        @default(now())

  @@map("sessions")
}

enum SessionCategory {
  LEADERSHIP
  CULTURAL_EXCHANGE
  PERSONAL_DEVELOPMENT
  REFLECTION
  NETWORKING
  WORKSHOP
  KEYNOTE
  ACTIVITY
}

enum SessionStatus {
  DRAFT
  PUBLISHED
  CANCELLED
}

model AgendaItem {
  id          String   @id @default(cuid())
  title       String
  description String?
  day         Int
  startTime   DateTime
  endTime     DateTime
  location    String
  category    String?
  createdAt   DateTime @default(now())

  @@map("agenda_items")
}

model Facilitator {
  id             String   @id @default(cuid())
  fullName       String
  email          String   @unique
  nationality    String
  bio            String?
  profilePicture String?
  createdAt      DateTime @default(now())

  @@map("facilitators")
}

model GalleryMedia {
  id        String    @id @default(cuid())
  url       String
  type      MediaType @default(IMAGE)
  caption   String?
  featured  Boolean   @default(false)
  createdAt DateTime  @default(now())

  @@map("gallery_media")
}

enum MediaType {
  IMAGE
  VIDEO
}

// ─── OC MEMBERS & ROLES ───
enum OCRole {
  OCP
  OCVP_DXP
  OCVP_MKT
  OCVP_FINANCE
  OCVP_LOG_ER
  OC_DXP_MEMBER
  OC_MKT_MEMBER
  OC_LOG_ER_MEMBER
}

enum OCDepartment {
  DXP
  MKT
  FINANCE
  LOG_ER
  GENERAL
}

model OCMember {
  id                    String         @id @default(cuid())
  fullName              String
  email                 String         @unique
  passwordHash          String
  role                  OCRole
  department            OCDepartment   @default(GENERAL)
  avatar                String?
  managerId             String?
  createdAt             DateTime       @default(now())
}

// ─── TIMELINE TASKS ───
model Task {
  id                    String         @id @default(cuid())
  title                 String
  description           String?
  assignedToId          String?
  createdById           String?
  reviewedById          String?
  deadline              DateTime
  priority              TaskPriority   @default(MEDIUM)
  status                TaskStatus     @default(PENDING)
  department            OCDepartment   @default(GENERAL)
  progressNotes         String?
}

// ─── SPONSORS & OUTREACH ───
model Sponsor {
  id                    String         @id @default(cuid())
  companyName           String
  contactPerson         String
  email                 String?
  phone                 String?
  outreachStatus        SponsorStatus  @default(CONTACTED)
  sponsorshipPackage    SponsorPackage @default(BRONZE)
  contributionAmount    Float          @default(0.0)
  deliverables          String[]
  notes                 String?
}

// ─── MARKETING CAMPAIGNS ───
model Campaign {
  id                    String            @id @default(cuid())
  title                 String
  platform              MarketingPlatform
  status                CampaignStatus    @default(DRAFT)
  reach                 Int               @default(0)
  clicks                Int               @default(0)
  conversions           Int               @default(0)
}

// ─── FINANCIAL TRANSACTIONS ───
model FinancialTransaction {
  id                    String              @id @default(cuid())
  type                  TransactionType
  category              TransactionCategory
  amount                Float
  date                  DateTime            @default(now())
}

// ─── LOGISTICS ITEMS ───
model LogisticsItem {
  id                    String            @id @default(cuid())
  item                  String
  category              LogisticsCategory
  quantity              Int               @default(1)
  status                LogisticsStatus   @default(PENDING)
}

// ─── RISK MANAGEMENT ───
model Risk {
  id                    String       @id @default(cuid())
  title                 String
  category              RiskCategory
  probability           Int          @default(1)
  impact                Int          @default(1)
  preventionStrategy    String
  contingencyPlan       String
  mitigated             Boolean      @default(false)
}

// ─── FEEDBACK SURVEYS ───
model FeedbackSurvey {
  id                    String   @id @default(cuid())
  delegateSatisfaction  Int      @default(5)
  overallScore          Int      @default(5)
  comments              String?
}
```

---

## 4. Key Feature Specifications

### 4.1 Public Stepper Registration System (`/register`) [FULLY OPERATIONAL]
*   **Experience**: Premium, high-end multi-step progress stepper wizard powered by Framer Motion.
*   **Steps & Form Fields**:
    1. **Profile**: Full Name, Email, Phone, Gender, Nationality, and University or Occupation details.
    2. **Expectations & Contacts**: Motivations to attend, Emergency contact full name, and Emergency contact phone number.
    3. **Logistics & Diet**: Dietary preferences tags selection (Vegetarian, Vegan, Gluten-Free, Halal, Lactose-Free), exact arrival date/time, and exact departure date/time.
    4. **Payment Proof**: Bank details of AIESEC in Tunisia (BNA bank transfer Rib), optional receipt file upload/URL field, and data processing terms & conditions acceptance checkbox.
*   **Form Validation**: Strict client-side verification per step to ensure essential fields are properly filled.
*   **On Submission**:
    1. Direct POST request containing form payload is processed by `/api/register`.
    2. Duplication guard verifies if the email has already been registered.
    3. Generates unique sequential Internal Delegate ID (e.g. `BBC-2026-0001`) by polling existing record counts.
    4. Saves record to `Registration` table with default `PENDING` registration status.
    5. Dispatches formatted confirmation email directly to the delegate's inbox using **Resend's REST API** (via native `fetch` triggered by `process.env.RESEND_API_KEY`).
    6. Seamlessly redirects to an advanced visual success screen highlighting their generated Delegate ID and manual validation steps.

### 4.2 Facilitator Application Endpoint (`/api/facilitators/apply`) [BACKEND IMPLEMENTED, FRONTEND PLANNED]
*   **Endpoint logic**: An active server POST route processes application payloads (nationality, experience details, session title/objectives, duration, interactive methods, materials, motivation, and PDF plans).
*   **Workflow**: Creates records directly inside the Postgres database under `facilitator_applications` with `status: PENDING`.
*   **Frontend state**: The public `/facilitators` page acts as an information portal with a placeholder explaining that self-serve forms are coming soon in Phase 2, linking to `/contact` for early requests.

### 4.3 Cultural Night Rework: "One Global Night" (`/cultural-night`) [FULLY OPERATIONAL]
*   **Concept**: Shifted from online virtual maps into an immersive physical country booth challenge. Teams of delegates are provided a uniform set of simple tools (markers, tape, flipcharts, scissors) to build interactive spaces displaying their native storytelling, traditional play, music, dances, and foods.
*   **Page Elements**: High-energy presentation illustrating the core challenge pillars, a visual 3-phase timeline breakdown (Assemble & Construct, Open the Gates, secret ballot Vote & Celebration), a booth concept card catalog, and a constraints notice block ("Rules of Engagement" banning digital displays/slides to encourage physical crafting).

### 4.4 Content Previews & Interactive Shells [FULLY OPERATIONAL]
*   **Hero Countdown**: Interactive header featuring a floating emoji background and live countdown timer using a reactive custom ticker hook (`useCountdown`).
*   **FAQ Accordion**: Fully interactive expandable questions panel on `/faq` and the landing page.
*   **Sessions List (`/sessions`)**: Presents a grid of sample curated workshops (e.g. Leadership, Cultural Intelligence, Future-Ready Mindset).
*   **Announcements Feed (`/announcements`)**: Displays visual preview cards mimicking live update notifications to show look and feel.
*   **Placeholder Pages**: Pages like `/agenda` and `/gallery` render standard `<ComingSoon />` modules detailing Phase 2 schedules.

### 4.5 Premium Admin Command Center (Dashboard) [FULLY OPERATIONAL]
*   **Department-Specific Operational Dashboards**: Tailored around AIESEC departments:
    *   **OCP (President)**: Global Command showing totals counters, a responsive custom SVG Area signups trend chart, active logs, and radial gauge indicators.
    *   **OCVP DXP (Delegate Experience)**: Vetting trackers, satisfaction scores gauges, dietary tags counters (e.g., vegetarians/vegans), and application statuses.
    *   **OCVP MKT (Marketing)**: Conversions checker tracking reach/click trends by reel/stories campaigns.
    *   **OCVP FINANCE**: Actual ledgers tracking transaction cash flow and a dynamic break-even slider calculator.
    *   **OCVP LOG&ER (Logistics & External Relations)**: Confirmed sponsorship funnels, meal plan checks, and shuttle bus route ready monitors.
*   **Route Protection & Security Clearances**:
    *   Root Next.js `proxy.ts` intercepts all `/admin/*` routes (except `/admin/login`) and forces redirects on missing `admin_session` cookie, preventing client bundle data leakage.
    *   Shared layout performs role-aware sidebar item filtering.
    *   Attempts to manually access forbidden paths render a glassmorphic **"Security Clearance Insufficient"** card explaining which department owns the panel.
*   **Authenticated Profile Display**: Top bar securely displays the logged-in user's name, department (e.g. DXP, MKT, FINANCE, LOG_ER), and role clearance level.

---

## 5. Development Workflow

The project uses `npm` as its primary package manager. 

```bash
npm run dev              # Launch local Next.js development server
npm run dev:clean        # Clean Next.js cache and launch development server
npm run build            # Compile production-ready optimized build bundle
npm run lint             # Execute ESLint checks
npm run db:generate      # Generate Prisma client bindings
npm run db:push          # Push schema changes to PostgreSQL database
npm run db:migrate       # Apply migrations using dotenv
npm run db:seed          # Seed database with standard demo records
npm run db:studio        # Open interactive Prisma Studio Database GUI
```

---

*Last Refined: Migrated middleware to Next.js 16 proxy convention and resolved hydration mismatch bugs.*
*Maintained by: AIESEC in Tunisia OC Tech Team*