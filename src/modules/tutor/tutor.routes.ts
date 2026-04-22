import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { TutorController } from "./tutor.controller";
import { createUpdateTutorValidation } from "./tutor.validation";

const router = express.Router();

router.post("/profile", auth(UserRole.tutor), validateRequest(createUpdateTutorValidation), TutorController.createOrUpdateProfile);
router.get("/me", auth(UserRole.tutor), TutorController.getMyProfile);
router.get("/earnings", auth(UserRole.tutor), TutorController.getEarnings);
router.get("/profile/:id", TutorController.getProfileByUserId);
router.get("/", TutorController.getAllTutors);

export const TutorRoutes = router;
