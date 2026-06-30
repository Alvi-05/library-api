import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.ts";
import { Book } from "./Book.ts";

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
    loan_id!: number;

  @ManyToOne(() => Book)
    @JoinColumn({ name: "book_id" })
    book!: Book;

  @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User;

  @Column({ type: "date" })
    issue_date!: string;

  @Column({ type: "date" })
    due_date!: string;

  @Column({ type: "date", nullable: true })
    returned_date!: string;

  @Column({ type: "enum", enum: ["Issued", "Returned", "Overdue"], default: "Issued" })
    status!: string;
}