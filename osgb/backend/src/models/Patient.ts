import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from './Company';
import { CompanyUnit } from './CompanyUnit';
import { Protocol } from './Protocol';
import { Gender } from '../enums/Gender';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  tc_identity_number: string;

  @Column({ nullable: true })
  registration_number: string;

  @Column({ nullable: true })
  passport_number: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date | null;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  mobile_phone: string;

  @Column({ nullable: true })
  home_phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  photo_url: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company | null;

  @Column({ nullable: true })
  company_id: number | null;

  @ManyToOne(() => CompanyUnit, { nullable: true })
  @JoinColumn({ name: 'company_unit_id' })
  company_unit: CompanyUnit | null;

  @Column({ nullable: true })
  company_unit_id: number | null;

  @OneToMany(() => Protocol, protocol => protocol.patient)
  protocols: Protocol[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
