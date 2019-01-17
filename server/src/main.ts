import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {AppLogger, LogFactory} from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    logger: LogFactory('Server'),
  });

  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('CheckIn')
    .setDescription('Attendance and Location Tracking')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/swagger', app, document);
  await app.listen(+process.env.PORT || 3000);
}

bootstrap();
