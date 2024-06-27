import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentSessionDto } from './dto';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {

  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-session')
  createPaymentSession( @Body() paymentSessionDto: PaymentSessionDto ) {
    return this.paymentService.createPaymentSession( paymentSessionDto );
  }

  @Post('webhook')
  async stripeWebhook( @Req() req: Request, @Res() res: Response ) {
    return this.paymentService.stripeWebHook( req, res );
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful'
    };
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancel'
    };
  }

}
