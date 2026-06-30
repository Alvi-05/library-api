import type { Request, Response, NextFunction } from "express";
import { LoanService } from "../services/LoanService.ts";
import { Logger } from "../utils/Logger.ts";

export class LoanController {
  private loanService = new LoanService();

  public issueBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Logger.info(`LoanController: POST /loans/issue triggered`);
    try {
      const { user_id, book_id, due_date, status } = req.body;

      if(!user_id || !book_id || !due_date) {
        res.status(400).json({ success: false, error: 'user_id, book_id, and due_date are required' });
        return;
      }

      if (status && status !== "Issued") {
        res.status(400).json({ success: false, error: 'Invalid status. Only "Issued" is allowed when issuing a book.' });
        return;
      }

      const loan = await this.loanService.issueBook(user_id, book_id, due_date);

      res.status(201).json({ success: true, data: loan });
      Logger.info(`LoanController: Successfully issued book`, { loan_id: loan.loan_id, user_id, book_id });
    } catch (error) {
      Logger.error(`LoanController: Error issuing book`, { error });
      next(error);
    }
  };

  public getIssuedBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Logger.info(`LoanController: GET /loans/:id triggered`);
    try {
      const loanId = Number(req.params.id);

      const loan = await this.loanService.getIssuedBook(loanId);
      if (!loan) {
        res.status(404).json({ success: false, error: 'Issued loan not found' });
        return;
      }

      res.json({
        success: true,
        data: {
          loan_id: loan.loan_id,
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          returned_date: loan.returned_date,
          status: loan.status,
          book: loan.book,
          user: {
            user_id: loan.user.user_id,
            user_email: loan.user.user_email,
          },
        },
      });
    } catch (error) {
      Logger.error(`LoanController: Error fetching issued book`, { error });
      next(error);
    }
  };

  public returnIssuedBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Logger.info(`LoanController: POST /loans/return/:id triggered`);
    try {
      const loanId = Number(req.params.id);

      const loan = await this.loanService.returnIssuedBook(loanId);

      Logger.info(`LoanController: Successfully returned issued book`, { loan_id: loan.loan_id });
      res.json({ success: true, data: loan });
    } catch (error) {
      Logger.error(`LoanController: Error returning issued book`, { error });
      res.status(404).json({ success: false, error: (error as Error).message });
    }
  };

  public getMyLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Logger.info(`LoanController: GET /loans/my-loans triggered`);
    try {
      const user = (req as any).user;
      if (!user || (!user.id && !user.user_id)) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const userId = Number(user.id ?? user.user_id);
      const loans = await this.loanService.getLoansByUser(userId);

      const data = loans.map(loan => ({
        loan_id: loan.loan_id,
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        returned_date: loan.returned_date,
        status: loan.status,
        book: loan.book,
      }));

      res.json({ success: true, data });
      Logger.info(`LoanController: Successfully fetched user loans`, { user_id: userId, count: data.length });
    } catch (error) {
      Logger.error(`LoanController: Error fetching user loans`, { error });
      next(error);
    }
  };
}