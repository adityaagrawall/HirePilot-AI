import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({
      error: "Unauthorized",
      message: "You must be signed in to access this resource.",
    });
    return;
  }

  next();
}
