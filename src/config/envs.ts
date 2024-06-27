import 'dotenv/config';
import * as joi from 'joi';

interface IEnvironments {
    PORT: number;
    NATS_SERVERS: string[];
    STRIPE_SECRET: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPE_ENDPOINT_SECRET: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
})
.unknown( true );

const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if( error ) {
    throw new Error(`Config validation falied: ${ error.message }`);
}

const envVars: IEnvironments = value;

export const envs = {
    port: envVars.PORT,
    stripe_secret: envVars.STRIPE_SECRET,
    nats_servers: envVars.NATS_SERVERS,
    stripe_success_url: envVars.STRIPE_SUCCESS_URL,
    stripe_cancel_url: envVars.STRIPE_CANCEL_URL,
    stripe_endpoint_secret: envVars.STRIPE_ENDPOINT_SECRET,
};

