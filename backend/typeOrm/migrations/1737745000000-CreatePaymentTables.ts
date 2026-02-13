import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: CreatePaymentTables
 *
 * Creates orders, payments, emis, course_access for payment/EMI and course access.
 */
export class CreatePaymentTables1737745000000 implements MigrationInterface {
  name = 'CreatePaymentTables1737745000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "student_id" uuid NOT NULL,
        "course_id" uuid NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "razorpay_order_id" character varying(255),
        "status" character varying(50) NOT NULL DEFAULT 'created',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_student_id" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_orders_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_orders_student_id" ON "orders" ("student_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_course_id" ON "orders" ("course_id")`);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "razorpay_payment_id" character varying(255),
        "status" character varying(50) NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_payments_order_id" ON "payments" ("order_id")`);

    await queryRunner.query(`
      CREATE TABLE "emis" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "installment_number" integer NOT NULL,
        "due_date" date NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "status" character varying(50) NOT NULL DEFAULT 'pending',
        "paid_at" TIMESTAMP,
        CONSTRAINT "PK_emis" PRIMARY KEY ("id"),
        CONSTRAINT "FK_emis_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_emis_order_id" ON "emis" ("order_id")`);

    await queryRunner.query(`
      CREATE TABLE "course_access" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "student_id" uuid NOT NULL,
        "course_id" uuid NOT NULL,
        "order_id" uuid,
        "status" character varying(50) NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_access" PRIMARY KEY ("id"),
        CONSTRAINT "FK_course_access_student_id" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_course_access_course_id" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_course_access_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_course_access_student_id" ON "course_access" ("student_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_course_access_course_id" ON "course_access" ("course_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_course_access_course_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_course_access_student_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_access"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_emis_order_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "emis"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_payments_order_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_orders_course_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_orders_student_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
  }
}
