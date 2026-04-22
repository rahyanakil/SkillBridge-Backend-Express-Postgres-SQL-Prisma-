import { prisma } from "../../lib/prisma";

const courseInclude = {
  tutor: { include: { user: true } },
  category: true,
  reviews: { select: { rating: true } },
};

const withAvgRating = (course: any) => {
  const ratings = course.reviews?.map((r: any) => r.rating) || [];
  const avgRating = ratings.length
    ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
    : 0;
  return { ...course, avgRating, reviewCount: ratings.length };
};

const createCourse = async (userId: string, payload: any) => {
  const tutorProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutorProfile) throw new Error("Tutor profile not found for this user!");
  return await prisma.course.create({ data: { ...payload, tutorId: tutorProfile.id } });
};

const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      tutor: { include: { user: true } },
      category: true,
      reviews: {
        include: { Student: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!course) throw new Error("Course not found");
  return withAvgRating(course);
};

const getAllCourses = async (filter?: any) => {
  const where: any = {};
  if (filter?.tutorId) where.tutorId = filter.tutorId;
  if (filter?.categoryId) where.categoryId = filter.categoryId;
  if (filter?.minPrice || filter?.maxPrice) {
    where.price = {};
    if (filter.minPrice) where.price.gte = parseFloat(filter.minPrice);
    if (filter.maxPrice) where.price.lte = parseFloat(filter.maxPrice);
  }
  if (filter?.q) {
    where.OR = [
      { title: { contains: filter.q, mode: "insensitive" } },
      { description: { contains: filter.q, mode: "insensitive" } },
    ];
  }

  const courses = await prisma.course.findMany({ where, include: courseInclude, orderBy: { createdAt: "desc" } });
  return courses.map(withAvgRating);
};

const updateCourse = async (id: string, userId: string, payload: any) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");
  const tutorProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutorProfile || course.tutorId !== tutorProfile.id)
    throw new Error("You are not authorized to update this course!");
  return await prisma.course.update({ where: { id }, data: payload });
};

const deleteCourse = async (id: string, userId: string) => {
  const tutorProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutorProfile) throw new Error("Tutor profile not found!");
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");
  if (course.tutorId !== tutorProfile.id) throw new Error("You are not authorized to delete this course!");
  await prisma.course.delete({ where: { id } });
  return true;
};

const getRecommendations = async (studentId: string) => {
  const completedBookings = await prisma.booking.findMany({
    where: { studentId, status: "COMPLETED" },
    include: { course: { select: { categoryId: true } } },
  });

  const bookedCourseIds = await prisma.booking
    .findMany({ where: { studentId }, select: { courseId: true } })
    .then((b) => b.map((x) => x.courseId));

  const categoryIds = [...new Set(completedBookings.map((b) => b.course.categoryId))];

  const where: any = { id: { notIn: bookedCourseIds } };
  if (categoryIds.length) where.categoryId = { in: categoryIds };

  const courses = await prisma.course.findMany({
    where,
    include: courseInclude,
    take: 6,
  });

  return courses.map(withAvgRating).sort((a: any, b: any) => b.avgRating - a.avgRating);
};

export const CourseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getRecommendations,
};
