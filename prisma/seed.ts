import { PrismaClient, PostType, SessionCategory, SessionStatus, MediaType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed sample Posts (Announcements)
  const welcomePost = await prisma.post.upsert({
    where: { id: "seed-welcome-post" },
    update: {},
    create: {
      id: "seed-welcome-post",
      type: PostType.ANNOUNCEMENT,
      title: "Welcome to Beyond Borders Conference!",
      content: "We are thrilled to welcome Exchange Participants from all over the world to the first summer edition of the Beyond Borders Conference. Get ready for an unforgettable journey of leadership development, cultural exchange, and lifelong memories!",
      tags: ["welcome", "aiesec", "launch"],
      pinned: true,
    },
  });

  const venuePost = await prisma.post.upsert({
    where: { id: "seed-venue-post" },
    update: {},
    create: {
      id: "seed-venue-post",
      type: PostType.UPDATE,
      title: "Conference Venue Announced",
      content: "The main sessions and workshops will take place at the Premium Convention Hall in Bizerte. Detailed transport schedules and check-in details will be shared directly with registered delegates shortly.",
      tags: ["venue", "logistics"],
      pinned: false,
    },
  });

  // 2. Seed sample Sessions
  const baseTime = new Date("2026-07-15T09:00:00+01:00");
  
  const leadershipSession = await prisma.session.upsert({
    where: { id: "seed-session-1" },
    update: {},
    create: {
      id: "seed-session-1",
      title: "Leading Across Borders",
      description: "Understand the essentials of cross-cultural leadership and how young leaders can drive impact in a globally integrated world.",
      objectives: ["Define global leadership framework", "Identify cross-cultural collaboration models"],
      category: SessionCategory.LEADERSHIP,
      day: 1,
      startTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 2), // 11:00 AM
      endTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 3.5), // 12:30 PM
      location: "Grand Ballroom A",
      capacity: 100,
      tags: ["leadership", "impact"],
      status: SessionStatus.PUBLISHED,
    },
  });

  const culturalSession = await prisma.session.upsert({
    where: { id: "seed-session-2" },
    update: {},
    create: {
      id: "seed-session-2",
      title: "Cultural Intelligence Workshop",
      description: "Interactive simulation designed to improve cultural adaptability, explore stereotypes, and construct active listening skills.",
      objectives: ["Improve self-reflection in diverse environments", "Engage in experiential simulation"],
      category: SessionCategory.CULTURAL_EXCHANGE,
      day: 2,
      startTime: new Date(baseTime.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000 * 5), // Day 2 2:00 PM
      endTime: new Date(baseTime.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000 * 7), // Day 2 4:00 PM
      location: "Oceanview Terrace",
      capacity: 80,
      tags: ["culture", "workshop"],
      status: SessionStatus.PUBLISHED,
    },
  });

  // 3. Seed general Agenda Items (Coffee breaks, opening, lunch, etc.)
  const openingAgenda = await prisma.agendaItem.upsert({
    where: { id: "seed-agenda-1" },
    update: {},
    create: {
      id: "seed-agenda-1",
      title: "Opening Ceremony",
      description: "Welcome address from the AIESEC in Bizerte Organizing Committee and local delegation roll-calls.",
      day: 1,
      startTime: baseTime,
      endTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 1.5), // 10:30 AM
      location: "Grand Ballroom A",
      category: "Activity",
    },
  });

  const breakAgenda = await prisma.agendaItem.upsert({
    where: { id: "seed-agenda-2" },
    update: {},
    create: {
      id: "seed-agenda-2",
      title: "Coffee Break & Networking",
      description: "Meet your fellow EPs and discuss local projects.",
      day: 1,
      startTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 1.5), // 10:30 AM
      endTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 2), // 11:00 AM
      location: "Foyer & Garden Lounge",
      category: "Networking",
    },
  });

  // 4. Seed sample Facilitators
  const facilitator1 = await prisma.facilitator.upsert({
    where: { email: "sarah.k@aiesec.net" },
    update: {},
    create: {
      fullName: "Sarah Khadraoui",
      email: "sarah.k@aiesec.net",
      nationality: "Tunisia",
      bio: "Alumni and specialized leadership trainer with over 5 years of facilitating cross-cultural youth workshops.",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
  });

  // 5. Seed sample GalleryMedia
  const gallery1 = await prisma.galleryMedia.upsert({
    where: { id: "seed-gallery-1" },
    update: {},
    create: {
      id: "seed-gallery-1",
      url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      type: MediaType.IMAGE,
      caption: "Opening plenary high energy roll-calls.",
      featured: true,
    },
  });

  console.log("Simplified seed completed successfully:", {
    welcomePost: welcomePost.title,
    venuePost: venuePost.title,
    sessionsCount: 2,
    agendaCount: 2,
    facilitator: facilitator1.fullName,
    galleryItem: gallery1.caption,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
