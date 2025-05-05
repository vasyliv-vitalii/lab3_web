import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(
      'D:\\lab3_web\\lab3_web\\casdoor\\keys\\localhost-key.pem',
    ),
    cert: fs.readFileSync(
      'D:\\lab3_web\\lab3_web\\casdoor\\keys\\localhost.pem',
    ),
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.2',
    ciphers: [
      'TLS_RSA_WITH_AES_256_CBC_SHA256',
      'TLS_RSA_WITH_AES_256_CBC_SHA',
    ].join(':'),
    honorCipherOrder: true,
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors({
    origin: 'https://localhost:3001',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
