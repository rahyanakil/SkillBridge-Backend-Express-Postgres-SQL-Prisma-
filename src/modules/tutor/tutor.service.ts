import { prisma } from "../../lib/prisma";

const createOrUpdateProfile = async (userId: string, payload: any) => {
  if (!userId) throw new Error("User ID NOT EXISTS!");
  const tutorData = {
    bio: payload.bio,
    expertise: payload.expertise,
    hourlyRate: payload.hourlyRate,
    experience: payload.experience,
  };
  const existingProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (existingProfile) return await prisma.tutor.update({ where: { userId }, data: tutorData });
  return await prisma.tutor.create({ data: { userId, ...tutorData } });
};

const getProfileByUserId = async (userId: string) => {
  const profile = await prisma.tutor.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      courses: {
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
      },
      reviews: {
        include: { Student: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!profile) throw new Error("Tutor profile not found");

  const coursesWithRating = profile.courses.map((c: any) => {
    const ratings = c.reviews.map((r: any) => r.rating);
    const avgRating = ratings.length
      ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
      : 0;
    return { ...c, avgRating, reviewCount: ratings.length };
  });

  const allRatings = profile.reviews.map((r: any) => r.rating);
  const avgRating = allRatings.length
    ? parseFloat((allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length).toFixed(1))
    : 0;

  return { ...profile, courses: coursesWithRating, avgRating };
};

const getAllTutors = async () => {
  const tutors = await prisma.tutor.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      courses: true,
      reviews: { select: { rating: true } },
    },
  });
  return tutors.map((t: any) => {
    const ratings = t.reviews.map((r: any) => r.rating);
    const avgRating = ratings.length
      ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
      : 0;
    return { ...t, avgRating };
  });
};

const getEarnings = async (userId: string) => {
  const tutor = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutor) throw new Error("Tutor profile not found");

  const completedBookings = await prisma.booking.findMany({
    where: { tutorId: tutor.id, status: "COMPLETED" },
    include: { course: { select: { title: true, price: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const total = completedBookings.reduce((sum, b) => sum + (b.course?.price || 0), 0);

  const byMonth: Record<string, number> = {};
  completedBookings.forEach((b) => {
    const key = b.updatedAt.toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] || 0) + (b.course?.price || 0);
  });

  const byCourse: Record<string, { title: string; count: number; revenue: number }> = {};
  completedBookings.forEach((b) => {
    const id = b.courseId;
    if (!byCourse[id]) byCourse[id] = { title: b.course?.title || "", count: 0, revenue: 0 };
    byCourse[id].count++;
    byCourse[id].revenue += b.course?.price || 0;
  });

  return {
    totalEarnings: parseFloat(total.toFixed(2)),
    totalSessions: completedBookings.length,
    byMonth,
    byCourse: Object.values(byCourse),
    recentSessions: completedBookings.slice(0, 10),
  };
};

const getMyProfile = async (userId: string) => {
  return getProfileByUserId(userId);
};

export const TutorService = {
  createOrUpdateProfile,
  getProfileByUserId,
  getMyProfile,
  getAllTutors,
  getEarnings,
};
