import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from "./User.ts";

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  role_id!: number;

  @Column({ type: "varchar", length: 50, unique: true })
  role_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  // Establishes the inverse relationship back to the User entity
  @OneToMany(() => User, (user) => user.role)
  users!: User[];

}