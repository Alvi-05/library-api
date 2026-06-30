import { type MigrationInterface, type QueryRunner } from "typeorm";

export class CreateUsersTable1718000000000 implements MigrationInterface {
  name = 'CreateUsersTable1718000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL, 
        "email" character varying NOT NULL, 
        "password" character varying NOT NULL, 
        CONSTRAINT "UQ_email" UNIQUE ("email"), 
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}