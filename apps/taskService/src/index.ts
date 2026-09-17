import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";

import taskRouter from "./routes/task.router";

config({
  path: resolve(process.cwd(), ".env"),
});
config({
  path: resolve(process.cwd(), "../../.env"),
});

const PORT = process.env.TASK_PORT || 3002;

const app = express();

app.use(httpLogger);

app.use(express.json());

app.get("/health", (req, res) => {
  successResponse(res, { service: "taskService" }, 200);
});

//mounting routes

app.use("/tasks", requireGatewaySecret, taskRouter);

app.use((req, res, next) => {
  next(new AppError(404, "ROUTE NOT FOUND"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`TASK SERVICE IS RUNNING ON PORT ${PORT}`);
});
