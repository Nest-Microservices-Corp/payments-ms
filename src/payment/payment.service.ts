import { Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from '../config/envs';
import { PaymentSessionDto } from './dto';
import { Request, Response } from 'express';
import { NATS_SERVICE } from '../config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {

    private readonly _logger = new Logger("PaymentService");
    
    private readonly _stipe = new Stripe( envs.stripe_secret );

    constructor(
        @Inject( NATS_SERVICE )
        private readonly _client: ClientProxy
    ){ }

    async createPaymentSession( paymentSessionDto: PaymentSessionDto ) {

        const { orderId, currency, items } = paymentSessionDto;

        // return paymentSessionDto;

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        lineItems.push(
            ...items.map( (i) => (
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: i.name,
                        },
                        unit_amount: Math.round( i.price * 100 )
                    },
                    quantity: i.quantity
                }
            ) )
        )
        
        const session = await this._stipe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId
                }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: envs.stripe_success_url,
            cancel_url: envs.stripe_cancel_url,
        });
       
        return session;

    }

    async stripeWebHook( req: Request, res: Response ) {
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        // const endpointSecret = "whsec_48e2faae05446aedfe141cf584cc12746b51c4a58cd86613f66990248bfd0b2e";
        const endpointSecret = envs.stripe_endpoint_secret;

        try {
            event = this._stipe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
        } catch (error) {
            res.status(400).send(`Webhook Error: ${error.message}`);
            return;
        }

        switch (event.type) {
            case 'charge.succeeded':
                
            const chargeSucceded = event.data.object;
                // console.log({
                //     metadata: chargeSucceded.metadata
                // });

                const payload = {
                    stripePaymentId: chargeSucceded.id,
                    orderId: chargeSucceded.metadata.orderId,
                    receiptUrl: chargeSucceded.receipt_url
                };
                
                this._logger.log({payload});
                
                this._client.emit( 'payment.succeeded', payload );

                break;
        
            default:
                console.log( `Event ${event.type} ::: not handled ` );
                break;
        }


        return res.status(200).json({
            sig
        });
    }

}
