import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";

const router = Router();

const routerManager = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  // {
  //     path:"tutor",
  //     route
  // }
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;
