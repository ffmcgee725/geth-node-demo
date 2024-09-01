import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MAX_REQUESTS_PER_USER, MAX_REQUESTS_TIME_LIMIT_IN_MILLISECONDS } from './constants';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const limiter = rateLimit({
    windowMs: MAX_REQUESTS_TIME_LIMIT_IN_MILLISECONDS,
    max: MAX_REQUESTS_PER_USER,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const app = await NestFactory.create(AppModule);
  app.use(limiter);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Kraken Assignment - Blockchain API')
    .setVersion('1.0')
    .addTag('blockchain-api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
