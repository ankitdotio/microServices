import { Router } from "express";
import { validateBody } from "shared";
import * as taskController from "../controllers/task.controller";
import { createTaskInputSchema } from "../schemas/task.schema";

const router = Router();

router.post(
  "/",
  validateBody(createTaskInputSchema),
  taskController.createTaskController,
);

router.get("/", taskController.listTaskController);

router.get("/:id", taskController.getSingleTaskController);

router.delete("/:id", taskController.deleteSingleTask);

export default router;
