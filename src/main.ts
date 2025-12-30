import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ValidationPipe } from "@nestjs/common";
import { METHODS } from "http";

dotenv.config();
//Now process.env is available everywhere (Services, Controllers, Modules)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Validation Globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that are not in the DTO
      transform: true, // Automatically transforms payloads to DTO instances
      forbidNonWhitelisted: true, // Throws error if extra properties are sent
      transformOptions: {
        enableImplicitConversion: true, // Helps with converting strings to numbers in Query params
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Talabaty Backend Documentation")
    .setDescription("Endpoints' description")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  fs.writeFileSync('swagger-spec.json', JSON.stringify(document));

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://hrdashboardai.netlify.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true,
  });


  await app.listen(process.env.PORT || 3000);
}

bootstrap();
