// src/app/modules/category/category.validation.ts
import { z } from "zod";

export const createCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
  }),
});

export const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
  }),
  params: z.object({
    id: z.string(),
  }),
});
