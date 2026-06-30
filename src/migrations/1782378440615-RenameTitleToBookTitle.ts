import type { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTitleToBookTitle1782378440615 implements MigrationInterface {
    name = 'RenameTitleToBookTitle1782378440615'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "books" RENAME COLUMN "id" TO "book_id"`);
        await queryRunner.query(`ALTER TABLE "books" RENAME COLUMN "title" TO "book_title"`);
        
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email" TO "user_email"`);


        await queryRunner.query(`ALTER TABLE "books" RENAME CONSTRAINT "books_pkey" TO "PK_552bd343dabd693159e284fe517"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "PK_users" TO "PK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_email" TO "UQ_643a0bfb9391001cf11e581bdd6"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_643a0bfb9391001cf11e581bdd6" TO "UQ_email"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "PK_96aac72f1574b88752e9fb00089" TO "PK_users"`);
        await queryRunner.query(`ALTER TABLE "books" RENAME CONSTRAINT "PK_552bd343dabd693159e284fe517" TO "books_pkey"`);

        // Rollback
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "user_email" TO "email"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "user_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "books" RENAME COLUMN "book_title" TO "title"`);
        await queryRunner.query(`ALTER TABLE "books" RENAME COLUMN "book_id" TO "id"`);
    }
}