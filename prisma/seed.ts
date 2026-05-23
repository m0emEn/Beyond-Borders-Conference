import { PrismaClient, PostType, SessionCategory, SessionStatus, MediaType, OCRole, OCDepartment, TaskPriority, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear any existing OC-related seed records to prevent primary key conflicts
  await prisma.task.deleteMany({});
  await prisma.oCMember.deleteMany({});

  // 1. Hash the default testing password "beyond2026"
  const passwordHash = bcrypt.hashSync("beyond2026", 10);

  // 2. Seed OC VPs & OCP
  const ocp = await prisma.oCMember.create({
    data: {
      fullName: "Moemen Sfaxi",
      email: "moemen@aiesec.net",
      passwordHash,
      role: OCRole.OCP,
      department: OCDepartment.GENERAL,
    },
  });

  const vpDxp = await prisma.oCMember.create({
    data: {
      fullName: "Amine Daoud",
      email: "amine@aiesec.net",
      passwordHash,
      role: OCRole.OCVP_DXP,
      department: OCDepartment.DXP,
      managerId: ocp.id,
    },
  });

  const vpMkt = await prisma.oCMember.create({
    data: {
      fullName: "Oussama",
      email: "oussama@aiesec.net",
      passwordHash,
      role: OCRole.OCVP_MKT,
      department: OCDepartment.MKT,
      managerId: ocp.id,
    },
  });

  const vpFinance = await prisma.oCMember.create({
    data: {
      fullName: "Yassine Trabelsi",
      email: "yassine@aiesec.net",
      passwordHash,
      role: OCRole.OCVP_FINANCE,
      department: OCDepartment.FINANCE,
      managerId: ocp.id,
    },
  });

  const vpLogEr = await prisma.oCMember.create({
    data: {
      fullName: "Sarra Ghedas",
      email: "sarra@aiesec.net",
      passwordHash,
      role: OCRole.OCVP_LOG_ER,
      department: OCDepartment.LOG_ER,
      managerId: ocp.id,
    },
  });

  // 3. Seed Department Members
  const memberDxp = await prisma.oCMember.create({
    data: {
      fullName: "Linda",
      email: "linda@aiesec.net",
      passwordHash,
      role: OCRole.OC_DXP_MEMBER,
      department: OCDepartment.DXP,
      managerId: vpDxp.id,
    },
  });

  const memberMkt = await prisma.oCMember.create({
    data: {
      fullName: "Bilel",
      email: "bilel@aiesec.net",
      passwordHash,
      role: OCRole.OC_MKT_MEMBER,
      department: OCDepartment.MKT,
      managerId: vpMkt.id,
    },
  });

  // 4. Seed Relational Tasks
  await prisma.task.create({
    data: {
      title: "Finalize catering contract and menu",
      description: "Ensure food counts align with registered vegetarian/gluten-free EPs.",
      assignedToId: vpLogEr.id,
      createdById: ocp.id,
      deadline: new Date("2026-06-05T23:59:59Z"),
      priority: TaskPriority.URGENT,
      status: TaskStatus.PENDING,
      department: OCDepartment.LOG_ER,
      progressNotes: "Initial quote received. Checking prices.",
    },
  });

  await prisma.task.create({
    data: {
      title: "Verify corporate sponsorship payout (BNA)",
      description: "Confirm wire receipt in BNA account.",
      assignedToId: vpFinance.id,
      createdById: ocp.id,
      deadline: new Date("2026-05-24T23:59:59Z"),
      priority: TaskPriority.URGENT,
      status: TaskStatus.IN_PROGRESS,
      department: OCDepartment.FINANCE,
      progressNotes: "Awaiting final clearance invoice validation.",
    },
  });

  await prisma.task.create({
    data: {
      title: "Book transfer shuttle buses",
      description: "Coordinate shuttle timings with insat EPs.",
      assignedToId: vpLogEr.id,
      createdById: ocp.id,
      deadline: new Date("2026-06-10T23:59:59Z"),
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      department: OCDepartment.LOG_ER,
      progressNotes: "Bus rental quote finalized.",
    },
  });

  await prisma.task.create({
    data: {
      title: "Design social media speaker highlights",
      description: "Publish promotional layouts on Instagram.",
      assignedToId: memberMkt.id,
      createdById: vpMkt.id,
      deadline: new Date("2026-06-01T23:59:59Z"),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.COMPLETED,
      department: OCDepartment.MKT,
      progressNotes: "Designed and posted on Instagram feed.",
    },
  });

  await prisma.task.create({
    data: {
      title: "Send invitation check-in QR codes",
      description: "Dispatch check-in visually rich entrance ticket EPs.",
      assignedToId: memberDxp.id,
      createdById: vpDxp.id,
      deadline: new Date("2026-06-15T23:59:59Z"),
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      department: OCDepartment.DXP,
    },
  });

  // 5. Seed sample Posts (Announcements)
  await prisma.post.upsert({
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

  await prisma.post.upsert({
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

  // 6. Seed sample Sessions
  const baseTime = new Date("2026-07-15T09:00:00+01:00");
  
  await prisma.session.upsert({
    where: { id: "seed-session-1" },
    update: {},
    create: {
      id: "seed-session-1",
      title: "Leading Across Borders",
      description: "Understand the essentials of cross-cultural leadership and how young leaders can drive impact in a globally integrated world.",
      objectives: ["Define global leadership framework", "Identify cross-cultural collaboration models"],
      category: SessionCategory.LEADERSHIP,
      day: 1,
      startTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 2),
      endTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 3.5),
      location: "Grand Ballroom A",
      capacity: 100,
      tags: ["leadership", "impact"],
      status: SessionStatus.PUBLISHED,
    },
  });

  await prisma.session.upsert({
    where: { id: "seed-session-2" },
    update: {},
    create: {
      id: "seed-session-2",
      title: "Cultural Intelligence Workshop",
      description: "Interactive simulation designed to improve cultural adaptability, explore stereotypes, and construct active listening skills.",
      objectives: ["Improve self-reflection in diverse environments", "Engage in experiential simulation"],
      category: SessionCategory.CULTURAL_EXCHANGE,
      day: 2,
      startTime: new Date(baseTime.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000 * 5),
      endTime: new Date(baseTime.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000 * 7),
      location: "Oceanview Terrace",
      capacity: 80,
      tags: ["culture", "workshop"],
      status: SessionStatus.PUBLISHED,
    },
  });

  // 7. Seed general Agenda Items
  await prisma.agendaItem.upsert({
    where: { id: "seed-agenda-1" },
    update: {},
    create: {
      id: "seed-agenda-1",
      title: "Opening Ceremony",
      description: "Welcome address from the AIESEC in Bizerte Organizing Committee and local delegation roll-calls.",
      day: 1,
      startTime: baseTime,
      endTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 1.5),
      location: "Grand Ballroom A",
      category: "Activity",
    },
  });

  await prisma.agendaItem.upsert({
    where: { id: "seed-agenda-2" },
    update: {},
    create: {
      id: "seed-agenda-2",
      title: "Coffee Break & Networking",
      description: "Meet your fellow EPs and discuss local projects.",
      day: 1,
      startTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 1.5),
      endTime: new Date(baseTime.getTime() + 60 * 60 * 1000 * 2),
      location: "Foyer & Garden Lounge",
      category: "Networking",
    },
  });

  // 8. Seed sample Facilitators
  await prisma.facilitator.upsert({
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

  // 9. Seed sample GalleryMedia
  await prisma.galleryMedia.upsert({
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

  console.log("Refined AIESEC OC seed completed successfully!", {
    ocp: ocp.fullName,
    dxpLeader: vpDxp.fullName,
    mktLeader: vpMkt.fullName,
    finLeader: vpFinance.fullName,
    logLeader: vpLogEr.fullName,
    memberDxp: memberDxp.fullName,
    memberMkt: memberMkt.fullName,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
