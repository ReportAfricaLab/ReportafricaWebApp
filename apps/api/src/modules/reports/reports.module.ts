import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '../../database/entities';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ModerationModule } from '../moderation/moderation.module';
import { TrustModule } from '../trust/trust.module';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]),
    ModerationModule,
    TrustModule,
    FollowsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
