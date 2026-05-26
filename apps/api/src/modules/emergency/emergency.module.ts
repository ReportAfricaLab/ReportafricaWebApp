import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity, UserEntity } from '../../database/entities';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { LivestreamModule } from '../livestream/livestream.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity, UserEntity]), NotificationsModule, RealtimeModule, LivestreamModule],
  controllers: [EmergencyController],
  providers: [EmergencyService],
})
export class EmergencyModule {}
