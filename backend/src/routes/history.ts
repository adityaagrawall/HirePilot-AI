import { Router, Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { syncUser } from "../services/userSync";

const router = Router();
const prisma = new PrismaClient();

// GET /api/history
router.get(
  "/history",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const dbUser = await syncUser(userId);

      const resumes = await prisma.resume.findMany({
        where: { userId: dbUser.id },
        include: {
          analyses: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ history: resumes });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/history/:id
router.get(
  "/history/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const dbUser = await syncUser(userId);

      const resume = await prisma.resume.findFirst({
        where: { id: req.params.id, userId: dbUser.id },
        include: {
          analyses: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!resume) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json({ resume });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/history/:id
router.delete(
  "/history/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const dbUser = await syncUser(userId);

      // Verify ownership before deleting
      const resume = await prisma.resume.findFirst({
        where: { id: req.params.id, userId: dbUser.id },
      });

      if (!resume) {
        res.status(404).json({ error: "Not found or access denied" });
        return;
      }

      await prisma.resume.delete({ where: { id: req.params.id } });

      res.json({ success: true, message: "Analysis deleted." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
