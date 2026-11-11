import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDashboardAbility1761401356193 implements MigrationInterface {
  name = 'AddDashboardAbility1761401356193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum" RENAME TO "abilities_reference_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."abilities_reference_enum" AS ENUM('DASHBOARD', 'USER', 'ROLE', 'CUSTOMER', 'VEHICLE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "abilities" ALTER COLUMN "reference" TYPE "public"."abilities_reference_enum" USING "reference"::"text"::"public"."abilities_reference_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."abilities_reference_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."abilities_reference_enum_old" AS ENUM('USER', 'ROLE', 'CUSTOMER', 'VEHICLE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "abilities" ALTER COLUMN "reference" TYPE "public"."abilities_reference_enum_old" USING "reference"::"text"::"public"."abilities_reference_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."abilities_reference_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum_old" RENAME TO "abilities_reference_enum"`,
    );
  }
}
