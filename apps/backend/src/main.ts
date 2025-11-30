import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(); // Allow frontend to call us

  const config = new DocumentBuilder()
    .setTitle('VidScoreAI Backend API')
    .setDescription('API documentation for VidScoreAI video analysis and scoring service')
    .setVersion('1.0')
    .addTag('videos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`VidScoreAI Backend running on port ${port}`);
}
bootstrap();
