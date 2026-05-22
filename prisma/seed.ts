import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin-change-me", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@beyondborders.tn" },
    update: {},
    create: {
      email: "admin@beyondborders.tn",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const samplePost = await prisma.post.upsert({
    where: { id: "seed-welcome-post" },
    update: {},
    create: {
      id: "seed-welcome-post",
      type: "ANNOUNCEMENT",
      title: "Welcome to Beyond Borders",
      content:
        "Follow this feed for updates, speaker spotlights, and conference reminders.",
      tags: ["welcome", "conference"],
      pinned: true,
      authorId: admin.id,
    },
  });

  console.log("Seed complete:", { admin: admin.email, post: samplePost.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
