import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import * as basicAuth from 'express-basic-auth';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule, {
    bufferLogs: true,
  });
  // 日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 允许跨域
  app.enableCors();
  // dto参数校验管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  // 全局注册错误的过滤器(错误异常)
  app.useGlobalFilters(new HttpExceptionFilter());
  // 版本控制
  // app.enableVersioning({
  //   defaultVersion: '1',
  //   type: VersioningType.URI,
  // });
  // 设置swagger密码方法
  app.use(['/api-docs', '/api-docs-json'], basicAuth({
    challenge: true,
    users: {
      xuanyu: 'qq812006298'
    }
  }))
  // swagger配置
  const config = new DocumentBuilder()
    .setTitle('Admin端接口Api')
    .setDescription('969718197@qq.com')
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
  // 监听端口
  await app.listen(3000);
}
bootstrap();
