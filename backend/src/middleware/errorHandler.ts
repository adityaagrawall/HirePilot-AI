import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    console.error("[Error]", err.stack || err.message);
  } else {
    console.error("[Error]", err.message); // Only log the message, not the stack in prod
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: isDev
      ? err.message
      : "Something went wrong. Please try again.",
    ...(isDev && { stack: err.stack }), // Attach stack trace only in dev mode
  });
}
