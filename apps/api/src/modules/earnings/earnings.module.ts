import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarningsEntity } from '../../database/entities';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EarningsEntity])],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}
