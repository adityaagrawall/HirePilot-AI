import { Router, Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { analyzeResume } from "../services/gemini";
import { syncUser } from "../services/userSync";

const router = Router();
const prisma = new PrismaClient();

// Rate limit: 10 analyses per hour per user
const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: "Too Many Requests",
    message: "You've reached the limit of 10 analyses per hour. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const { userId } = getAuth(req);
    return userId || req.ip || "anonymous";
  },
});

const analyzeSchema = z.object({
  resumeText: z
    .string()
    .min(100, "Resume must be at least 100 characters.")
    .max(50000, "Resume is too long."),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters.")
    .max(20000, "Job description is too long."),
  title: z.string().min(1).max(200).optional(),
});

// POST /api/analyze
router.post(
  "/",
  requireAuth,
  analyzeLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Validate input
      const validation = analyzeSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: "Validation Error",
          message: validation.error.errors[0]?.message || "Invalid input",
        });
        return;
      }

      const { resumeText, jobDescription, title } = validation.data;

      // Sync user to DB
      const dbUser = await syncUser(userId);

      // Run Gemini analysis
      const analysisResult = await analyzeResume(resumeText, jobDescription);

      // Save Resume
      const resume = await prisma.resume.create({
        data: {
          userId: dbUser.id,
          title: title || `Analysis — ${new Date().toLocaleDateString()}`,
          resumeText,
          atsScore: analysisResult.atsScore,
          matchScore: analysisResult.matchScore,
        },
      });

      // Save Analysis
      const analysis = await prisma.analysis.create({
        data: {
          resumeId: resume.id,
          jobDescription,
          summary: analysisResult.summary,
          missingKeywords: analysisResult.missingKeywords,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          suggestions: analysisResult.suggestions,
          experienceRewrite: analysisResult.experienceRewrite,
          projects: analysisResult.projects,
          skills: analysisResult.skills,
          certifications: analysisResult.certifications,
          interviewQuestions: analysisResult.interviewQuestions,
          coverLetter: analysisResult.coverLetter,
        },
      });

      res.status(200).json({
        resumeId: resume.id,
        analysisId: analysis.id,
        ...analysisResult,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
