import { config } from "dotenv";
import path from "node:path";
import express from "express";
import {
  AppError,
  errorHandler,
  httpLogger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import attachmentRoutes from "./routes/media.routes";

config({
  path: path.resolve(process.cwd(), "./.env"),
});

config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const PORT = process.env.MEDIA_PORT || 3003;

const app = express();

app.use(httpLogger);

app.get("/health", (req, res) => {
  successResponse(res, { service: "media-service" }, 200);
});

app.use("/tasks", requireGatewaySecret, attachmentRoutes);

app.use((req, res, next) => {
  next(new AppError(404, "ROUTE NOT FOUND :)"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`MEDIA SERVICE IS UP AND RUNNING ON PORT ${PORT}`);
});
