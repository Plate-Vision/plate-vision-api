import { MigrationInterface, QueryRunner } from "typeorm";

export class MIGRATIONALLENTITIES1757187517085 implements MigrationInterface {
    name = 'MIGRATIONALLENTITIES1757187517085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."customers_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "status" "public"."customers_status_enum" NOT NULL DEFAULT 'ACTIVE', "name" character varying(255) NOT NULL, "document" character varying(14) NOT NULL, "user_created_id" integer, "user_updated_id" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")); COMMENT ON COLUMN "customers"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "customers"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "customers"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "customers"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "customers"."status" IS 'Status do cliente no portal'; COMMENT ON COLUMN "customers"."name" IS 'Nome do cliente'; COMMENT ON COLUMN "customers"."document" IS 'Documento do cliente (CPF ou CNPJ)'; COMMENT ON COLUMN "customers"."user_created_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "customers"."user_updated_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`CREATE INDEX "IDX_589e5e6434f0e8628aa2ad33e1" ON "customers" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_b942d55b92ededa770041db9de" ON "customers" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_68c9c024a07c49ad6a2072d23c" ON "customers" ("document") `);
        await queryRunner.query(`COMMENT ON TABLE "customers" IS 'Tabela para armazenar os dados de clientes'`);
        await queryRunner.query(`CREATE TYPE "public"."vehicles_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."vehicles_source_enum" AS ENUM('MA', 'AI')`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "status" "public"."vehicles_status_enum" NOT NULL DEFAULT 'ACTIVE', "license_plate" character varying(15) NOT NULL, "model_name" character varying(255), "description" text, "source" "public"."vehicles_source_enum" NOT NULL, "is_service_vehicle" boolean NOT NULL DEFAULT false, "user_created_id" integer, "user_updated_id" integer, "customer_id" integer, CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id")); COMMENT ON COLUMN "vehicles"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "vehicles"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "vehicles"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "vehicles"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "vehicles"."status" IS 'Status do veículo no portal'; COMMENT ON COLUMN "vehicles"."license_plate" IS 'Placa do veículo'; COMMENT ON COLUMN "vehicles"."model_name" IS 'Nome do modelo do veículo'; COMMENT ON COLUMN "vehicles"."description" IS 'Descrição do veículo'; COMMENT ON COLUMN "vehicles"."source" IS 'Fonte do veículo no portal'; COMMENT ON COLUMN "vehicles"."is_service_vehicle" IS 'Condição se é ou não veículo de serviço'; COMMENT ON COLUMN "vehicles"."user_created_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "vehicles"."user_updated_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "vehicles"."customer_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`CREATE INDEX "IDX_7e9fab2e8625b63613f67bd706" ON "vehicles" ("license_plate") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc0206a32803bbdc20d6302d94" ON "vehicles" ("model_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3984ff6a748b20ef565ff9f2d" ON "vehicles" ("is_service_vehicle") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1cda98f67cb9c79a1f1153e62" ON "vehicles" ("customer_id") `);
        await queryRunner.query(`COMMENT ON TABLE "vehicles" IS 'Tabela para armazenar os dados de veículos'`);
        await queryRunner.query(`CREATE TABLE "plate_readings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "license_plate" character varying(15) NOT NULL, "processed_at" TIMESTAMP, CONSTRAINT "PK_69087518692244098226fa301b7" PRIMARY KEY ("id")); COMMENT ON COLUMN "plate_readings"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "plate_readings"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "plate_readings"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "plate_readings"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "plate_readings"."license_plate" IS 'Placa do veículo'; COMMENT ON COLUMN "plate_readings"."processed_at" IS 'Data e hora em que a leitura foi processada'`);
        await queryRunner.query(`CREATE INDEX "IDX_73d0b0e8b41f8d702e6966fe26" ON "plate_readings" ("processed_at") `);
        await queryRunner.query(`COMMENT ON TABLE "plate_readings" IS 'Tabela para armazenar os dados de leitura de placas da IA'`);
        await queryRunner.query(`CREATE TYPE "public"."parking_records_entry_source_enum" AS ENUM('MA', 'AI')`);
        await queryRunner.query(`CREATE TYPE "public"."parking_records_exit_source_enum" AS ENUM('MA', 'AI')`);
        await queryRunner.query(`CREATE TABLE "parking_records" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "entry_time" TIMESTAMP NOT NULL, "exit_time" TIMESTAMP, "entry_source" "public"."parking_records_entry_source_enum" NOT NULL, "exit_source" "public"."parking_records_exit_source_enum", "user_created_id" integer, "user_updated_id" integer, "vehicle_id" integer, "entry_reading_id" integer, "exit_reading_id" integer, CONSTRAINT "PK_2a3ea493b1fea0bec5f61a6ccda" PRIMARY KEY ("id")); COMMENT ON COLUMN "parking_records"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "parking_records"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "parking_records"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "parking_records"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "parking_records"."entry_time" IS 'Data e hora em que o veículo entrou'; COMMENT ON COLUMN "parking_records"."exit_time" IS 'Data e hora em que o veículo saiu'; COMMENT ON COLUMN "parking_records"."entry_source" IS 'Fonte do veículo na entrada'; COMMENT ON COLUMN "parking_records"."exit_source" IS 'Fonte do veículo na saída'; COMMENT ON COLUMN "parking_records"."user_created_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "parking_records"."user_updated_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "parking_records"."vehicle_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "parking_records"."entry_reading_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "parking_records"."exit_reading_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`CREATE INDEX "IDX_cfd09dd8f3b7089bed3db12462" ON "parking_records" ("entry_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad40b2733ded816f1769810b2a" ON "parking_records" ("exit_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_c9c909369d0fc247a65192f863" ON "parking_records" ("vehicle_id") `);
        await queryRunner.query(`COMMENT ON TABLE "parking_records" IS 'Tabela para armazenar os dados de entrada e saída de veículos'`);
        await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_bea6f07453047241ba6b02dcb17" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_4171d6dfa9a3d1786aa9f31add6" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_ed1b86371a618605334c8e8ea90" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_272669bb6a9de4599612a4380bb" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_299e5d02e9c1797986967f99233" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_33aa509f25c544d8d4f732a7ac2" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_c9c909369d0fc247a65192f863e" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_a457d8d2913aff2fbf4108c2418" FOREIGN KEY ("entry_reading_id") REFERENCES "plate_readings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_0fa0624257c4694f7e8e20641c5" FOREIGN KEY ("exit_reading_id") REFERENCES "plate_readings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_0fa0624257c4694f7e8e20641c5"`);
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_a457d8d2913aff2fbf4108c2418"`);
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_c9c909369d0fc247a65192f863e"`);
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_33aa509f25c544d8d4f732a7ac2"`);
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_299e5d02e9c1797986967f99233"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_272669bb6a9de4599612a4380bb"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_ed1b86371a618605334c8e8ea90"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_4171d6dfa9a3d1786aa9f31add6"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_bea6f07453047241ba6b02dcb17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`COMMENT ON TABLE "parking_records" IS NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9c909369d0fc247a65192f863"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad40b2733ded816f1769810b2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfd09dd8f3b7089bed3db12462"`);
        await queryRunner.query(`DROP TABLE "parking_records"`);
        await queryRunner.query(`DROP TYPE "public"."parking_records_exit_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."parking_records_entry_source_enum"`);
        await queryRunner.query(`COMMENT ON TABLE "plate_readings" IS NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73d0b0e8b41f8d702e6966fe26"`);
        await queryRunner.query(`DROP TABLE "plate_readings"`);
        await queryRunner.query(`COMMENT ON TABLE "vehicles" IS NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1cda98f67cb9c79a1f1153e62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3984ff6a748b20ef565ff9f2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc0206a32803bbdc20d6302d94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e9fab2e8625b63613f67bd706"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TYPE "public"."vehicles_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vehicles_status_enum"`);
        await queryRunner.query(`COMMENT ON TABLE "customers" IS NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68c9c024a07c49ad6a2072d23c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b942d55b92ededa770041db9de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_589e5e6434f0e8628aa2ad33e1"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "public"."customers_status_enum"`);
    }

}
