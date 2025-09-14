import { MigrationInterface, QueryRunner } from "typeorm";

export class NovaColunaCustomer1757770961124 implements MigrationInterface {
    name = 'NovaColunaCustomer1757770961124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."customers_type_enum" AS ENUM('JU', 'FI')`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "type" "public"."customers_type_enum" NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "customers"."type" IS 'Tipo do cliente no portal'`);
        await queryRunner.query(`CREATE INDEX "IDX_dd44f67433aadad2785aecd5be" ON "customers" ("type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_dd44f67433aadad2785aecd5be"`);
        await queryRunner.query(`COMMENT ON COLUMN "customers"."type" IS 'Tipo do cliente no portal'`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."customers_type_enum"`);
    }

}
