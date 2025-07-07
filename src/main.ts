import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { FastifyInstance, fastify } from 'fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const fastifyInstance: FastifyInstance = fastify();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder().setTitle('nestjs-api-example').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(8081, '0.0.0.0', (err: Error, address: string) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`[${process.pid}] ✨ Application is listening on ${address}`);
  });
  console.log(`[${process.pid}] Invoked bootstrap`);
}
bootstrap();
