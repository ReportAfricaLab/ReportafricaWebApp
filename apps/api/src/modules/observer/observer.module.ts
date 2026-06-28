import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObserverEntity } from '../../database/entities/observer.entity';
import { ObserverController } from './observer.controller';
import { ObserverService } from './observer.service';
import { ObserverGuard } from './observer.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ObserverEntity])],
  controllers: [ObserverController],
  providers: [ObserverService, ObserverGuard],
  exports: [ObserverService, ObserverGuard],
})
export class ObserverModule {}
