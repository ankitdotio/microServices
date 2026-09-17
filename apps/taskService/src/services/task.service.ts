import { createTaskInput } from "../schemas/task.schema";
import * as taskRepo from "../repositories/task.repositories";
import { converToPublicTask } from "../utils/tasks.utils";
import { AppError } from "shared";

export const createTask = async (input: createTaskInput, userId: string) => {
  const newlyCreatedTask = await taskRepo.createTask({
    title: input.title,
    created_by: userId,
  });

  return converToPublicTask(newlyCreatedTask);
};

export const listTaskService = async (userId: string, role: string) => {
  if (!userId || !role) {
    throw new AppError(401, "MISSING OR INVALID USER IDENTITY");
  }

  const tasks = await taskRepo.listTasks({ userId, role });

  return tasks.map(converToPublicTask);
};

export const getSingleTaskService = async (
  id: string,
  userId: string,
  role: string,
) => {
  const task = await taskRepo.findSingleTaskById(id);

  if (role != "ADMIN" || task?.created_by != userId) {
    throw new AppError(403, "FORBIDDEN");
  }

  return converToPublicTask(task);
};

export const deleteTaskService = async (id: string, role: string) => {
  if (role !== "ADMIN") {
    throw new AppError(403, "FORBIDDEN");
  }
  const task = taskRepo.findSingleTaskById(id);

  if (!task) {
    throw new AppError(404, "TASK NOT FOUND");
  }

  await taskRepo.deleteSingleTaskById(id);

  return { id };
};
