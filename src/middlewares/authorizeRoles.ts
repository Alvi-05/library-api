
import type { Request, Response, NextFunction } from "express";

// This middleware accepts a list of allowed roles (e.g., 'Admin', 'Librarian')
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    
    // 1. Check if the authentication middleware successfully attached a user to the request
    const user = (req as any).user; 

    if (!user || !user.role) {
      res.status(401).json({ success: false, error: "Unauthorized: No user role found." });
      return;
    }

    // 2. Check if the user's role is in the list of allowed roles
    const hasPermission = allowedRoles.includes(user.role.role_name);

    if (!hasPermission) {
      res.status(403).json({ 
        success: false, 
        error: `Forbidden: Requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
      return;
    }

    // 3. User is authorized, proceed to the controller!
    next();
  };
};