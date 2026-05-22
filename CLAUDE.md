# CLAUDE.md — Beyond Borders Conference

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

## 1. Tech Stack

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SSR + SSG, fast, SEO-friendly |
| Language | **TypeScript** (strict mode) | Type safety across a large codebase |
| Styling | **Tailwind CSS v3** + **CSS Modules** for component-level overrides | Utility-first + encapsulated custom styles |
| Animation | **Framer Motion** | Page transitions, scroll reveals, micro-interactions |
| State | **Zustand** (global) + **React Query / TanStack Query** (server state) | Lightweight, predictable |
| Forms | **React Hook Form** + **Zod** (validation) | Multi-step forms with schema validation |
| Icons | **Lucide React** + custom SVGs | Consistent, tree-shakeable |
| Maps | **Mapbox GL JS** | Interactive world map for Cultural Night |
| QR Codes | **qrcode.react** | Delegate ticket QR generation |
| Dates | **date-fns** | Lightweight date manipulation |
| Real-time | **Supabase Realtime** or **Ably** | Live announcements / feed updates |
| Uploads | **Uploadthing** or **Cloudinary** | Profile pictures, session plan PDFs |

### Backend
| Layer | Choice |
|---|---|
| Runtime | **Node.js 20 LTS** |
| API | **Next.js Route Handlers** (API Routes in App Router) |
| Auth | **NextAuth.js v5 (Auth.js)** with email/password + Google OAuth |
| Database | **PostgreSQL** via **Supabase** |
| ORM | **Prisma** |
| Email | **Resend** + **React Email** templates |
| Payments | **Stripe** (or manual upload confirmation) |
| Storage | **Supabase Storage** |
| Notifications | **Supabase Realtime** channels |

### DevOps / Tooling
| Tool | Purpose |
|---|---|
| **pnpm** | Package manager (faster than npm) |
| **ESLint** + **Prettier** | Code quality & formatting |
| **Husky** + **lint-staged** | Pre-commit hooks |
| **Vercel** | Deployment (auto-preview branches) |
| **Sentry** | Error monitoring |
| **Posthog** | Analytics |
| **GitHub Actions** | CI/CD pipeline |

---

## 2. Repository Structure

```
beyond-borders/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing pages
│   │   ├── page.tsx              # Landing page
│   │   ├── about/page.tsx
│   │   ├── agenda/page.tsx
│   │   ├── sessions/page.tsx
│   │   ├── facilitators/page.tsx
│   │   ├── cultural-night/page.tsx
│   │   ├── announcements/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── registration/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/                   # Auth pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (delegate)/               # Protected delegate area
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── ticket/page.tsx
│   │   ├── agenda/page.tsx
│   │   ├── sessions/page.tsx
│   │   ├── networking/page.tsx
│   │   ├── resources/page.tsx
│   │   └── notifications/page.tsx
│   ├── (admin)/                  # Protected admin area
│   │   ├── dashboard/page.tsx
│   │   ├── registrations/page.tsx
│   │   ├── announcements/page.tsx
│   │   ├── sessions/page.tsx
│   │   ├── facilitators/page.tsx
│   │   ├── agenda/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── payments/page.tsx
│   │   └── notifications/page.tsx
│   ├── api/                      # Route handlers
│   │   ├── auth/[...nextauth]/
│   │   ├── registrations/
│   │   ├── sessions/
│   │   ├── announcements/
│   │   ├── facilitators/
│   │   ├── feed/
│   │   ├── notifications/
│   │   ├── upload/
│   │   └── qr/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + CSS variables
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Countdown.tsx
│   │   ├── QRCode.tsx
│   │   └── Spinner.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── sections/                 # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Feed.tsx
│   │   ├── SessionsPreview.tsx
│   │   ├── FacilitatorsPreview.tsx
│   │   ├── CulturalNightTeaser.tsx
│   │   └── FAQ.tsx
│   ├── feed/
│   │   ├── FeedCard.tsx
│   │   ├── FeedFilter.tsx
│   │   ├── ReactionBar.tsx
│   │   └── PinnedPost.tsx
│   ├── registration/
│   │   ├── StepOne.tsx           # Personal info
│   │   ├── StepTwo.tsx           # Conference preferences
│   │   ├── StepThree.tsx         # Logistics
│   │   ├── StepFour.tsx          # Payment
│   │   └── ProgressBar.tsx
│   ├── dashboard/
│   │   ├── DelegateCard.tsx
│   │   ├── AgendaWidget.tsx
│   │   ├── NotificationCenter.tsx
│   │   └── BookmarkedSessions.tsx
│   ├── sessions/
│   │   ├── SessionCard.tsx
│   │   ├── SessionFilter.tsx
│   │   └── SessionModal.tsx
│   ├── admin/
│   │   ├── StatsGrid.tsx
│   │   ├── RegistrationTable.tsx
│   │   ├── AnnouncementEditor.tsx
│   │   └── PaymentTracker.tsx
│   └── cultural-night/
│       ├── WorldMap.tsx
│       └── CountryBooth.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── supabase.ts               # Supabase client
│   ├── validations/              # Zod schemas
│   │   ├── registration.ts
│   │   ├── session.ts
│   │   └── announcement.ts
│   ├── utils.ts                  # Helper functions
│   └── constants.ts              # App-wide constants
├── hooks/
│   ├── useCountdown.ts
│   ├── useFeed.ts
│   ├── useNotifications.ts
│   └── useAuth.ts
├── store/
│   ├── useUserStore.ts
│   └── useUIStore.ts
├── emails/                       # React Email templates
│   ├── RegistrationConfirmation.tsx
│   ├── WelcomeDashboard.tsx
│   └── Announcement.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── fonts/
│   ├── images/
│   └── videos/
├── types/
│   └── index.ts                  # Global TypeScript types
├── middleware.ts                 # Route protection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
└── CLAUDE.md                     # ← You are here
```

