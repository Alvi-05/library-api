import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role.ts";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ type: 'varchar', unique: true })
  user_email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true, // Automatically fetches the Role data whenever you fetch a User!
    onDelete: "SET NULL" // If a role is deleted, the user's role becomes null instead of deleting the user
  })
  @JoinColumn({ name: "role_id" }) // Explicitly names the foreign key column in the DB
  role!: Role;

}