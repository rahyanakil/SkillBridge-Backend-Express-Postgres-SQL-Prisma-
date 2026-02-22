import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { TutorRoutes } from "../modules/tutor/tutor.routes";

const router = Router();

const routerManager = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/tutors",
    route: TutorRoutes,
  },
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;
