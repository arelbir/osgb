import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProtocolService } from './ProtocolService';
import { SampleStatus } from './SampleStatus';
import { SampleRejectionReason } from './SampleRejectionReason';
import { User } from './User';
import { ExternalLab } from './ExternalLab';

@Entity('lab_results')
export class LabResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProtocolService, protocolService => protocolService.lab_results)
  @JoinColumn({ name: 'protocol_service_id' })
  protocol_service: ProtocolService;

  @Column()
  protocol_service_id: number;

  @Column({ nullable: true })
  barcode_number: string;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({ type: 'text', nullable: true })
  result_text: string;

  @Column({ nullable: true })
  reference_range: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ default: false })
  is_abnormal: boolean;

  @ManyToOne(() => SampleStatus, { nullable: true })
  @JoinColumn({ name: 'sample_status_id' })
  sample_status: SampleStatus | null;

  @Column({ nullable: true })
  sample_status_id: number | null;

  @ManyToOne(() => SampleRejectionReason, { nullable: true })
  @JoinColumn({ name: 'rejection_reason_id' })
  rejection_reason: SampleRejectionReason | null;

  @Column({ nullable: true })
  rejection_reason_id: number | null;

  @Column({ type: 'timestamp', nullable: true })
  request_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptance_date: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'acceptance_by' })
  acceptance_by_user: User;

  @Column({ nullable: true })
  acceptance_by: number;

  @Column({ type: 'timestamp', nullable: true })
  barcode_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  approval_date: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by_user: User;

  @Column({ nullable: true })
  approved_by: number;

  @Column({ type: 'timestamp', nullable: true })
  rejection_date: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'rejected_by' })
  rejected_by_user: User;

  @Column({ nullable: true })
  rejected_by: number;

  @ManyToOne(() => ExternalLab, { nullable: true })
  @JoinColumn({ name: 'external_lab_id' })
  external_lab: ExternalLab | null;

  @Column({ nullable: true })
  external_lab_id: number | null;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
