import { z } from "zod";

export const askAIValidation = z.object({
  body: z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"),
  }),
});
