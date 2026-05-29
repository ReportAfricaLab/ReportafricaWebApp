import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follows')
@Unique(['followerId', 'followingId'])
@Index(['followerId', 'followingId'])
export class FollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'follower_id' })
  @Index()
  followerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'follower_id' })
  follower: UserEntity;

  @Column({ name: 'following_id' })
  @Index()
  followingId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'following_id' })
  following: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
