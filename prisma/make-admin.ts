import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeUserAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
      select: {
        id: true,
        email: true,
        fullname: true,
        isAdmin: true,
      },
    });

    console.log("✅ User updated successfully:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.fullname}`);
    console.log(`   Admin: ${user.isAdmin}`);
  } catch (error: any) {
    if (error.code === "P2025") {
      console.error("❌ User not found with email:", email);
    } else {
      console.error("❌ Error updating user:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: tsx prisma/make-admin.ts <email>");
  process.exit(1);
}

makeUserAdmin(email);
