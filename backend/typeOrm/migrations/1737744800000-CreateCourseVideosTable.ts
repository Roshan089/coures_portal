import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: CreateCourseVideosTable
 *
 * Creates course_videos: course_id (FK -> courses.id), title, description,
 * url, sort_order, created_at, updated_at.
 */
export class CreateCourseVideosTable1737744800000 implements MigrationInterface {
  name = 'CreateCourseVideosTable1737744800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "course_videos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "course_id" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text,
        "url" character varying(1000) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_videos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_course_videos_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_course_videos_course_id" ON "course_videos" ("course_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_course_videos_course_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_videos"`);
  }
}
