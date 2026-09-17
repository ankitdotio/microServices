import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  getPool,
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

app.use((req, res, next) => {
  console.log("AUTH SERVICE RECEIVED:", {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
  });

  next();
});

app.use("/auth", requireGatewaySecret, authRoutes);

app.use((req, res, next) => {
  next(new AppError(404, "ROUTE NOT FOUND"));
});

app.use(errorHandler);

app.listen(port, async () => {
  logger.info(`AUTH SERVICE IS NOW RUNNING ON PORT ${port}`);

  try {
    const result = await getPool().query("SELECT NOW()");
    console.log("DATABASE CONNECTED:", result.rows);
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);
  }
});
