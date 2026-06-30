import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = 'super-secret-key-change-in-production';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verifies the token using the shared JWT_SECRET constant
    const decoded = jwt.verify(token, JWT_SECRET as string);

    // Attach the decoded user data (e.g., id, role) to the request
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: "Forbidden: Invalid or expired token" });
  }
};