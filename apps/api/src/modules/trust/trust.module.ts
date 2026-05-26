import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, ReportEntity } from '../../database/entities';
import { TrustService } from './trust.service';
import { TrustController } from './trust.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ReportEntity])],
  controllers: [TrustController],
  providers: [TrustService],
  exports: [TrustService],
})
export class TrustModule {}
