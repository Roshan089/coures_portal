import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: CreateCoursesTable
 *
 * Creates courses: title, description, teacher_id (FK -> teacher_profiles.id),
 * is_published, created_at, updated_at.
 */
export class CreateCoursesTable1737744700000 implements MigrationInterface {
  name = 'CreateCoursesTable1737744700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "teacher_id" uuid NOT NULL,
        "is_published" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_courses_teacher_id" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_courses_teacher_id" ON "courses" ("teacher_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_courses_teacher_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "courses"`);
  }
}
