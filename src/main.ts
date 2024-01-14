import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // small security assistance here
      // adding this makes sure any property not present in dto is stripped off when received at controller.
    }),
  );
  await app.listen(3000);
}
bootstrap();
