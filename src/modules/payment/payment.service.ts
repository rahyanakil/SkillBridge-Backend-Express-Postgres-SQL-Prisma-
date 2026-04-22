import Stripe from "stripe";
import { notify } from "../../lib/notify";
import { prisma } from "../../lib/prisma";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (bookingId: string, studentId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { course: true },
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.paymentStatus === "PAID") throw new Error("This booking is already paid");
  if (!["PENDING", "ACCEPTED"].includes(booking.status))
    throw new Error("Only PENDING or ACCEPTED bookings can be paid");

  const amountInCents = Math.round(booking.course.price * 100);
  if (amountInCents < 50) throw new Error("Course price is below the minimum chargeable amount ($0.50)");

  const intent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: {
      bookingId,
      studentId,
      courseTitle: booking.course.title,
    },
    description: `SkillBridge session: ${booking.course.title}`,
  });

  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount: booking.course.price,
    currency: "USD",
    courseTitle: booking.course.title,
    bookingId,
  };
};

const verifyPayment = async (bookingId: string, paymentIntentId: string, studentId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { course: true },
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.paymentStatus === "PAID") return booking;

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded") throw new Error("Payment has not been confirmed by Stripe");

  // Guard: make sure the intent belongs to this booking
  if (intent.metadata.bookingId !== bookingId) throw new Error("Payment intent does not match this booking");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentStatus: "PAID" },
  });

  await notify(
    studentId,
    "PAYMENT_SUCCESS",
    "Payment Successful",
    `Payment confirmed for "${booking.course.title}"`,
  );

  return updated;
};

export const PaymentService = { createCheckout, verifyPayment };
