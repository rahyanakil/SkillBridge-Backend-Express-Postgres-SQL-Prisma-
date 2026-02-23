// src/app/modules/booking/booking.validation.ts
import { z } from "zod";

export const createBookingValidation = z.object({
  body: z.object({
    courseId: z.string(),
    schedule: z.string().datetime("Invalid date-time format"),
  }),
});

export const updateBookingStatusValidation = z.object({
  body: z.object({
    status: z.enum([
      "PENDING",
      "ACCEPTED",
      "REJECTED",
      "COMPLETED",
      "CANCELLED",
    ]),
  }),
  params: z.object({
    id: z.string(),
  }),
});
