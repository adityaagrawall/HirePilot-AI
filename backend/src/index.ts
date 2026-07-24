import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import analyzeRouter from "./routes/analyze";
import historyRouter from "./routes/history";
import profileRouter from "./routes/profile";
import { buildTailoredResume } from "./services/resumeBuilder";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security & logging
app.use(helmet());
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Clerk auth
app.use(clerkMiddleware());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too Many Requests", message: "Global rate limit exceeded." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    try {
      const { userId } = getAuth(req);
      return userId || req.ip || "anonymous";
    } catch {
      return req.ip || "anonymous";
    }
  },
});

app.use("/api", globalLimiter);

// Routes
app.use("/api/analyze", analyzeRouter);
app.use("/api", historyRouter);
app.use("/api/profile", profileRouter);

// Build Tailored Resume Rate Limiter
const buildResumeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too Many Requests", message: "Resume build limit reached (10 per hour)." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    try {
      const { userId } = getAuth(req);
      return userId || req.ip || "anonymous";
    } catch {
      return req.ip || "anonymous";
    }
  },
});

const buildResumeSchema = z.object({
  resumeText: z.string().min(100, "Resume is too short").max(50000, "Resume is too long"),
  jobDescription: z.string().min(50, "JD is too short").max(20000, "JD is too long"),
  analysisData: z.record(z.any(), { message: "Invalid analysis data" }),
});

// Build Tailored Resume Endpoint
app.post(
  "/api/analyze/build-resume",
  requireAuth(),
  buildResumeLimiter,
  async (req, res, next) => {
    try {
      const validation = buildResumeSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({ 
          error: "Validation Error", 
          message: validation.error.errors[0]?.message || "Invalid input"
        });
        return;
      }

      const { resumeText, jobDescription, analysisData } = validation.data;

      const structuredResume = await buildTailoredResume(
        resumeText,
        jobDescription,
        analysisData
      );

      res.json(structuredResume);
    } catch (error) {
      next(error);
    }
  }
);

// Global error handler
app.use(errorHandler);

// Crash safety
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

app.listen(PORT, () => {
  console.log(`🚀 HirePilot API running on http://localhost:${PORT}`);
});

export default app;
