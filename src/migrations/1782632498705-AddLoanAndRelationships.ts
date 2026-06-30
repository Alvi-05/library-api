import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoanAndRelationships1782632498705 implements MigrationInterface {
    name = 'AddLoanAndRelationships1782632498705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("role_id" SERIAL NOT NULL, "role_name" character varying(50) NOT NULL, "description" text, CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loan_status_enum" AS ENUM('Issued', 'Returned', 'Overdue')`);
        await queryRunner.query(`CREATE TABLE "loan" ("loan_id" SERIAL NOT NULL, "issue_date" date NOT NULL, "due_date" date NOT NULL, "returned_date" date, "status" "public"."loan_status_enum" NOT NULL DEFAULT 'Issued', "book_id" integer, "user_id" integer, CONSTRAINT "PK_ace34e1131b2b4f95e2b945a6d1" PRIMARY KEY ("loan_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan" ADD CONSTRAINT "FK_f6371fa812ea961c326e0ef2da4" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan" ADD CONSTRAINT "FK_53e13d0f4512c420ceb586f6737" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" DROP CONSTRAINT "FK_53e13d0f4512c420ceb586f6737"`);
        await queryRunner.query(`ALTER TABLE "loan" DROP CONSTRAINT "FK_f6371fa812ea961c326e0ef2da4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
        await queryRunner.query(`DROP TABLE "loan"`);
        await queryRunner.query(`DROP TYPE "public"."loan_status_enum"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
