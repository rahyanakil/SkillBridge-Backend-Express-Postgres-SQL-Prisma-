// src/app/modules/admin/admin.validation.ts
import { z } from "zod";

export const updateUserStatusValidation = z.object({
  body: z.object({
    isBanned: z.boolean(),
  }),
});
