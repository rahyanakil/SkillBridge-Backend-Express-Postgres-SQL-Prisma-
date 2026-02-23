import express from "express";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate";
import { categoryController } from "./category.controller";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "./category.validation";

const router = express.Router();

//public route
router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  auth(UserRole.admin),
  validateRequest(createCategoryValidation),
  categoryController.createCategory,
);
router.put(
  "/:id",
  validateRequest(updateCategoryValidation),
  auth(UserRole.admin),
  categoryController.updateCategory,
);
router.delete("/:id", auth(UserRole.admin), categoryController.deleteCategory);

export const CategoryRoutes = router;
