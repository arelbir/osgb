import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Patient } from './Patient';
import { ExaminationType } from './ExaminationType';
import { Company } from './Company';
import { User } from './User';
import { ProtocolService } from './ProtocolService';
import { Payment } from './Payment';

@Entity('protocols')
export class Protocol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  protocol_number: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column()
  patient_id: number;

  @ManyToOne(() => ExaminationType)
  @JoinColumn({ name: 'examination_type_id' })
  examination_type: ExaminationType;

  @Column()
  examination_type_id: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company | null;

  @Column({ nullable: true })
  company_id: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  protocol_date: Date;

  @Column({ nullable: true })
  receipt_number: string;

  @Column({ nullable: true })
  ledger_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paid_amount: number;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by_user: User;

  @Column({ nullable: true })
  created_by: number;

  @OneToMany(() => ProtocolService, protocolService => protocolService.protocol)
  services: ProtocolService[];

  @OneToMany(() => Payment, payment => payment.protocol)
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
