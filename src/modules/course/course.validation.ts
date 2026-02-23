// src/app/modules/course/course.validation.ts
import { z } from "zod";

export const createCourseValidation = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    categoryId: z.string(),
    price: z.number().positive("Price must be positive"),
  }),
});

export const updateCourseValidation = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    categoryId: z.string().optional(),
    price: z.number().positive().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
