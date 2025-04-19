import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745075740759 implements MigrationInterface {
    name = 'InitialMigration1745075740759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying, "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" text, "phone" character varying, "company_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b29e4b2da0f56cd178c8725ea6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tax_number" character varying, "address" text, "phone" character varying, "email" character varying, "contact_person" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "examination_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b711a829abdda1ba19637d8afcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c541600efebc3f4fefd3d082ef3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "service_group_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sample_statuses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf1f770ceba806087b6186668df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sample_rejection_reasons" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1a8fd0af9f777e56a66abad219f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "external_labs" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" text, "phone" character varying, "email" character varying, "contact_person" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee32c04370ebba4ca07d02992e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lab_results" ("id" SERIAL NOT NULL, "protocol_service_id" integer NOT NULL, "barcode_number" character varying, "result" text, "result_text" text, "reference_range" character varying, "unit" character varying, "is_abnormal" boolean NOT NULL DEFAULT false, "sample_status_id" integer, "rejection_reason_id" integer, "request_date" TIMESTAMP, "acceptance_date" TIMESTAMP, "acceptance_by" integer, "barcode_date" TIMESTAMP, "approval_date" TIMESTAMP, "approved_by" integer, "rejection_date" TIMESTAMP, "rejected_by" integer, "external_lab_id" integer, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f1c5b3b5813c98fb531e5db738" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "protocol_services" ("id" SERIAL NOT NULL, "protocol_id" integer NOT NULL, "service_id" integer NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_abea78299e2b67e50eaf795dd8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f84450f9fd8116e201d806c74b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cash_registers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1cc711056395d079d8f041ce34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "protocol_id" integer NOT NULL, "payment_date" TIMESTAMP NOT NULL DEFAULT now(), "receipt_number" character varying, "cash_register_id" integer, "payment_type_id" integer, "amount" numeric(10,2) NOT NULL, "description" text, "created_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "protocols" ("id" SERIAL NOT NULL, "protocol_number" character varying NOT NULL, "patient_id" integer NOT NULL, "examination_type_id" integer NOT NULL, "company_id" integer, "protocol_date" TIMESTAMP NOT NULL DEFAULT now(), "receipt_number" character varying, "ledger_number" character varying, "total_amount" numeric(10,2) NOT NULL, "discount_amount" numeric(10,2) NOT NULL DEFAULT '0', "paid_amount" numeric(10,2) NOT NULL DEFAULT '0', "status" character varying, "created_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d925df9b4199bc337e68a115f5c" UNIQUE ("protocol_number"), CONSTRAINT "PK_69900eec42c88582ac8affff3e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patients" ("id" SERIAL NOT NULL, "tc_identity_number" character varying, "registration_number" character varying, "passport_number" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_date" date, "gender" character varying NOT NULL, "mother_name" character varying, "father_name" character varying, "mobile_phone" character varying, "home_phone" character varying, "email" character varying, "address" text, "notes" text, "photo_url" character varying, "company_id" integer, "company_unit_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f23d3002f532ba72c677865d87b" UNIQUE ("tc_identity_number"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "web_result_users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "patient_id" integer, "company_id" integer, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_35c4bba66017a1a6764377e6c59" UNIQUE ("username"), CONSTRAINT "PK_1a269f519f1494c739adf4fac1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "external_lab_submissions" ("id" SERIAL NOT NULL, "protocol_service_id" integer NOT NULL, "external_lab_id" integer NOT NULL, "submission_date" TIMESTAMP NOT NULL DEFAULT now(), "expected_return_date" TIMESTAMP, "return_date" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'submitted', "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6cdd289f9ab422a7cbc572c99f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_units" ADD CONSTRAINT "FK_139151c10a8b91bc0d86c5b56de" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_620718dc7f924e74c68dc73157f" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_ed634ceff0d5cf15ba46b8a8262" FOREIGN KEY ("protocol_service_id") REFERENCES "protocol_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_11b767aaa047569d52e013935eb" FOREIGN KEY ("sample_status_id") REFERENCES "sample_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_95e2ecf4e4c09038d86677cca25" FOREIGN KEY ("rejection_reason_id") REFERENCES "sample_rejection_reasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_6818e6c2f49b4bbf9478646d7d6" FOREIGN KEY ("acceptance_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_88fc17fc1a94bff09cd21a127a1" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_3de69d98b80deff652ac4bf2f3c" FOREIGN KEY ("rejected_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_results" ADD CONSTRAINT "FK_48c1b3d61fce0f792da94c315c3" FOREIGN KEY ("external_lab_id") REFERENCES "external_labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "protocol_services" ADD CONSTRAINT "FK_5afc3e9c5d15221f10a2ee68a38" FOREIGN KEY ("protocol_id") REFERENCES "protocols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "protocol_services" ADD CONSTRAINT "FK_6818affa1aa5e4effde545213e2" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_a596294286c73dd04d0ace3730d" FOREIGN KEY ("protocol_id") REFERENCES "protocols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_3f26c5a4101272e02bdca7a92fb" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_650ff857451d1502709df53d485" FOREIGN KEY ("payment_type_id") REFERENCES "payment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_2b505576ec68c4d47782a51a832" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "protocols" ADD CONSTRAINT "FK_fd6a36327e4552624e42ce63c9d" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "protocols" ADD CONSTRAINT "FK_d5a54a3bad86d9885617870cb8e" FOREIGN KEY ("examination_type_id") REFERENCES "examination_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "protocols" ADD CONSTRAINT "FK_35ae7d6601fc1b2d1a71e81bdbb" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "protocols" ADD CONSTRAINT "FK_fe92e54052eb2169e337a546127" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_97d50f26dd5764039a2cbf2c30b" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_51303484fc1f632e8e01f7ce1b8" FOREIGN KEY ("company_unit_id") REFERENCES "company_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "web_result_users" ADD CONSTRAINT "FK_f3881eccde66a08b013f4af8b06" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "web_result_users" ADD CONSTRAINT "FK_5390692383e20f9974faa5337fd" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "external_lab_submissions" ADD CONSTRAINT "FK_6b1cbc2b154afb310632bf6b645" FOREIGN KEY ("protocol_service_id") REFERENCES "protocol_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "external_lab_submissions" ADD CONSTRAINT "FK_129c8a33ad9d51f30d6213ec156" FOREIGN KEY ("external_lab_id") REFERENCES "external_labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_lab_submissions" DROP CONSTRAINT "FK_129c8a33ad9d51f30d6213ec156"`);
        await queryRunner.query(`ALTER TABLE "external_lab_submissions" DROP CONSTRAINT "FK_6b1cbc2b154afb310632bf6b645"`);
        await queryRunner.query(`ALTER TABLE "web_result_users" DROP CONSTRAINT "FK_5390692383e20f9974faa5337fd"`);
        await queryRunner.query(`ALTER TABLE "web_result_users" DROP CONSTRAINT "FK_f3881eccde66a08b013f4af8b06"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_51303484fc1f632e8e01f7ce1b8"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_97d50f26dd5764039a2cbf2c30b"`);
        await queryRunner.query(`ALTER TABLE "protocols" DROP CONSTRAINT "FK_fe92e54052eb2169e337a546127"`);
        await queryRunner.query(`ALTER TABLE "protocols" DROP CONSTRAINT "FK_35ae7d6601fc1b2d1a71e81bdbb"`);
        await queryRunner.query(`ALTER TABLE "protocols" DROP CONSTRAINT "FK_d5a54a3bad86d9885617870cb8e"`);
        await queryRunner.query(`ALTER TABLE "protocols" DROP CONSTRAINT "FK_fd6a36327e4552624e42ce63c9d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_2b505576ec68c4d47782a51a832"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_650ff857451d1502709df53d485"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_3f26c5a4101272e02bdca7a92fb"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_a596294286c73dd04d0ace3730d"`);
        await queryRunner.query(`ALTER TABLE "protocol_services" DROP CONSTRAINT "FK_6818affa1aa5e4effde545213e2"`);
        await queryRunner.query(`ALTER TABLE "protocol_services" DROP CONSTRAINT "FK_5afc3e9c5d15221f10a2ee68a38"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_48c1b3d61fce0f792da94c315c3"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_3de69d98b80deff652ac4bf2f3c"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_88fc17fc1a94bff09cd21a127a1"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_6818e6c2f49b4bbf9478646d7d6"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_95e2ecf4e4c09038d86677cca25"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_11b767aaa047569d52e013935eb"`);
        await queryRunner.query(`ALTER TABLE "lab_results" DROP CONSTRAINT "FK_ed634ceff0d5cf15ba46b8a8262"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_620718dc7f924e74c68dc73157f"`);
        await queryRunner.query(`ALTER TABLE "company_units" DROP CONSTRAINT "FK_139151c10a8b91bc0d86c5b56de"`);
        await queryRunner.query(`DROP TABLE "external_lab_submissions"`);
        await queryRunner.query(`DROP TABLE "web_result_users"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "protocols"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "cash_registers"`);
        await queryRunner.query(`DROP TABLE "payment_types"`);
        await queryRunner.query(`DROP TABLE "protocol_services"`);
        await queryRunner.query(`DROP TABLE "lab_results"`);
        await queryRunner.query(`DROP TABLE "external_labs"`);
        await queryRunner.query(`DROP TABLE "sample_rejection_reasons"`);
        await queryRunner.query(`DROP TABLE "sample_statuses"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "service_groups"`);
        await queryRunner.query(`DROP TABLE "examination_types"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "company_units"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
