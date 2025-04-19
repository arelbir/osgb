import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProtocolService } from './ProtocolService';
import { ExternalLab } from './ExternalLab';

@Entity('external_lab_submissions')
export class ExternalLabSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProtocolService)
  @JoinColumn({ name: 'protocol_service_id' })
  protocol_service: ProtocolService;

  @Column()
  protocol_service_id: number;

  @ManyToOne(() => ExternalLab)
  @JoinColumn({ name: 'external_lab_id' })
  external_lab: ExternalLab;

  @Column()
  external_lab_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expected_return_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date;

  @Column({ default: 'submitted' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
