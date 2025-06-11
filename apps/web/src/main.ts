import { NestFactory } from '@nestjs/core';
import { WebModule } from './web.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WebModule);
  // 允许跨域
  app.enableCors();
  // dto参数校验管道
  app.useGlobalPipes(new ValidationPipe());
  // 全局注册错误的过滤器(错误异常)
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('WEB端接口API')
    .setDescription('WEB端接口API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    }
  });
  await app.listen(3001);
}
bootstrap();
