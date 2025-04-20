import { MigrationInterface, QueryRunner } from "typeorm";

export class EnumMigration1745167444805 implements MigrationInterface {
    name = 'EnumMigration1745167444805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tüm veriler silindiği için ekstra güncelleme gerekmiyor
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'doctor', 'user')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" "public"."users_role_enum" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_types" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payment_types_name_enum" AS ENUM('nakit', 'kredi kartı', 'havale')
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_types"
            ADD "name" "public"."payment_types_name_enum" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "protocols" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."protocols_status_enum" AS ENUM('pending', 'completed', 'cancelled')
        `);
        await queryRunner.query(`
            ALTER TABLE "protocols"
            ADD "status" "public"."protocols_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "patients" DROP COLUMN "gender"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."patients_gender_enum" AS ENUM('Erkek', 'Kadın', 'Diğer')
        `);
        await queryRunner.query(`
            ALTER TABLE "patients"
            ADD "gender" "public"."patients_gender_enum" NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "patients" DROP COLUMN "gender"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."patients_gender_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "patients"
            ADD "gender" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "protocols" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."protocols_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "protocols"
            ADD "status" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_types" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_types_name_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_types"
            ADD "name" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" character varying NOT NULL
        `);
    }

}
