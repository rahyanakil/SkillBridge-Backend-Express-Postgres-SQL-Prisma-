import express from "express";
import { validateRequest } from "../../middlewares/validate";
import { AuthController } from "./auth.controller";
import { registerValidation } from "./auth.validation";

console.log("Auth route loaded");
const router = express.Router();
router.post(
  "/register",
  validateRequest(registerValidation),
  AuthController.createUser,
);
router.post(
  "/login",
  validateRequest(registerValidation),
  AuthController.loginUser,
);
export const AuthRoutes = router;
