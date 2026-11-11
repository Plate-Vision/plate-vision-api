import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUuidColumn1758995241638 implements MigrationInterface {
  name = 'CreateUuidColumn1758995241638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD CONSTRAINT "UQ_1a080b1f5b714dd0a95dff2566f" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD CONSTRAINT "UQ_6dea067fc4e5e71e9ae95ed89a2" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_cdc7776894e484eaed828ca0616" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_a41cc8fde9ac3d9bcb91412c596" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "customers"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "UQ_44081a0503cec549614d57eba9a" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "vehicles"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "plate_readings" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "plate_readings" ADD CONSTRAINT "UQ_fa9532bcdbfb94158013eaf41d7" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "plate_readings"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "parking_records" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "parking_records" ADD CONSTRAINT "UQ_4622dcc7a26838a36202382d72b" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "parking_records"."uuid" IS 'UUID do registro'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "parking_records"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "parking_records" DROP CONSTRAINT "UQ_4622dcc7a26838a36202382d72b"`,
    );
    await queryRunner.query(`ALTER TABLE "parking_records" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "plate_readings"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "plate_readings" DROP CONSTRAINT "UQ_fa9532bcdbfb94158013eaf41d7"`,
    );
    await queryRunner.query(`ALTER TABLE "plate_readings" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "vehicles"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "UQ_44081a0503cec549614d57eba9a"`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "customers"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "UQ_a41cc8fde9ac3d9bcb91412c596"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_cdc7776894e484eaed828ca0616"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP CONSTRAINT "UQ_6dea067fc4e5e71e9ae95ed89a2"`,
    );
    await queryRunner.query(`ALTER TABLE "role_abilities" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "abilities" DROP CONSTRAINT "UQ_1a080b1f5b714dd0a95dff2566f"`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."uuid" IS 'UUID do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "uuid"`);
  }
}
