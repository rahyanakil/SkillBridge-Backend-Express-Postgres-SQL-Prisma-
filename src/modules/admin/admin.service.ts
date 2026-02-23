import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
      isBanned: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (id: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id },
    data: { isBanned },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: { select: { name: true, email: true } },
      tutor: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      course: { select: { title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const deleteCourse = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");

  return prisma.course.delete({
    where: { id },
  });
};

const getSystemStats = async () => {
  const [totalUsers, totalTutors, totalBookings, totalRevenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.tutor.count(),
      prisma.booking.count(),
      prisma.course.aggregate({ _sum: { price: true } }),
    ]);

  return {
    totalUsers,
    totalTutors,
    totalBookings,
    totalRevenue: totalRevenue._sum.price || 0,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  deleteCourse,
  getSystemStats,
};
