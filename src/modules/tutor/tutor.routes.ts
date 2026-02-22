import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { TutorController } from "./tutor.controller";

const router = express.Router();

router.post(
  "/profile",
  auth(UserRole.tutor),
  TutorController.createOrUpdateProfile,
);
router.get(
  "/profile/:id",
  auth(UserRole.tutor),
  TutorController.getProfileByUserId,
);
//get all tutor public route
router.get("/", TutorController.getAllTutors);

export const TutorRoutes = router;
