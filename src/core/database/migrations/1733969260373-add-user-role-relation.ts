import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoleRelation1733969260373 implements MigrationInterface {
    name = 'AddUserRoleRelation1733969260373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."role_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."role_id" IS 'Código de identificação do registro'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    }

}
