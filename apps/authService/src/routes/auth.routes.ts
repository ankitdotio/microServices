import { Router } from "express";
import { validateBody } from "../../../../packages/shared/src/validation/validation";
import { loginSchema, registerSchema } from "../schema/auth.schemas";
import * as authController from "../controllers/auth.controller";

const router: Router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  authController.registerController,
);

router.post(
  "/login",
  validateBody(loginSchema),
  authController.loginController,
);

router.get("/getme", authController.getmeController);

export default router;
