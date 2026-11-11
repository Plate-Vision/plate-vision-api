import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerTable1758994237853 implements MigrationInterface {
  name = 'CreateCustomerTable1758994237853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."customers_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customers_type_enum" AS ENUM('JU', 'FI')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "status" "public"."customers_status_enum" NOT NULL DEFAULT 'ACTIVE', "name" character varying(255) NOT NULL, "document" character varying(14) NOT NULL, "type" "public"."customers_type_enum" NOT NULL, "user_created_id" integer NOT NULL, "user_updated_id" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")); COMMENT ON COLUMN "customers"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "customers"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "customers"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "customers"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "customers"."status" IS 'Status do cliente no portal'; COMMENT ON COLUMN "customers"."name" IS 'Nome do cliente'; COMMENT ON COLUMN "customers"."document" IS 'Documento do cliente (CPF ou CNPJ)'; COMMENT ON COLUMN "customers"."type" IS 'Tipo do cliente no portal'; COMMENT ON COLUMN "customers"."user_created_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "customers"."user_updated_id" IS 'Código de identificação do registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_589e5e6434f0e8628aa2ad33e1" ON "customers" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b942d55b92ededa770041db9de" ON "customers" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68c9c024a07c49ad6a2072d23c" ON "customers" ("document") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd44f67433aadad2785aecd5be" ON "customers" ("type") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "customers" IS 'Tabela para armazenar os dados de clientes'`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_bea6f07453047241ba6b02dcb17" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_4171d6dfa9a3d1786aa9f31add6" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_4171d6dfa9a3d1786aa9f31add6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_bea6f07453047241ba6b02dcb17"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "roles"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "role_abilities"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_abilities" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."deleted_at" IS 'Data de deleção do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."updated_at" IS 'Data de atualização do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "abilities"."created_at" IS 'Data de criação do registro'`,
    );
    await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "abilities" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(`COMMENT ON TABLE "customers" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dd44f67433aadad2785aecd5be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68c9c024a07c49ad6a2072d23c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b942d55b92ededa770041db9de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_589e5e6434f0e8628aa2ad33e1"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TYPE "public"."customers_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."customers_status_enum"`);
  }
}
