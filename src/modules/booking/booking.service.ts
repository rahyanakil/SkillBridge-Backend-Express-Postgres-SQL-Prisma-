import { BookingStatus } from "../../../generated/prisma/enums";
import { notify } from "../../lib/notify";
import { prisma } from "../../lib/prisma";

const createBooking = async (studentId: string, payload: any) => {
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
    include: { tutor: { include: { user: true } } },
  });
  if (!course) throw new Error("Course not Found");

  if (course.tutor.userId === studentId)
    throw new Error("You can't book your own course!");

  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      courseId: payload.courseId,
      status: { in: [BookingStatus.PENDING, BookingStatus.ACCEPTED] },
    },
  });
  if (existingBooking)
    throw new Error("You already have an active booking for this course!");

  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorId: course.tutorId,
      courseId: payload.courseId,
      date: new Date(payload.schedule),
      status: "PENDING",
    },
  });

  const student = await prisma.user.findUnique({ where: { id: studentId } });
  await notify(
    course.tutor.userId,
    "BOOKING_REQUEST",
    "New Booking Request",
    `${student?.name} booked your course "${course.title}"`,
  );

  return booking;
};

const getBookingsByStudent = async (studentId: string) => {
  return await prisma.booking.findMany({
    where: { studentId },
    include: { course: true, tutor: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getCompletedByStudent = async (studentId: string) => {
  return await prisma.booking.findMany({
    where: { studentId, status: BookingStatus.COMPLETED },
    include: {
      course: { include: { category: true } },
      tutor: { include: { user: true } },
      review: true,
    },
    orderBy: { updatedAt: "desc" },
  });
};

const getBookingsByTutor = async (userId: string) => {
  const tutorProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutorProfile) throw new Error("Tutor profile not found!");
  return await prisma.booking.findMany({
    where: { tutorId: tutorProfile.id },
    include: { course: true, student: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  status: BookingStatus,
) => {
  const tutorProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutorProfile) throw new Error("Tutor not found");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { course: true },
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.tutorId !== tutorProfile.id) throw new Error("Unauthorized");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  const statusMessages: Record<string, string> = {
    ACCEPTED: `Your booking for "${booking.course.title}" was accepted!`,
    REJECTED: `Your booking for "${booking.course.title}" was rejected.`,
    COMPLETED: `Your session for "${booking.course.title}" is marked complete.`,
  };
  if (statusMessages[status]) {
    await notify(
      booking.studentId,
      `BOOKING_${status}`,
      `Booking ${status}`,
      statusMessages[status],
    );
  }

  return updated;
};

const cancelBooking = async (bookingId: string, studentId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { course: true, tutor: true },
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (!["PENDING", "ACCEPTED"].includes(booking.status))
    throw new Error("Only PENDING or ACCEPTED bookings can be cancelled");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  });

  await notify(
    booking.tutor.userId,
    "BOOKING_CANCELLED",
    "Booking Cancelled",
    `A student cancelled their booking for "${booking.course.title}".`,
  );

  return updated;
};

const generateClassroomLink = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true, course: true },
  });
  if (!booking) throw new Error("Booking not found");

  const isStudent = booking.studentId === userId;
  const isTutor = booking.tutor.userId === userId;
  if (!isStudent && !isTutor) throw new Error("Unauthorized");

  if (!["ACCEPTED", "COMPLETED"].includes(booking.status))
    throw new Error("Classroom is only available for accepted bookings");

  if (booking.classroomLink) return { classroomLink: booking.classroomLink };

  const roomName = `SkillBridge-${booking.course.title.replace(/\s+/g, "-")}-${bookingId.slice(0, 8)}`;
  const link = `https://meet.jit.si/${encodeURIComponent(roomName)}`;

  await prisma.booking.update({ where: { id: bookingId }, data: { classroomLink: link } });
  return { classroomLink: link };
};

export const BookingService = {
  createBooking,
  getBookingsByStudent,
  getCompletedByStudent,
  getBookingsByTutor,
  updateBookingStatus,
  cancelBooking,
  generateClassroomLink,
};
