import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('earnings')
export class EarningsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reporter_id' })
  @Index()
  reporterId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reporter_id' })
  reporter: UserEntity;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  source: string; // media_license, tip, reward

  @Column({ name: 'source_id', nullable: true })
  sourceId: string; // license ID or report ID

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'payment_reference', nullable: true })
  paymentReference: string;

  @Column({ default: 'completed' })
  status: string; // completed, pending, failed

  @Column({ name: 'payer_name', nullable: true })
  payerName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
