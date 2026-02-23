// import { BookingStatus } from "@prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (studentId: string, payload: any) => {
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
  });
  if (!course) throw new Error("Course not Found");

  const tutorProfile = await prisma.tutor.findUnique({
    where: { id: course.tutorId },
  });
  if (tutorProfile?.userId === studentId) {
    throw new Error("You can't book your own course!");
  }
  const booking = await prisma.booking.create({
    data: {
      studentId: studentId,
      tutorId: course.tutorId,
      courseId: payload.courseId,
      date: new Date(payload.schedule),
      status: "PENDING",
    },
  });
  return booking;
};

const getBookingsByStudent = async (studentId: string) => {
  return await prisma.booking.findMany({
    where: { studentId },
    include: {
      course: true,
      tutor: { include: { user: true } },
    },
  });
};

const getBookingsByTutor = async (userId: string) => {
  const tutorProfile = await prisma.tutor.findUnique({
    where: { userId },
  });

  if (!tutorProfile) throw new Error("Tutor profile not found!");

  return await prisma.booking.findMany({
    where: { tutorId: tutorProfile.id },
    include: { course: true, student: true },
  });
};

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  status: BookingStatus,
) => {
  const tutorProfile = await prisma.tutor.findUnique({ where: { userId } });
  if (!tutorProfile) throw new Error("Tutor not found");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");

  if (booking.tutorId !== tutorProfile.id) throw new Error("Unauthorized");

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};

export const BookingService = {
  createBooking,
  getBookingsByStudent,
  getBookingsByTutor,
  updateBookingStatus,
};
