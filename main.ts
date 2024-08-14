import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as process from 'process';

import { AppModule } from './app.module';

dotenv.config();

const port = process.env.PORT || 5001;

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    credentials: true,
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['X-REFRESH-TOKEN', 'X-ACCESS-TOKEN'],
  });

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('SpotLease API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
})()
  .then(() =>
    console.log(`Application is running on: http://localhost:${port}`),
  )
  .catch((err) => console.error(err));
