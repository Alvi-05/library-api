import { Router } from "express";
import { LoanController } from "../controllers/LoanController.ts";
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { authorizeRoles } from "../middlewares/authorizeRoles.ts";

const router = Router();
const loanController = new LoanController();


// Issuing a book (Admin only)
router.post("/issue", authenticateToken, authorizeRoles("Admin"), loanController.issueBook);

// Viewing loans for the authenticated user (User only)
router.get("/my-loans", authenticateToken,authorizeRoles("User"), loanController.getMyLoans.bind(loanController));

// Fetching an issued loan by ID (Admin only)
router.get("/:id", authenticateToken, authorizeRoles("Admin"), loanController.getIssuedBook);

// Returning an issued book (Admin only)
router.post("/return/:id", authenticateToken, authorizeRoles("Admin"), loanController.returnIssuedBook);

export default router;