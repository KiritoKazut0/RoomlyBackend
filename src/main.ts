import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as express from 'express';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use('/payment/webhook', express.raw({type: 'application/json'}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
