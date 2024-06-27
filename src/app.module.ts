import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { NatsModule } from './transport/nats.module';

@Module({
  imports: [
    NatsModule,
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
