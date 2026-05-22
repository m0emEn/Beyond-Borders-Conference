# Beyond Borders Conference

Official website for the Beyond Borders Conference by **AIESEC in Bizerte**.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Prisma + PostgreSQL

## Getting started

1. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

2. Set `DATABASE_URL` in `.env.local` (Supabase or local PostgreSQL).

3. Install dependencies and set up the database:

   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Delegates

Delegates **do not** create accounts or log in on this site. Participation is coordinated by the OC / local entities. Use **Contact** for questions.

## Seed admin (OC tools only)

- Email: `admin@beyondborders.tn` — for future admin panel, not public login
- Password: `admin-change-me` (change immediately in production)

## Project spec

See [CLAUDE.md](./CLAUDE.md) for the full product and architecture specification (some items, e.g. delegate accounts, may differ from current product decisions).

## Phase 1 (current)

- Public marketing site — no delegate login or self-registration
- Landing page with hero, countdown, and section previews
- Prisma schema + seed (admin/feed data for OC)
- Design system (CSS variables, glass cards, brand colors)

## Next phases

- Phase 2: Admin panel (OC only), announcements feed API
- Phase 3: Agenda, sessions from database
- Phase 4: Facilitator applications, check-in (OC-managed delegates)
- Phase 5: Cultural Night map, emails, analytics
