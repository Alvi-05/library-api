import { Router } from "express";
import { RoleController } from "../controllers/RoleController.ts";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
import { authorizeRoles } from "../middlewares/authorizeRoles.ts";

const router = Router();
const roleController = new RoleController();

// ONLY Admins can create roles
router.post("/", authenticateToken, authorizeRoles("Admin"), roleController.createRole);

export default router;