// src/app/middleware/validate.ts
import { ZodObject } from "zod";

export const validateRequest = (schema: ZodObject<any>) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: any) {
      next(error);
    }
  };
};
