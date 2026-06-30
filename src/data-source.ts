
import dotenv from "dotenv";
dotenv.config({ override: true });
import "reflect-metadata"; // TypeORM shenanigan to inject metadata in runtime
import { DataSource } from "typeorm";
import { Book } from "./entities/Book.ts";
import { User } from "./entities/User.ts";
import { Role } from "./entities/Role.ts";
import { Loan } from "./entities/Loan.ts";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  synchronize: false, // Auto-creating tables in DB 
  entities: [Book, User, Role, Loan],
  logging: false, // Auto creating logging to terminal
  // logging: process.env.NODE_ENV === 'development',
  migrations: ["./src/migrations/*.ts"], // Tells TypeORM where to find migrations
});
