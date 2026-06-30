import { AppDataSource } from "../data-source.ts";
import { Loan } from "../entities/Loan.ts";
import { User } from "../entities/User.ts";
import { Book } from "../entities/Book.ts";
import { Logger } from "../utils/Logger.ts";

export class LoanService {
  private loanRepository = AppDataSource.getRepository(Loan);

  public async issueBook(user_id: number, book_id: number, due_date: string): Promise<Loan> {
    Logger.info(`LoanService: Issuing book`, { user_id, book_id });

    const issueDate = new Date().toISOString().split('T')[0]!;

    // TypeORM requires object references for foreign keys when creating
    const newLoan = this.loanRepository.create({
      user: { user_id } as User,
      book: { book_id } as Book,
      issue_date: issueDate,
      due_date,
      status: "Issued"
    });
    
    return await this.loanRepository.save(newLoan);
  }

  public async getIssuedBook(loan_id: number): Promise<Loan | null> {
    Logger.info(`LoanService: Fetching issued loan`, { loan_id });

    return await this.loanRepository.findOne({
      where: { loan_id, status: "Issued" },
      relations: { book: true, user: true },
    });
  }

  public async returnIssuedBook(loan_id: number): Promise<Loan> {
    Logger.info(`LoanService: Returning issued book`, { loan_id });

    const loan = await this.loanRepository.findOne({
      where: { loan_id, status: "Issued" },
      relations: { book: true, user: true },
    });

    if (!loan) {
      throw new Error('Issued loan not found or already returned');
    }

    loan.returned_date = new Date().toISOString().split('T')[0]!;
    loan.status = "Returned";

    return await this.loanRepository.save(loan);
  }

  public async getLoansByUser(user_id: number): Promise<Loan[]> {
    Logger.info(`LoanService: Fetching loans for user`, { user_id });

    return await this.loanRepository.find({
      where: { user: { user_id } },
      relations: { book: true },
      order: { issue_date: 'DESC' },
    });
  }
}