// src/app/modules/course/course.route.ts
import express from "express";
import { CourseController } from "./course.controller";

import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import {
  createCourseValidation,
  updateCourseValidation,
} from "./course.validation";

const router = express.Router();

// Public
router.get("/", CourseController.getAllCourses);
router.get("/:id", CourseController.getCourse);

// Tutor-only
router.post(
  "/",
  auth(UserRole.tutor),
  validateRequest(createCourseValidation),
  CourseController.createCourse,
);
router.put(
  "/:id",
  auth(UserRole.tutor),
  validateRequest(updateCourseValidation),
  CourseController.updateCourse,
);
router.delete("/:id", auth(UserRole.tutor), CourseController.deleteCourse);

export const CourseRoutes = router;
