import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ValidationPipe } from "@nestjs/common";

dotenv.config();
//Now process.env is available everywhere (Services, Controllers, Modules)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
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

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
