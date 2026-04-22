import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createReview = async (studentId: string, payload: any) => {
  const { bookingId, rating, comment } = payload;

  // ১. বুকিং খুঁজে বের করা
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  // ২. স্টুডেন্ট কি নিজের বুকিংয়েই রিভিউ দিচ্ছে?
  if (booking.studentId !== studentId) throw new Error("Unauthorized");

  // ৩. চেক: স্ট্যাটাস কি বড় হাতের অক্ষরে 'COMPLETED'?
  // এনাম ব্যবহার করা নিরাপদ
  if (booking.status !== BookingStatus.COMPLETED)
    throw new Error("You can only review a completed booking");

  // ৪. ডুপ্লিকেট রিভিউ চেক
  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) throw new Error("You already reviewed this booking");

  // ৫. রিভিউ তৈরি করা
  const review = await prisma.review.create({
    data: {
      rating: Number(rating), // নিশ্চিত করো এটি যেন Float/Int হয়
      comment,
      studentId,
      tutorId: booking.tutorId,
      courseId: booking.courseId,
      bookingId,
    },
  });

  return review;
};

const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      Student: { select: { name: true, avatar: true } },
      course: { select: { title: true } },
    },
    take: 6, // হোম পেজের জন্য মাত্র ৬টি রিভিউ নিন
    orderBy: { createdAt: "desc" },
  });
};
const getReviewsForCourse = async (courseId: string) => {
  return await prisma.review.findMany({
    where: { courseId },
    include: {
      Student: {
        select: { name: true, avatar: true }, // শুধু দরকারি তথ্য নাও
      },
    },
    orderBy: { createdAt: "desc" }, // নতুন রিভিউ আগে দেখাবে
  });
};

const getReviewsForTutor = async (tutorId: string) => {
  return await prisma.review.findMany({
    where: { tutorId },
    include: {
      Student: { select: { name: true, avatar: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewsForCourse,
  getReviewsForTutor,
};
