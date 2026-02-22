// src/app/modules/auth/auth.validation.ts
import { z } from "zod";

export const registerValidation = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["STUDENT", "TUTOR", "ADMIN"]).optional(),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});
