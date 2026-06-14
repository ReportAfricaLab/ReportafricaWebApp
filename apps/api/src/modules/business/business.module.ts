import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from '../../database/entities';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { DonationsModule } from '../donations/donations.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity]), DonationsModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
