import { config } from "dotenv";
import path from "node:path";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
} from "shared";
import { createProxyMiddleware } from "http-proxy-middleware";
import { gatewayAuth } from "./middleware/gatewayAuth";
config({
  path: path.join(process.cwd(), ".env"),
});

config({
  path: path.join(process.cwd(), "../../.env"),
});

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3000/";

const app = express();

app.use(helmet());
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);
app.use(httpLogger);

app.use("health", (req, res) => {
  successResponse(
    res,
    {
      service: "api-gateway",
    },
    200,
  );
});

/**
 * AUTH PROXY :3000/auth/* -> :3001/auth/*
 */

app.use(
  "/auth",
  gatewayAuth,
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`,
  }),
);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  throw new AppError(404, "ROUTE NOT FOUND");
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API GATEWAY IS RUNNING ON PORT ${PORT}`);
});
