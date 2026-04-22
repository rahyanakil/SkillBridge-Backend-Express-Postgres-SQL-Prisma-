import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// POST /api/v1/payments/checkout  — create Stripe PaymentIntent, returns clientSecret
router.post("/checkout", auth(UserRole.student), PaymentController.checkout);

// POST /api/v1/payments/verify   — confirm payment after Stripe succeeds, marks booking PAID
router.post("/verify", auth(UserRole.student), PaymentController.verify);

export const PaymentRoutes = router;
