import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { AuthController } from "./auth.controller";
import { loginValidation, registerValidation } from "./auth.validation";

console.log("Auth route loaded");
const router = express.Router();
router.post(
  "/register",
  validateRequest(registerValidation),
  AuthController.createUser,
);
router.post(
  "/login",
  validateRequest(loginValidation),
  AuthController.loginUser,
);
export const AuthRoutes = router;

router.get(
  "/get-me",
  auth(UserRole.admin, UserRole.student, UserRole.tutor),
  AuthController.getMe,
);
