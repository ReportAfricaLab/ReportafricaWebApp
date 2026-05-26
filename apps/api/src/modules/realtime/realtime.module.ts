import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageEntity } from '../../database/entities';
import { RealtimeGateway } from './realtime.gateway';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity])],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
