import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportUpdateEntity, ReportEntity } from '../../database/entities';
import { ReportUpdatesController } from './report-updates.controller';
import { ReportUpdatesService } from './report-updates.service';
import { RealtimeModule } from '../realtime/realtime.module';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportUpdateEntity, ReportEntity]),
    RealtimeModule,
    FollowsModule,
  ],
  controllers: [ReportUpdatesController],
  providers: [ReportUpdatesService],
  exports: [ReportUpdatesService],
})
export class ReportUpdatesModule {}
