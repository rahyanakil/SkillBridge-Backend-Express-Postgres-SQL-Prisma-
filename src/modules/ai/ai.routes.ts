import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { AIController } from "./ai.controller";
import { askAIValidation } from "./ai.validation";

const router = express.Router();

router.post(
  "/ask",
  auth(UserRole.student, UserRole.tutor, UserRole.admin),
  validateRequest(askAIValidation),
  AIController.askAI,
);

export const AIRoutes = router;
