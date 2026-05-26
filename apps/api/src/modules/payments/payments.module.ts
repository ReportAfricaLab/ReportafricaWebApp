import { Module } from '@nestjs/common';
import { KoraPayService } from './korapay.service';

@Module({
  providers: [KoraPayService],
  exports: [KoraPayService],
})
export class PaymentsModule {}
