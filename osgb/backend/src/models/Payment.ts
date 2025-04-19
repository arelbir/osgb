import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Protocol } from './Protocol';
import { PaymentType } from './PaymentType';
import { CashRegister } from './CashRegister';
import { User } from './User';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Protocol, protocol => protocol.payments)
  @JoinColumn({ name: 'protocol_id' })
  protocol: Protocol;

  @Column()
  protocol_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @Column({ nullable: true })
  receipt_number: string;

  @ManyToOne(() => CashRegister, { nullable: true })
  @JoinColumn({ name: 'cash_register_id' })
  cash_register: CashRegister | null;

  @Column({ nullable: true })
  cash_register_id: number | null;

  @ManyToOne(() => PaymentType, { nullable: true })
  @JoinColumn({ name: 'payment_type_id' })
  payment_type: PaymentType | null;

  @Column({ nullable: true })
  payment_type_id: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by_user: User;

  @Column({ nullable: true })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
