import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger("Payments Ms");
  
  // App Hibrida Rest server + Microservices
  const app = await NestFactory.create(
    AppModule,
    {
      rawBody: true //recibir body como buffer
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.nats_servers
    }
  }, { inheritAppConfig: true }); // compartir config global al ms
  
  await app.startAllMicroservices();
  
  await app.listen( envs.port );

  console.log('Healt Check added');
  
  logger.log(`Payments Ms Running ::: ✅ ${ envs.port }`);

}
bootstrap();
