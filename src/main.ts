import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(/*{
  // TODO: set env variable here
    origin: 'http://localhost:3001', // the frontend (next.js) server
  }*/);
  await app.listen(3000);
}
bootstrap();


