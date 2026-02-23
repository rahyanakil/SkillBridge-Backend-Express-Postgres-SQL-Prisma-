// src/app/modules/review/review.validation.ts
import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    bookingId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
});
