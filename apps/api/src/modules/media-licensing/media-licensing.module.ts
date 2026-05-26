import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaLicenseEntity, ReportEntity, UserEntity } from '../../database/entities';
import { MediaLicensingService } from './media-licensing.service';
import { MediaLicensingController } from './media-licensing.controller';
import { PaymentsModule } from '../payments/payments.module';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaLicenseEntity, ReportEntity, UserEntity]),
    PaymentsModule,
    EarningsModule,
  ],
  controllers: [MediaLicensingController],
  providers: [MediaLicensingService],
})
export class MediaLicensingModule {}
