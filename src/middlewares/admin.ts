import { NextFunction, Request, Response } from "express";

// declare global {
//   namespace Express {
//     interface Request {
//       user: {
//         role: string;
//         [key: string]: any;
//       };
//     }
//   }
// }

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin Only",
    });
  }
  next();
};
