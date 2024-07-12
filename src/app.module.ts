import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { NatsModule } from './transport/nats.module';
import { HealtCheckModule } from './healt-check/healt-check.module';

@Module({
  imports: [
    NatsModule,
    PaymentModule,
    HealtCheckModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
