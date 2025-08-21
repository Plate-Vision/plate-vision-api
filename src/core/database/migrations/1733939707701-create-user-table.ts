import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1733939707701 implements MigrationInterface {
    name = 'CreateUserTable1733939707701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', "name" character varying(50) NOT NULL, "email" character varying(256) NOT NULL, "password" character varying(200) NOT NULL, "reset_password" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "users"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "users"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "users"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "users"."status" IS 'Status do usuário no portal'; COMMENT ON COLUMN "users"."name" IS 'Nome do usuário'; COMMENT ON COLUMN "users"."email" IS 'Endereço de email do usuário'; COMMENT ON COLUMN "users"."password" IS 'Senha criptografada do usuário'; COMMENT ON COLUMN "users"."reset_password" IS 'Informa se o usuário precisará trocar a senha no próximo acesso'`);
        await queryRunner.query(`COMMENT ON TABLE "users" IS 'Tabela para armazenar os dados de usuário'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "users" IS NULL`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }

}
