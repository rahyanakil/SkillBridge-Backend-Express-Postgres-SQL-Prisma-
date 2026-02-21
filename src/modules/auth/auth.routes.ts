import express from "express";
import { AuthController } from "./auth.controller";

console.log("Auth route loaded");
const router = express.Router();
router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
export const AuthRoutes = router;
