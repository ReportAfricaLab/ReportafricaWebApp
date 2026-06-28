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

@Entity('observers')
export class ObserverEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'org_name', nullable: true })
  orgName: string;

  @Column({ length: 2 })
  @Index()
  country: string;

  @Column({ default: 'individual' })
  tier: string; // individual, organization, enterprise

  @Column({ name: 'accreditation_url', nullable: true })
  accreditationUrl: string;

  @Column({ default: 'observer_pending' })
  @Index()
  status: string; // observer_pending, observer_approved, observer_active, observer_expired, observer_rejected

  @Column({ type: 'int', default: 1 })
  seats: number;

  @Column({ name: 'paid_at', nullable: true })
  paidAt: Date;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ name: 'paystack_reference', nullable: true })
  paystackReference: string;

  @Column({ name: 'invited_by', nullable: true })
  invitedBy: string; // userId of org owner who invited this seat

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
