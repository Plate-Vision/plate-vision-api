import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIndexForUuidColumn1758996899110 implements MigrationInterface {
    name = 'CreateIndexForUuidColumn1758996899110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_951b8f1dfc94ac1d0301a14b7e" ON "users" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_cdc7776894e484eaed828ca061" ON "roles" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_6dea067fc4e5e71e9ae95ed89a" ON "role_abilities" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_1a080b1f5b714dd0a95dff2566" ON "abilities" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_a41cc8fde9ac3d9bcb91412c59" ON "customers" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_44081a0503cec549614d57eba9" ON "vehicles" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_fa9532bcdbfb94158013eaf41d" ON "plate_readings" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_4622dcc7a26838a36202382d72" ON "parking_records" ("uuid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4622dcc7a26838a36202382d72"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa9532bcdbfb94158013eaf41d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44081a0503cec549614d57eba9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a41cc8fde9ac3d9bcb91412c59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a080b1f5b714dd0a95dff2566"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6dea067fc4e5e71e9ae95ed89a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdc7776894e484eaed828ca061"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_951b8f1dfc94ac1d0301a14b7e"`);
    }

}
