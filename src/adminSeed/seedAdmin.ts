// 1. is admin already exists!
// 2.if Exists then return

import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
// 3.if not then create
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;
    const isExists = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (isExists) {
      console.log("Admin already Exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Admin created Successfully");
  } catch (err: any) {
    console.error("seeding Error", err);
  } finally {
    await prisma.$disconnect();
  }
};
seedAdmin();
