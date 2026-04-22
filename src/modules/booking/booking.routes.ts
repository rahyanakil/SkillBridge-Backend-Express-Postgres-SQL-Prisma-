import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { BookingController } from "./booking.controller";
import { createBookingValidation, updateBookingStatusValidation } from "./booking.validation";

const router = express.Router();

router.post("/", auth(UserRole.student), validateRequest(createBookingValidation), BookingController.createBooking);

router.get("/my-bookings", auth(UserRole.student), BookingController.getStudentBookings);
router.get("/completed", auth(UserRole.student), BookingController.getCompletedBookings);
router.patch("/:id/cancel", auth(UserRole.student), BookingController.cancelBooking);

router.get("/tutor-bookings", auth(UserRole.tutor), BookingController.getTutorBookings);
router.patch("/:id/status", auth(UserRole.tutor), validateRequest(updateBookingStatusValidation), BookingController.updateBookingStatus);

router.get("/:id/classroom", auth(UserRole.student, UserRole.tutor), BookingController.getClassroomLink);

export const BookingRoutes = router;
