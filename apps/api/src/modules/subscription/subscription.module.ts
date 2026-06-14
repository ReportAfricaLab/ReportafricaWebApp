import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DonationsModule } from '../donations/donations.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), DonationsModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
