import z from "zod";

export const createUpdateTutorValidation = z.object({
  body: z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    expertise: z.string().min(3, "Expertise is required"),
    hourlyRate: z.number().positive("Hourly rate must be positive"),
    experience: z.number().int().min(0, "Experience must be 0 or more"),
  }),
});