---

## 3. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS & AUTH ─────────────────────────────────────────────

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String?
  role              Role      @default(DELEGATE)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  delegate          Delegate?
  facilitatorApp    FacilitatorApplication?
  reactions         Reaction[]
  comments          Comment[]
  bookmarks         SessionBookmark[]
  notifications     Notification[]
  connections       Connection[] @relation("UserConnections")
  connectedBy       Connection[] @relation("ConnectedByUser")

  @@map("users")
}

enum Role {
  DELEGATE
  FACILITATOR
  OC_MEMBER
  ADMIN
}

model Delegate {
  id                String    @id @default(cuid())
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id])

  delegateId        String    @unique  // e.g. "BBC-2025-0042"
  firstName         String
  lastName          String
  nationality       String
  profilePicture    String?
  bio               String?
  interests         String[]

  // Conference logistics
  arrivalDate       DateTime?
  departureDate     DateTime?
  dietaryPrefs      String[]
  emergencyName     String?
  emergencyPhone    String?

  // Payment
  paymentStatus     PaymentStatus @default(PENDING)
  paymentProof      String?       // uploaded file URL

  // Status
  status            DelegateStatus @default(PENDING)
  checkInAt         DateTime?
  qrToken           String    @unique @default(cuid())

  sessionInterests  String[]
  bookedSessions    SessionBookmark[]

  @@map("delegates")
}

enum PaymentStatus {
  PENDING
  UPLOADED
  CONFIRMED
  REJECTED
}

enum DelegateStatus {
  PENDING
  APPROVED
  REJECTED
  CHECKED_IN
}

// ─── SESSIONS ─────────────────────────────────────────────────

