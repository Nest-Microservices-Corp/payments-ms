import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger("Payments Ms");

  const app = await NestFactory.create(
    AppModule,
    {
      rawBody: true //recibir body como buffer
    }
    // {
    //   transport: Transport.NATS,
    //   options: {
    //     servers: envs.nats_servers
    //   }
    // }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  await app.listen( envs.port );
  
  logger.log(`Payments Ms Running ::: ✅ ${ envs.port }`);

}
bootstrap();
