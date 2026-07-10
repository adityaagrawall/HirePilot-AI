import { Router, Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { syncUser } from "../services/userSync";

const router = Router();
const prisma = new PrismaClient();

// GET /api/profile
router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const dbUser = await syncUser(userId);

      // Get stats
      const totalAnalyses = await prisma.resume.count({
        where: { userId: dbUser.id },
      });

      const resumes = await prisma.resume.findMany({
        where: { userId: dbUser.id },
        select: { atsScore: true, matchScore: true },
      });

      const avgAtsScore =
        resumes.length > 0
          ? Math.round(
              resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) /
                resumes.length
            )
          : 0;

      const highestMatch =
        resumes.length > 0
          ? Math.max(...resumes.map((r) => r.matchScore || 0))
          : 0;

      res.json({
        user: dbUser,
        stats: {
          totalAnalyses,
          avgAtsScore,
          highestMatch,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
