import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipEntity, ReportEntity, UserEntity } from '../../database/entities';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { DonationsModule } from '../donations/donations.module';
import { PaymentsModule } from '../payments/payments.module';
import { EarningsModule } from '../earnings/earnings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipEntity, ReportEntity, UserEntity]),
    DonationsModule,
    PaymentsModule,
    EarningsModule,
    NotificationsModule,
  ],
  controllers: [TipsController],
  providers: [TipsService],
  exports: [TipsService],
})
export class TipsModule {}
