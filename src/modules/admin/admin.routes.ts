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

router.delete(
  "/users/:userId",
  auth(UserRole.admin),
  AdminController.deleteUser,
);

router.get("/bookings", auth(UserRole.admin), AdminController.getAllBookings);
router.patch("/bookings/:bookingId/status", auth(UserRole.admin), AdminController.updateBookingStatus);

router.delete("/courses/:courseId", auth(UserRole.admin), AdminController.deleteCourse);

router.post("/categories", auth(UserRole.admin), AdminController.createCategory);
router.delete("/categories/:categoryId", auth(UserRole.admin), AdminController.deleteCategory);

router.get("/stats", auth(UserRole.admin), AdminController.getStats);

export const AdminRoutes = router;
