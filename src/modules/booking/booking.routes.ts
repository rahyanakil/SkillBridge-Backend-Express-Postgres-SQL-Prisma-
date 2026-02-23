// src/app/modules/booking/booking.route.ts
import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { BookingController } from "./booking.controller";
import {
  createBookingValidation,
  updateBookingStatusValidation,
} from "./booking.validation";

const router = express.Router();

// --- Student Routes ---
router.post(
  "/",
  auth(UserRole.student),
  validateRequest(createBookingValidation),
  BookingController.createBooking,
);

//student own booking list
router.get(
  "/my-bookings",
  auth(UserRole.student),
  BookingController.getStudentBookings,
);

// --- Tutor Routes ---

// Tutor booking grant list
router.get(
  "/tutor-bookings",
  auth(UserRole.tutor),
  BookingController.getTutorBookings,
);

// update booking status(Accepted/Rejected)
router.patch(
  "/:id/status",
  auth(UserRole.tutor),
  validateRequest(updateBookingStatusValidation),
  BookingController.updateBookingStatus,
);

export const BookingRoutes = router;
