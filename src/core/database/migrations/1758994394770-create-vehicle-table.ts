import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVehicleTable1758994394770 implements MigrationInterface {
  name = 'CreateVehicleTable1758994394770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vehicles_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vehicles_source_enum" AS ENUM('MA', 'AI')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "status" "public"."vehicles_status_enum" NOT NULL DEFAULT 'ACTIVE', "license_plate" character varying(15) NOT NULL, "model_name" character varying(255), "description" text, "source" "public"."vehicles_source_enum" NOT NULL, "is_service_vehicle" boolean NOT NULL DEFAULT false, "user_created_id" integer, "user_updated_id" integer, "customer_id" integer, CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id")); COMMENT ON COLUMN "vehicles"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "vehicles"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "vehicles"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "vehicles"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "vehicles"."status" IS 'Status do veículo no portal'; COMMENT ON COLUMN "vehicles"."license_plate" IS 'Placa do Veículo'; COMMENT ON COLUMN "vehicles"."model_name" IS 'Nome do modelo do veículo'; COMMENT ON COLUMN "vehicles"."description" IS 'Descrição do veículo'; COMMENT ON COLUMN "vehicles"."source" IS 'Fonte do veículo no portal'; COMMENT ON COLUMN "vehicles"."is_service_vehicle" IS 'Condição se é ou não veículo de serviço'; COMMENT ON COLUMN "vehicles"."user_created_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "vehicles"."user_updated_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "vehicles"."customer_id" IS 'Código de identificação do registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e9fab2e8625b63613f67bd706" ON "vehicles" ("license_plate") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc0206a32803bbdc20d6302d94" ON "vehicles" ("model_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3984ff6a748b20ef565ff9f2d" ON "vehicles" ("is_service_vehicle") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c1cda98f67cb9c79a1f1153e62" ON "vehicles" ("customer_id") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "vehicles" IS 'Tabela para armazenar os dados de veículos'`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "FK_ed1b86371a618605334c8e8ea90" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "FK_272669bb6a9de4599612a4380bb" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "FK_272669bb6a9de4599612a4380bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "FK_ed1b86371a618605334c8e8ea90"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "vehicles" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1cda98f67cb9c79a1f1153e62"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b3984ff6a748b20ef565ff9f2d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc0206a32803bbdc20d6302d94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e9fab2e8625b63613f67bd706"`,
    );
    await queryRunner.query(`DROP TABLE "vehicles"`);
    await queryRunner.query(`DROP TYPE "public"."vehicles_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."vehicles_status_enum"`);
  }
}
