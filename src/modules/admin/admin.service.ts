import { prisma } from "../../lib/prisma";

const getAllUsers = async (filter?: { limit?: string; page?: string }) => {
  const limit = filter?.limit ? parseInt(filter.limit) : undefined;
  const page = filter?.page ? Math.max(1, parseInt(filter.page)) : 1;
  const skip = limit ? (page - 1) * limit : undefined;

  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, isBanned: true },
    orderBy: { createdAt: "desc" },
    ...(limit && { take: limit }),
    ...(skip !== undefined && { skip }),
  });
};

const updateUserStatus = async (id: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return prisma.user.update({ where: { id }, data: { isBanned } });
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  if (user.role === "ADMIN") throw new Error("Cannot delete an admin account");
  return prisma.user.delete({ where: { id } });
};

const getAllBookings = async (filter?: { limit?: string; page?: string }) => {
  const limit = filter?.limit ? parseInt(filter.limit) : undefined;
  const page = filter?.page ? Math.max(1, parseInt(filter.page)) : 1;
  const skip = limit ? (page - 1) * limit : undefined;

  return prisma.booking.findMany({
    include: {
      student: { select: { name: true, email: true } },
      tutor: { include: { user: { select: { name: true, email: true } } } },
      course: { select: { title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
    ...(limit && { take: limit }),
    ...(skip !== undefined && { skip }),
  });
};

const updateBookingStatus = async (bookingId: string, status: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");
  return prisma.booking.update({ where: { id: bookingId }, data: { status: status as any } });
};

const createCategory = async (payload: { name: string; description?: string }) => {
  return prisma.category.create({ data: payload });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

const deleteCourse = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");
  return prisma.course.delete({ where: { id } });
};

const getStats = async () => {
  const [totalUsers, totalTutors, totalStudents, totalCourses, totalBookings, completedBookings, reviewAgg] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(),
      prisma.booking.count(),
      prisma.booking.findMany({
        where: { status: "COMPLETED" },
        include: { course: { select: { price: true } } },
      }),
      prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
    ]);

  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.course?.price || 0), 0);

  return {
    totalUsers,
    totalTutors,
    totalStudents,
    totalCourses,
    totalBookings,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    avgRating: parseFloat((reviewAgg._avg.rating || 0).toFixed(1)),
    totalReviews: reviewAgg._count,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  deleteCourse,
  getStats,
  createCategory,
  deleteCategory,
};
