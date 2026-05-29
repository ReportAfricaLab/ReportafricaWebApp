import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity, UserEntity, ReportEntity } from '../../database/entities';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowEntity, UserEntity, ReportEntity]),
    NotificationsModule,
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
