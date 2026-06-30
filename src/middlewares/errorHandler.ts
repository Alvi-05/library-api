// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the full error to your server console for debugging
  console.error("❌ API Error:", err.message || err);

  // Check for specific service layer business errors
  if (err.message.includes("not found")) {
    res.status(404).json({ success: false, error: err.message });
    return;
  }

  if (err.message.includes("already exists") || err.message.includes("Conflict")) {
    res.status(409).json({ success: false, error: err.message });
    return;
  }

  if (err.name === "QueryFailedError") {
    // Catch database-level constraint violations (e.g., duplicate entries) safely
    res.status(400).json({ success: false, error: "Database operation rejected due to invalid data format." });
    return;
  }

  // Fallback Catch-All for unexpected runtime crashes (500 Internal Server Error)
  res.status(500).json({ success: false, error: "An unexpected internal server error occurred." });
};