import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { CourseRoutes } from "../modules/course/course.route";
import { ReviewRoutes } from "../modules/review/review.routes";
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
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;
