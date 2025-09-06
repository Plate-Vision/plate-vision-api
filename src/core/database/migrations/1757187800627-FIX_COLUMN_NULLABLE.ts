import { MigrationInterface, QueryRunner } from "typeorm";

export class FIXCOLUMNNULLABLE1757187800627 implements MigrationInterface {
    name = 'FIXCOLUMNNULLABLE1757187800627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_bea6f07453047241ba6b02dcb17"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "user_created_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_c9c909369d0fc247a65192f863e"`);
        await queryRunner.query(`ALTER TABLE "parking_records" ALTER COLUMN "vehicle_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_bea6f07453047241ba6b02dcb17" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_c9c909369d0fc247a65192f863e" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_records" DROP CONSTRAINT "FK_c9c909369d0fc247a65192f863e"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_bea6f07453047241ba6b02dcb17"`);
        await queryRunner.query(`ALTER TABLE "parking_records" ALTER COLUMN "vehicle_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parking_records" ADD CONSTRAINT "FK_c9c909369d0fc247a65192f863e" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "user_created_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_bea6f07453047241ba6b02dcb17" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
