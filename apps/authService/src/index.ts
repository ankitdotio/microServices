import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import authRoutes from "./routes/auth.routes";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const port = process.env.AUTH_PORT || 3001;

const app = express();

app.use(httpLogger);
app.use(express.json());

app.get("/health", (req, res) => {
  return successResponse(res, { success: "auth-service" }, 200);
});

app.use("/auth", requireGatewaySecret, authRoutes);

app.use("/auth", authRoutes);

app.use((req, res, next) => {
  next(new AppError(404, "ROUTE NOT FOUND"));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`AUTH SERIVCE IS NOW RUNNING ON PORT ${port}`);
});
