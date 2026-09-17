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
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";
console.log(process.env.AUTH_SERVICE_URL);

const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3002";

const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:3003";
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

app.use("/health", (req, res) => {
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
    pathRewrite: (path) => {
      console.log("PATH RECEIVED BY PROXY:", path);

      const rewritten = `/auth${path}`;

      console.log("PATH SENT TO AUTH:", rewritten);

      return rewritten;
    },
    on: {
      proxyReq: (proxyReq, req) => {
        console.log("PROXY REQUEST SENT:", {
          method: req.method,
          url: req.url,
          target: proxyReq.path,
        });
      },

      proxyRes: (proxyRes, req) => {
        console.log("PROXY RESPONSE:", {
          status: proxyRes.statusCode,
          url: req.url,
        });
      },

      error: (err, req) => {
        console.error("PROXY ERROR:", err);
      },
    },
  }),
);

const taskProxy = createProxyMiddleware({
  target: TASK_SERVICE_URL,
  changeOrigin: true,

  pathRewrite: (currentPath) => `/tasks/${currentPath}`,
});

const mediaProxy = createProxyMiddleware({
  target: MEDIA_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});

app.use("/tasks", gatewayAuth, (req, res, next) => {
  if (req.path.includes("attachments")) {
    return mediaProxy(req, res, next);
  }
  return taskProxy(req, res, next);
});
// app.use(
//   "/tasks",
//   gatewayAuth,
//   createProxyMiddleware({
//     target: TASK_SERVICE_URL,
//     changeOrigin: true,

//     pathRewrite: (currentPath) => {
//       console.log("TASK PATH RECEIVED:", currentPath);

//       const rewritten = currentPath === "/" ? "/tasks" : `/tasks${currentPath}`;

//       console.log("TASK PATH SENT:", rewritten);

//       return rewritten;
//     },

//     on: {
//       proxyReq: (proxyReq, req) => {
//         console.log("TASK PROXY REQUEST:", {
//           method: req.method,
//           url: req.url,
//           target: proxyReq.path,
//         });
//       },

//       proxyRes: (proxyRes, req) => {
//         console.log("TASK PROXY RESPONSE:", {
//           status: proxyRes.statusCode,
//           url: req.url,
//         });
//       },

//       error: (err, req) => {
//         console.error("TASK PROXY ERROR:", err);
//       },
//     },
//   }),
// );
app.use((_req: Request, _res: Response, next: NextFunction) => {
  throw new AppError(404, "ROUTE NOT FOUND:)");
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API GATEWAY IS RUNNING ON PORT ${PORT}`);
});