model Session {
  id                String    @id @default(cuid())
  title             String
  description       String
  objectives        String[]
  category          SessionCategory
  facilitatorId     String?
  facilitator       FacilitatorApplication? @relation(fields: [facilitatorId], references: [id])
  day               Int
  startTime         DateTime
  endTime           DateTime
  location          String
  capacity          Int?
  tags              String[]
  status            SessionStatus @default(DRAFT)
  bookmarks         SessionBookmark[]
  createdAt         DateTime  @default(now())

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

model SessionBookmark {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  sessionId   String
  session     Session  @relation(fields: [sessionId], references: [id])
  delegateId  String?
  delegate    Delegate? @relation(fields: [delegateId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([userId, sessionId])
  @@map("session_bookmarks")
}

// ─── FACILITATORS ─────────────────────────────────────────────

model FacilitatorApplication {
  id                String    @id @default(cuid())
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id])

  fullName          String
  email             String
  sessionTitle      String
  sessionObjectives String
  targetAudience    String
  duration          Int       // minutes
  interactiveMethods String
  materialsNeeded   String?
  sessionPlanUrl    String?

  status            ApplicationStatus @default(PENDING)
  reviewNotes       String?
  reviewedBy        String?
  reviewedAt        DateTime?

  sessions          Session[]
  createdAt         DateTime  @default(now())

  @@map("facilitator_applications")
}

enum ApplicationStatus {
  PENDING
  UNDER_REVIEW
  APPROVED
  REJECTED
}

// ─── FEED & ANNOUNCEMENTS ─────────────────────────────────────

model Post {
  id          String      @id @default(cuid())
  type        PostType
  title       String?
  content     String
  mediaUrl    String?
  tags        String[]
  pinned      Boolean     @default(false)
  authorId    String
  reactions   Reaction[]
  comments    Comment[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

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

model Reaction {
  id        String       @id @default(cuid())
  postId    String
  post      Post         @relation(fields: [postId], references: [id])
  userId    String
  user      User         @relation(fields: [userId], references: [id])
  emoji     ReactionType

  @@unique([postId, userId])
  @@map("reactions")
}

enum ReactionType {
  HEART
  FIRE
  CLAP
  GLOBE
  STAR
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  createdAt DateTime @default(now())

  @@map("comments")
}

// ─── NOTIFICATIONS ────────────────────────────────────────────

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  type      NotificationType
  title     String
  body      String
  read      Boolean          @default(false)
  link      String?
  createdAt DateTime         @default(now())

  @@map("notifications")
}

enum NotificationType {
  REGISTRATION_APPROVED
  REGISTRATION_REJECTED
  SESSION_REMINDER
  SCHEDULE_CHANGE
  ANNOUNCEMENT
  FACILITATOR_APPROVED
  FACILITATOR_REJECTED
  GENERAL
}

// ─── NETWORKING ───────────────────────────────────────────────

model Connection {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation("UserConnections", fields: [userId], references: [id])
  connectedToId String
  connectedTo   User     @relation("ConnectedByUser", fields: [connectedToId], references: [id])
  createdAt     DateTime @default(now())

  @@unique([userId, connectedToId])
  @@map("connections")
}

// ─── GALLERY ─────────────────────────────────────────────────

model GalleryItem {
  id          String   @id @default(cuid())
  url         String
  type        MediaType
  caption     String?
  uploadedBy  String?
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@map("gallery_items")
}

enum MediaType {
  IMAGE
  VIDEO
}
```

---

## 4. Design System

### 4.1 Color Palette (CSS Variables)

```css
/* app/globals.css */
:root {
  /* Core brand */
  --color-primary:        #1A1F5E;   /* Deep navy */
  --color-primary-light:  #2D3494;
  --color-accent-purple:  #7C3AED;
  --color-accent-violet:  #6D28D9;
  --color-accent-pink:    #DB2777;
  --color-accent-teal:    #0D9488;
  --color-accent-amber:   #F59E0B;

  /* Surfaces */
  --color-bg:             #0A0B1E;   /* Near-black deep blue */
  --color-surface-1:      #111232;
  --color-surface-2:      #191B3A;
  --color-surface-3:      #1E2147;
  --color-glass:          rgba(255,255,255,0.06);
  --color-glass-border:   rgba(255,255,255,0.10);

  /* Text */
  --color-text-primary:   #F0F1FF;
  --color-text-secondary: #9BA3EB;
  --color-text-muted:     #5B6399;

  /* Gradients */
  --gradient-hero:        linear-gradient(135deg, #1A1F5E 0%, #7C3AED 50%, #DB2777 100%);
  --gradient-card:        linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.15));
  --gradient-cta:         linear-gradient(90deg, #7C3AED, #DB2777);

  /* Spacing scale */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;
  --space-3xl: 96px;

  /* Border radius */
  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  20px;
  --radius-xl:  32px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-glow-purple: 0 0 40px rgba(124,58,237,0.3);
  --shadow-glow-pink:   0 0 40px rgba(219,39,119,0.3);
  --shadow-card:        0 8px 32px rgba(0,0,0,0.4);
}
```

### 4.2 Typography

```css
/* Fonts to import from Google Fonts */
/* Display: "Clash Display" or "Syne" — bold, geometric */
/* Body:    "DM Sans" — clean, modern */
/* Mono:    "JetBrains Mono" — for delegate IDs, codes */

--font-display: 'Clash Display', 'Syne', sans-serif;
--font-body:    'DM Sans', sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

### 4.3 Glassmorphism Card Mixin

```css
.glass-card {
  background: var(--color-glass);
  border: 1px solid var(--color-glass-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

### 4.4 Animation Guidelines

All page-level transitions: **Framer Motion `AnimatePresence`** with `opacity` + `y` slide.

```tsx
// Standard section reveal
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

// Staggered children
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}
```

Scroll-triggered: use `whileInView` with `viewport={{ once: true, amount: 0.2 }}`.

Hover states on cards: `whileHover={{ y: -4, scale: 1.01 }}`.

No `useEffect`-based JS animations. Use CSS transitions for simple hover states; Framer Motion for orchestrated sequences.

---

## 5. Feature Specifications

### 5.1 Hero Section

- Full-viewport height (`100svh`)
- Background: looping video (muted, autoplay) of international youth, overlaid with `--gradient-hero` at 70% opacity
- Particle system: floating globe/star particles using canvas or `tsparticles` (subtle, not distracting)
- Center content:
  - AIESEC in Tunisia badge (small, top)
  - Main heading: `"Beyond Borders Conference"` — display font, large, gradient text clip
  - Tagline: one line, max 10 words
  - Countdown timer component (days / hours / minutes / seconds)
  - Three CTA buttons: `Register Now` (gradient fill), `Explore Conference` (glass), `Become a Facilitator` (outlined)
- Scroll indicator animation at bottom

**Countdown component (`components/ui/Countdown.tsx`)**
- Accept `targetDate: Date` prop
- Use `useCountdown` hook with `setInterval` (1-second tick)
- Show animated digit flip on change (CSS `@keyframes` or Framer Motion `AnimatePresence`)

---

### 5.2 Navbar

- Sticky, `position: fixed`, `top: 0`, full width
- On scroll > 50px: apply glass effect + border-bottom
- Links: Home · About · Agenda · Sessions · Facilitators · Cultural Night · Announcements · Gallery · Registration · FAQ · Contact
- Right side: dark/light mode toggle + auth state (avatar if logged in, "Login" if not)
- Mobile: hamburger → full-screen slide-in menu with stagger animation
- Active link: underline gradient animation

---

### 5.3 Conference Feed

This is the most important feature. Think Instagram/Twitter feed but conference-themed.

**Data model:** `Post` (see schema above)

**Feed page / section:**
- Masonry or single-column timeline layout
- Filter bar: All · Announcements · Spotlights · Updates · Reminders
- Pinned posts appear at top with a pin icon
- Each card: author avatar + name + role badge, timestamp, content, optional image/video, tags, reaction bar, comment toggle
- Reactions: 5 emoji types (Heart, Fire, Clap, Globe, Star) — animated bounce on click
- Real-time updates via Supabase Realtime subscription — new posts slide in from top
- Infinite scroll (no pagination UI)

**Admin posting:**
- Rich text editor (Tiptap or Quill)
- Media upload
- Tag selector
- Pin toggle
- Scheduled publishing

---

### 5.4 Registration System

**Route:** `/registration`

**Registration window:** opens 2 weeks before conference. Outside this window, show a countdown to registration opening.

**Multi-step form (4 steps):**

| Step | Fields |
|---|---|
| 1 — Personal Info | First name, last name, email, password, nationality (searchable select with flag emoji), profile picture upload, bio |
| 2 — Conference Preferences | Session interests (multi-select checkboxes), dietary preferences, accessibility needs |
| 3 — Logistics | Arrival date, departure date, accommodation needed (Y/N), emergency contact name + phone |
| 4 — Payment | Payment instructions display, proof of payment upload (image/PDF), agreement checkbox |

**Progress:** stepper UI at top, cannot skip steps, can go back.

**On submit:**
1. Create `User` + `Delegate` records
2. Set `paymentStatus: UPLOADED`, `status: PENDING`
3. Generate `delegateId` (`BBC-2025-XXXX` format, zero-padded)
4. Send confirmation email via Resend
5. Redirect to `/delegate/dashboard` with "Awaiting approval" state

---

### 5.5 Delegate Dashboard

**Route:** `/delegate/dashboard` (protected)

Layout: sidebar nav + main content area.

**Sidebar links:** Overview · My Ticket · Agenda · Sessions · Networking · Resources · Notifications

**Overview widgets:**
- Welcome card (name, delegate ID, status badge)
- Quick stats: sessions bookmarked, connections made, notifications unread
- Upcoming sessions (next 2)
- Latest announcement preview

**My Ticket:**
- Conference-branded ticket design (like a boarding pass)
- QR code (contains `qrToken`)
- Delegate ID displayed in monospace
- Download as PNG button (using `html2canvas`)
- Status badge: Pending / Approved / Checked In

---

### 5.6 Facilitator Application

**Route:** `/facilitators/apply`

**Form fields:**
- Full name, email
- Session title
- Session objectives (textarea)
- Target audience (dropdown: All Delegates · Beginners · Advanced · Mixed)
- Duration (30 / 45 / 60 / 90 min)
- Interactive methods used (textarea)
- Materials needed (textarea, optional)
- Full session plan (PDF upload, max 10MB)
- Agree to facilitator guidelines (checkbox)

**After submission:**
- Status tracked: Pending → Under Review → Approved / Rejected
- Admin review panel shows all applications with notes field
- Approved applicants gain `FACILITATOR` role
- Rejection email sent with optional feedback

---

### 5.7 Admin Panel

**Route:** `/admin/*` (role: ADMIN or OC_MEMBER only)

**Dashboard overview cards:**
- Total registrations
- Pending approvals
- Confirmed delegates
- Pending payments
- Sessions published
- Facilitator applications

**Registrations table:**
- Columns: Name, Nationality, Status, Payment, Registered At, Actions
- Actions: Approve / Reject / View Details
- Bulk approve
- Export to CSV (using `papaparse`)

**Announcements manager:**
- Create / edit / delete posts
- Pin/unpin
- Schedule publishing
- Push notification on publish

**Analytics:**
- Registration timeline chart (Recharts)
- Nationality distribution map / pie chart
- Session interest heatmap
- Daily registration count

---

### 5.8 Cultural Night — "One Global Night"

**Route:** `/cultural-night`

**Design:** most visually immersive page.

- Hero: animated world map (Mapbox or D3 globe) with glowing country markers
- Clicking a marker opens a country booth modal:
  - Flag + country name
  - Short cultural description
  - Traditional music embed (YouTube iframe or Spotify)
  - Food/tradition highlights
  - Photos uploaded by EP from that country
- Participant-submitted content section: delegates can submit cultural content before the event
- Animated background: floating country flag emoji particles

---

### 5.9 Agenda Page

**Route:** `/agenda`

- Day tabs at top (Day 1 / Day 2 / Day 3 / etc.)
- Each day: vertical timeline
- Timeline items: time block, session title, facilitator name/avatar, location, category color tag
- Clicking an item: expand in-place or open slide-over panel with full details + bookmark button
- Color-coded by category (see `SessionCategory` enum)
- Print-friendly CSS (`@media print`)
- "Add to Google Calendar" button per session (generates `.ics` link)

---

### 5.10 QR Code Check-In

**Admin flow:**
- Scanner page at `/admin/checkin` (uses device camera via `html5-qrcode`)
- Scan delegate's QR → lookup `qrToken` → mark `checkInAt` → show success/fail

**Delegate flow:**
- QR code displayed on ticket page and dashboard
- Contains encoded `qrToken` only (no PII in QR data)

---

## 6. API Route Specifications

All API routes return `{ data, error }` envelope. HTTP status codes used properly.

### Auth
```
POST /api/auth/register           Create user + delegate
POST /api/auth/[...nextauth]      NextAuth handler
```

### Registrations
```
GET    /api/registrations         Admin: list all (paginated, filterable)
GET    /api/registrations/:id     Get single
PATCH  /api/registrations/:id     Update status (admin only)
DELETE /api/registrations/:id     Soft delete (admin only)
```

### Sessions
```
GET    /api/sessions              Public: list published sessions
POST   /api/sessions              Admin: create session
PATCH  /api/sessions/:id          Admin: update
DELETE /api/sessions/:id          Admin: delete
POST   /api/sessions/:id/bookmark Delegate: toggle bookmark
```

### Feed / Announcements
```
GET    /api/feed                  Public: list posts (paginated)
POST   /api/feed                  Admin: create post
PATCH  /api/feed/:id              Admin: update/pin
DELETE /api/feed/:id              Admin: delete
POST   /api/feed/:id/react        Authenticated: toggle reaction
POST   /api/feed/:id/comment      Authenticated: add comment
```

### Facilitators
```
GET    /api/facilitators          Public: list approved
POST   /api/facilitators/apply    Public: submit application
GET    /api/facilitators/admin    Admin: list all applications
PATCH  /api/facilitators/:id      Admin: approve/reject
```

### Notifications
```
GET    /api/notifications         Authenticated: list mine
PATCH  /api/notifications/read    Authenticated: mark all read
POST   /api/notifications/send    Admin: broadcast
```

### QR
```
GET    /api/qr/:token             Admin: resolve token → delegate info
PATCH  /api/qr/:token/checkin     Admin: mark checked in
```

---

## 7. Authentication & Authorization

### Roles and Access

| Role | Access |
|---|---|
| `GUEST` | Public pages only |
| `DELEGATE` | Public + delegate dashboard |
| `FACILITATOR` | Delegate access + facilitator tools |
| `OC_MEMBER` | Admin panel (no user management) |
| `ADMIN` | Full access |

### Middleware (`middleware.ts`)

```ts
// Protect /delegate/* → require DELEGATE role
// Protect /admin/* → require OC_MEMBER or ADMIN role
// Redirect unauthenticated users to /login with callbackUrl
```

### Session strategy
- JWT-based (no database sessions for scalability)
- Access token: 1 hour
- Refresh token: 7 days (stored in httpOnly cookie)

---

## 8. Email Templates

All templates built with **React Email**. Sent via **Resend**.

| Template | Trigger |
|---|---|
| `RegistrationReceived` | On form submit |
| `RegistrationApproved` | Admin approves |
| `RegistrationRejected` | Admin rejects |
| `PaymentConfirmed` | Admin confirms payment |
| `FacilitatorApproved` | Admin approves application |
| `FacilitatorRejected` | Admin rejects application |
| `AnnouncementBroadcast` | Admin sends mass announcement |
| `ConferenceReminder` | 3 days before conference (cron) |

All emails use the Beyond Borders brand colors and include the AIESEC in Tunisia logo.

---

## 9. Real-Time Features

Using **Supabase Realtime** (Postgres changes broadcast).

### Channels

```ts
// Feed updates — public channel
supabase.channel('public:posts')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, handleNewPost)
  .subscribe()

// Delegate notifications — private channel per user
supabase.channel(`private:notifications:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `userId=eq.${userId}`
  }, handleNewNotification)
  .subscribe()
```

### Notification Center UI
- Bell icon in navbar with unread count badge
- Slide-in panel on click
- Items grouped by date
- Mark all as read button
- Click navigates to relevant page

---

## 10. Performance Guidelines

- All images: use `next/image` with proper `sizes` attribute
- Videos: lazy-load, preload metadata only
- Fonts: `font-display: swap`, preload critical fonts
- Code splitting: each major route is its own chunk (App Router handles this)
- Prefetch: use `<Link prefetch>` for high-priority navigation
- Database: add indexes on `userId`, `sessionId`, `createdAt`, `status` fields
- API: implement `stale-while-revalidate` cache headers for public endpoints
- Bundle: analyze with `@next/bundle-analyzer` before production

**Lighthouse targets:** Performance > 90, Accessibility > 95, Best Practices > 90

---

## 11. Environment Variables

```bash
# .env.local.example

# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Email
RESEND_API_KEY="..."
EMAIL_FROM="noreply@beyondbordersconference.tn"

# Storage
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN="..."

# Payments (optional Stripe)
STRIPE_SECRET_KEY="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="..."

# Monitoring
SENTRY_DSN="..."

# Conference config
NEXT_PUBLIC_CONFERENCE_DATE="2025-07-15T09:00:00+01:00"
NEXT_PUBLIC_REGISTRATION_OPEN_DATE="2025-07-01T00:00:00+01:00"
NEXT_PUBLIC_REGISTRATION_CLOSE_DATE="2025-07-13T23:59:59+01:00"
```

---

## 12. Development Workflow

### Commands

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm db:generate      # prisma generate
pnpm db:push          # prisma db push (dev)
pnpm db:migrate       # prisma migrate dev
pnpm db:seed          # prisma db seed
pnpm db:studio        # Prisma Studio GUI
pnpm email:preview    # React Email dev server
pnpm analyze          # Bundle analyzer
```

### Git Branch Strategy

```
main          ← production (auto-deploys to Vercel)
develop       ← integration branch
feature/*     ← individual features
fix/*         ← bug fixes
```

PRs require: passing CI, no TypeScript errors, no ESLint errors.

---

## 13. Accessibility

- All interactive elements keyboard-navigable
- `aria-label` on icon-only buttons
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- Focus rings visible (custom styled, not removed)
- `alt` text on all images
- Form inputs have associated `<label>` elements
- Modal traps focus while open, restores on close
- Respect `prefers-reduced-motion`: disable decorative animations

---

## 14. Internationalization (i18n)

Delegate base: international (English-speaking EPs).

- Primary language: **English**
- Future: Arabic (RTL support via `dir="rtl"`)
- Use `next-intl` library when i18n expansion is needed
- All user-facing strings extractable (no hardcoded strings in JSX beyond initial build)

---

## 15. Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Unit (utils, hooks) | Vitest | 80% |
| Component | React Testing Library | Key interactive components |
| E2E (registration flow, login) | Playwright | Critical paths |
| API routes | Vitest + `supertest` | All routes |

---

## 16. Deployment

- **Platform:** Vercel (Pro plan recommended for team + analytics)
- **Database:** Supabase (hosted PostgreSQL)
- **CDN:** Vercel Edge Network (automatic)
- **Domain:** `beyondbordersconference.tn` (or `.com`)
- **SSL:** Automatic via Vercel
- **Cron jobs** (conference reminders, cleanup): Vercel Cron or Supabase pg_cron

---

## 17. OC Onboarding Checklist

Before launch, the OC team must complete:

- [ ] Set all environment variables in Vercel dashboard
- [ ] Run `pnpm db:migrate` on production DB
- [ ] Run `pnpm db:seed` to create initial admin user
- [ ] Upload hero background video to Supabase Storage
- [ ] Add facilitator guidelines PDF to `/public`
- [ ] Configure Resend domain for email sending
- [ ] Set conference date in env vars
- [ ] Test full registration flow end-to-end
- [ ] Test QR check-in flow
- [ ] Configure Stripe (or disable and use manual payment upload)
- [ ] Set up Sentry project and add DSN
- [ ] Add Google Analytics / Posthog key
- [ ] Set Mapbox token for Cultural Night map
- [ ] Verify all email templates render correctly
- [ ] Verify mobile responsiveness on real devices (iOS Safari, Android Chrome)
- [ ] Lighthouse audit all public pages

---

## 18. Coding Conventions

- **File naming:** `PascalCase` for components, `camelCase` for utilities/hooks, `kebab-case` for routes
- **Component structure:** props interface at top, component function, `export default` at bottom
- **No `any` types** — use `unknown` + type narrowing if needed
- **No inline styles** — use Tailwind classes or CSS variables
- **All async operations** wrapped in try/catch with proper error handling
- **API responses** always use the `{ data, error }` envelope
- **Comments:** only for non-obvious logic; self-documenting code preferred
- **No `console.log` in production** — use `logger` utility

---

*Last updated: project initialization*
*Maintained by: AIESEC in Tunisia OC Tech Team*