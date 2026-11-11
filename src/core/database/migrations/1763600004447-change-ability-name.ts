import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAbilityName1763600004447 implements MigrationInterface {
  name = 'ChangeAbilityName1763600004447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum" RENAME TO "abilities_reference_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."abilities_reference_enum" AS ENUM('PARKING_RECORD', 'USER', 'ROLE', 'CUSTOMER', 'VEHICLE', 'OCCURRENCE')`,
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
      `CREATE TYPE "public"."abilities_reference_enum_old" AS ENUM('DASHBOARD', 'USER', 'ROLE', 'CUSTOMER', 'VEHICLE', 'OCCURRENCE')`,
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
