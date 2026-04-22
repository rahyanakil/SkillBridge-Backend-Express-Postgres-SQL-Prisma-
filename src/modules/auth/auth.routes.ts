import express from "express";
import multer from "multer";
import path from "path";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { AuthController } from "./auth.controller";
import { loginValidation, registerValidation } from "./auth.validation";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

router.post("/register", validateRequest(registerValidation), AuthController.createUser);
router.post("/login", validateRequest(loginValidation), AuthController.loginUser);
router.get("/get-me", auth(UserRole.admin, UserRole.student, UserRole.tutor), AuthController.getMe);
router.patch("/profile", auth(UserRole.admin, UserRole.student, UserRole.tutor), AuthController.updateProfile);
router.patch("/password", auth(UserRole.admin, UserRole.student, UserRole.tutor), AuthController.changePassword);
router.post("/avatar", auth(UserRole.admin, UserRole.student, UserRole.tutor), upload.single("avatar"), AuthController.uploadAvatar);

export const AuthRoutes = router;
