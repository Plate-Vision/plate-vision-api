import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleAndAbilityTable1733962676133 implements MigrationInterface {
    name = 'CreateRoleAndAbilityTable1733962676133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."abilities_reference_enum" AS ENUM('USER', 'ROLE')`);
        await queryRunner.query(`CREATE TABLE "abilities" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "reference" "public"."abilities_reference_enum" NOT NULL, CONSTRAINT "PK_8cd72b52f6374bf02333abf365a" PRIMARY KEY ("id")); COMMENT ON COLUMN "abilities"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "abilities"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "abilities"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "abilities"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "abilities"."name" IS 'Habilidades dentro do sistema'; COMMENT ON COLUMN "abilities"."reference" IS 'Referencia da habilidade'`);
        await queryRunner.query(`COMMENT ON TABLE "abilities" IS 'Tabela para armazenar as habilidades'`);
        await queryRunner.query(`CREATE TABLE "role_abilities" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "can_read" boolean NOT NULL DEFAULT true, "can_create" boolean NOT NULL DEFAULT true, "can_update" boolean NOT NULL DEFAULT true, "can_delete" boolean NOT NULL DEFAULT true, "ability_id" integer, "role_id" integer, CONSTRAINT "PK_5f4f7dd9abe898b479e8c98b064" PRIMARY KEY ("id")); COMMENT ON COLUMN "role_abilities"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "role_abilities"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "role_abilities"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "role_abilities"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "role_abilities"."can_read" IS 'Permissão de leitura dentro daquela habilidade'; COMMENT ON COLUMN "role_abilities"."can_create" IS 'Permissão de criação dentro daquela habilidade'; COMMENT ON COLUMN "role_abilities"."can_update" IS 'Permissão de atualização dentro daquela habilidade'; COMMENT ON COLUMN "role_abilities"."can_delete" IS 'Permissão de exclusão dentro daquela habilidade'; COMMENT ON COLUMN "role_abilities"."ability_id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "role_abilities"."role_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`COMMENT ON TABLE "role_abilities" IS 'Tabela para armazenar as permissões por perfil de usuário e habilidade'`);
        await queryRunner.query(`CREATE TYPE "public"."roles_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."roles_reference_enum" AS ENUM('MASTER', 'ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "status" "public"."roles_status_enum" NOT NULL DEFAULT 'ACTIVE', "name" character varying NOT NULL DEFAULT 'Usuário', "reference" "public"."roles_reference_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")); COMMENT ON COLUMN "roles"."id" IS 'Código de identificação do registro'; COMMENT ON COLUMN "roles"."created_at" IS 'Data de criação do registro'; COMMENT ON COLUMN "roles"."updated_at" IS 'Data de atualização do registro'; COMMENT ON COLUMN "roles"."deleted_at" IS 'Data de deleção do registro'; COMMENT ON COLUMN "roles"."status" IS 'Status do perfil de usuário'; COMMENT ON COLUMN "roles"."name" IS 'Perfis de usuário'; COMMENT ON COLUMN "roles"."reference" IS 'Referencia do perfil de usuário'`);
        await queryRunner.query(`COMMENT ON TABLE "roles" IS 'Tabela para armazenar os perfis de usuário'`);
        await queryRunner.query(`ALTER TABLE "role_abilities" ADD CONSTRAINT "FK_285ea6ef85f557217e3c564646e" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_abilities" ADD CONSTRAINT "FK_1e8a9df86d8adbd9e20a6a0101f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_abilities" DROP CONSTRAINT "FK_1e8a9df86d8adbd9e20a6a0101f"`);
        await queryRunner.query(`ALTER TABLE "role_abilities" DROP CONSTRAINT "FK_285ea6ef85f557217e3c564646e"`);
        await queryRunner.query(`COMMENT ON TABLE "roles" IS NULL`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_reference_enum"`);
        await queryRunner.query(`DROP TYPE "public"."roles_status_enum"`);
        await queryRunner.query(`COMMENT ON TABLE "role_abilities" IS NULL`);
        await queryRunner.query(`DROP TABLE "role_abilities"`);
        await queryRunner.query(`COMMENT ON TABLE "abilities" IS NULL`);
        await queryRunner.query(`DROP TABLE "abilities"`);
        await queryRunner.query(`DROP TYPE "public"."abilities_reference_enum"`);
    }

}
