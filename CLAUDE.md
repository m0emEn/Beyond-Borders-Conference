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
| Framework | **Next.js 14 (App Router)** | SSR + SSG, fast, SEO-friendly |
| Language | **TypeScript** (strict mode) | Type safety across the codebase |
| Styling | **Tailwind CSS v3** | Utility-first + custom variables |
| Animation | **Framer Motion** | Fade-ins, transition reveals, hover states |
| Icons | **Lucide React** | Consistent SVG icons |
| Forms | **React Hook Form** + **Zod** | Client/server validation |
| Dates | **date-fns** | Dates and countdown calculation |

### Backend & Database
| Layer | Choice | Reason |
|---|---|---|
| Runtime | **Node.js 20 LTS** | |
| API | **Next.js Route Handlers** | Server-side endpoints |
| Database | **PostgreSQL** via **Supabase** | Cloud hosted relational DB |
| ORM | **Prisma** | Safe database operations & schema generation |
| Email | **Resend** | Fast automated registration email confirmations |

### Authentication & Protection
*   **Guest Access**: Completely public! No registration or NextAuth logins required to submit registrations or facilitator applications.
*   **Admin Access**: Secure, lightweight password-protected dashboard via static env variable (`ADMIN_PASSWORD`) and HTTP-Only session cookies.

---

## 2. Repository Structure

```
beyond-borders/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing pages
│   │   ├── page.tsx              # Landing page
│   │   ├── about/page.tsx        # Pillar overview page
│   │   ├── agenda/page.tsx       # Timeline schedule (Day 1, 2, 3)
│   │   ├── sessions/page.tsx     # Showcase of sessions
│   │   ├── facilitators/page.tsx  # Facilitator list & Apply CTA
│   │   ├── facilitators/apply/page.tsx # Public application form
│   │   ├── cultural-night/page.tsx # Immersive 'One Global Night' page
│   │   ├── announcements/page.tsx # Notification updates stream
│   │   ├── gallery/page.tsx      # Media gallery highlights
│   │   ├── register/page.tsx     # Public registration form
│   │   └── contact/page.tsx      # Contact details
│   ├── admin/                    # Password-protected Admin Panel
│   │   ├── page.tsx              # Admin dashboard metrics
│   │   ├── login/page.tsx        # Static password login form
│   │   ├── registrations/page.tsx # Registration list & approvals
│   │   ├── facilitators/page.tsx  # Facilitator applications tracker
│   │   └── announcements/page.tsx # Create/Edit announcement stream
│   ├── api/                      # Backend route handlers
│   │   ├── register/             # Public registration submissions
│   │   ├── facilitators/apply/   # Public facilitator applications
│   │   ├── announcements/        # Admin posts CRUD
│   │   └── admin/auth/           # Admin static login session handler
│   ├── layout.tsx                # Root layout (fonts/base setup)
│   └── globals.css               # Core styling systems
├── components/
│   ├── ui/                       # Reusable visual atoms
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
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
│   ├── prisma.ts                 # Prisma singleton client
│   ├── motion.ts                 # Framer Motion presets
│   ├── utils.ts                  # Tailwind class merges
│   └── constants.ts              # Global app constants
├── hooks/
│   └── useCountdown.ts           # Hero countdown ticker
├── prisma/
│   ├── schema.prisma             # simplified MVP database entities
│   └── seed.ts                   # Seeds standard demo records
└── types/
    └── index.ts                  # Type overrides
```

---

## 3. Simplified Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model Registration {
  id                  String             @id @default(cuid())
  delegateId          String             @unique // Format: "BBC-2026-XXXX"
  fullName            String
  email               String             @unique
  phone               String
  nationality         String
  gender              String
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
```

---

## 4. Key Feature Specifications

### 4.1 Public Registration System (`/register`)
*   **Experience**: Premium, animated multi-step stepper wizard.
*   **Fields**: Personal details, University/Occupation, Nationality, Gender, dietary selections, emergency contacts, exact arrival/departure times, motivation statement, terms acceptance, and optional payment receipt file attachment.
*   **On Submission**:
    1. Direct POST request containing form payload is processed.
    2. Generates unique Internal Delegate ID (e.g. `BBC-2026-XXXX`).
    3. Saves record to `Registration` table.
    4. Triggers automation email via Resend outlining receipt parameters.
    5. Seamlessly redirects to a custom visual success screen displaying their ID.

### 4.2 Facilitator Application Portal (`/facilitators/apply`)
*   **Experience**: Unified public form containing details regarding personal profiles, nationality, prior facilitation background, title, objectives, time duration select, methods utilized, and optional PDF schedule attachment.
*   **Workflow**: Saves as `PENDING` directly into the database. Accessible by admin dashboard panels for status updates (`UNDER_REVIEW`, `APPROVED`, `REJECTED`).

### 4.3 Cultural Night Rework: "One Global Night"
*   **Concept**: Reworked from static online maps into a physical collaborative challenge. Delegates group by cultural zones and receive basic crafting tools (markers, flipcharts, tape). Under timed conditions, they collaboratively forge an interactive cultural village featuring food, storytelling, music, traditional dances, and audience games.
*   **Page Elements**: High-energy layout, detailed challenge rules, creative booth card concepts, timelines, and gallery mockups showing collaborative cultural exchange.

### 4.4 Announcements & Updates
*   **Overview**: Admin-managed stream for announcements, alerts, speaker profiles, and agenda adjustments.
*   **Social elements removed**: No public comment chains, emoji reaction buttons, or direct profile bookmark states. Keeps clean and fast timelines.

---

## 5. Development Workflow

```bash
pnpm dev              # Launch local Next.js development server
pnpm build            # Production optimized bundle build
pnpm db:generate      # Generate Prisma client bindings
pnpm db:push          # Push schema changes to remote Supabase DB
pnpm db:seed          # Seed standard posts, sessions, and agenda items
```

---

*Last Refined: Architecture and roadmap simplification review.*
*Maintained by: AIESEC in Tunisia OC Tech Team*