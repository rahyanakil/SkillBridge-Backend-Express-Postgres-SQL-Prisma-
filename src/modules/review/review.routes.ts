// src/app/modules/review/review.route.ts
import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { ReviewController } from "./review.controller";
import { createReviewValidation } from "./review.validation";

const router = express.Router();

// ১. রিভিউ তৈরি (শুধুমাত্র স্টুডেন্টের জন্য)
router.post(
  "/",
  auth(UserRole.student),
  validateRequest(createReviewValidation),
  ReviewController.createReview,
);

// ২. একটি নির্দিষ্ট কোর্সের সব রিভিউ দেখা (পাবলিক - যে কেউ দেখতে পারবে)
router.get("/course/:courseId", ReviewController.getReviewsForCourse);

// ৩. একটি নির্দিষ্ট টিউটরের সব রিভিউ দেখা (পাবলিক)
router.get("/tutor/:tutorId", ReviewController.getReviewsForTutor);

export const ReviewRoutes = router;
