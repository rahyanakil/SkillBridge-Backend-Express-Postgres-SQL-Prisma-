import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { NotificationController } from "./notification.controller";

const router = express.Router();
const allRoles = auth(UserRole.admin, UserRole.student, UserRole.tutor);

router.get("/", allRoles, NotificationController.getAll);
router.get("/unread-count", allRoles, NotificationController.getUnreadCount);
router.patch("/read-all", allRoles, NotificationController.markAllAsRead);
router.patch("/:id/read", allRoles, NotificationController.markAsRead);

export const NotificationRoutes = router;
