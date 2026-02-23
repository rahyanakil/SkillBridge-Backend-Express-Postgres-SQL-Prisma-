// src/app/modules/admin/admin.route.ts
import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { AdminController } from "./admin.controller";
import { updateUserStatusValidation } from "./admin.validation";

const router = express.Router();

router.get("/users", auth(UserRole.admin), AdminController.getAllUsers);

router.patch(
  "/users/:userId",
  auth(UserRole.admin),
  validateRequest(updateUserStatusValidation),
  AdminController.updateUserStatus,
);

router.get("/bookings", auth(UserRole.admin), AdminController.getAllBookings);

router.delete(
  "/courses/:courseId",
  auth(UserRole.admin),
  AdminController.deleteCourse,
);

export const AdminRoutes = router;
