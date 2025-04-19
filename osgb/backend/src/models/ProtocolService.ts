import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Protocol } from './Protocol';
import { Service } from './Service';
import { LabResult } from './LabResult';

@Entity('protocol_services')
export class ProtocolService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Protocol, protocol => protocol.services)
  @JoinColumn({ name: 'protocol_id' })
  protocol: Protocol;

  @Column()
  protocol_id: number;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column()
  service_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => LabResult, labResult => labResult.protocol_service)
  lab_results: LabResult[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
