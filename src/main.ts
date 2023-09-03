import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(/*{
  // TODO: set env variable here
    origin: 'http://localhost:3001', // the frontend (next.js) server
  }*/);
  await app.listen(3000);
}
bootstrap();
