import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";

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

// Routes
app.use("/api/analyze", analyzeRouter);
app.use("/api", historyRouter);
app.use("/api/profile", profileRouter);

// Build Tailored Resume Endpoint
app.post(
  "/api/analyze/build-resume",
  requireAuth(),
  async (req, res) => {
    try {
      const { resumeText, jobDescription, analysisData } = req.body;

      if (!resumeText || !jobDescription || !analysisData) {
        res.status(400).json({ error: "resumeText, jobDescription, and analysisData are required" });
        return;
      }

      const structuredResume = await buildTailoredResume(
        resumeText,
        jobDescription,
        analysisData
      );

      res.json(structuredResume);
    } catch (error) {
      console.error("Resume Build Error:", error);
      res.status(500).json({ error: "Failed to build tailored resume" });
    }
  }
);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 HirePilot API running on http://localhost:${PORT}`);
});

export default app;
