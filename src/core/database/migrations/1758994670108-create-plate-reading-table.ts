import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlateReadingTable1758994670108 implements MigrationInterface {
    name = 'CreatePlateReadingTable1758994670108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plate_readings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "license_plate" character varying(15) NOT NULL, "processed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_69087518692244098226fa301b7" PRIMARY KEY ("id")); COMMENT ON COLUMN "plate_readings"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "plate_readings"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "plate_readings"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "plate_readings"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "plate_readings"."license_plate" IS 'Placa do veículo'; COMMENT ON COLUMN "plate_readings"."processed_at" IS 'Data e hora em que a leitura foi processada'`);
        await queryRunner.query(`CREATE INDEX "IDX_73d0b0e8b41f8d702e6966fe26" ON "plate_readings" ("processed_at") `);
        await queryRunner.query(`COMMENT ON TABLE "plate_readings" IS 'Tabela para armazenar os dados de leitura de placas da IA'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "plate_readings" IS NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73d0b0e8b41f8d702e6966fe26"`);
        await queryRunner.query(`DROP TABLE "plate_readings"`);
    }

}
