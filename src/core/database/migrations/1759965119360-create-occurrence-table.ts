import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOccurrenceTable1759965119360 implements MigrationInterface {
    name = 'CreateOccurrenceTable1759965119360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."occurrences_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "occurrences" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."occurrences_status_enum" NOT NULL DEFAULT 'ACTIVE', "description" text NOT NULL, "occurrence_time" TIMESTAMP WITH TIME ZONE NOT NULL, "url_image" text, "latitude" numeric(10,8), "longitude" numeric(11,8), "user_created_id" integer, "user_updated_id" integer, "vehicle_id" integer, CONSTRAINT "UQ_36c33ba6025e2a92c7d3fe0b51a" UNIQUE ("uuid"), CONSTRAINT "PK_04fa3cf0bb8ea79b707dbfabe0a" PRIMARY KEY ("id")); COMMENT ON COLUMN "occurrences"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "occurrences"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "occurrences"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "occurrences"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "occurrences"."uuid" IS 'UUID do registro'; COMMENT ON COLUMN "occurrences"."status" IS 'Status da ocorrência no portal'; COMMENT ON COLUMN "occurrences"."description" IS 'Descrição da ocorrência'; COMMENT ON COLUMN "occurrences"."occurrence_time" IS 'Data e hora da ocorrência'; COMMENT ON COLUMN "occurrences"."url_image" IS 'URL da imagem'; COMMENT ON COLUMN "occurrences"."latitude" IS 'Latitude da localização'; COMMENT ON COLUMN "occurrences"."longitude" IS 'Longitude da localização'; COMMENT ON COLUMN "occurrences"."user_created_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "occurrences"."user_updated_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "occurrences"."vehicle_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`CREATE INDEX "IDX_36c33ba6025e2a92c7d3fe0b51" ON "occurrences" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_6fd06bf8684c15dfb4c2d4e7c9" ON "occurrences" ("vehicle_id") `);
        await queryRunner.query(`COMMENT ON TABLE "occurrences" IS 'Tabela para armazenar os dados de ocorrências'`);
        await queryRunner.query(`ALTER TABLE "occurrences" ADD CONSTRAINT "FK_d26daba890e0b2457d853c1f7e2" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occurrences" ADD CONSTRAINT "FK_d670095fda1b6021b0ebc9d1a6d" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occurrences" ADD CONSTRAINT "FK_6fd06bf8684c15dfb4c2d4e7c9a" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrences" DROP CONSTRAINT "FK_6fd06bf8684c15dfb4c2d4e7c9a"`);
        await queryRunner.query(`ALTER TABLE "occurrences" DROP CONSTRAINT "FK_d670095fda1b6021b0ebc9d1a6d"`);
        await queryRunner.query(`ALTER TABLE "occurrences" DROP CONSTRAINT "FK_d26daba890e0b2457d853c1f7e2"`);
        await queryRunner.query(`COMMENT ON TABLE "occurrences" IS NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6fd06bf8684c15dfb4c2d4e7c9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36c33ba6025e2a92c7d3fe0b51"`);
        await queryRunner.query(`DROP TABLE "occurrences"`);
        await queryRunner.query(`DROP TYPE "public"."occurrences_status_enum"`);
    }

}
