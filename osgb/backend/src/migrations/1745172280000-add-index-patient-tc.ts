import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexPatientTc1745172280000 implements MigrationInterface {
    name = 'AddIndexPatientTc1745172280000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_patients_tc_identity_number ON patients(tc_identity_number)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_patients_tc_identity_number`);
    }
}
