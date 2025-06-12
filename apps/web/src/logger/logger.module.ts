// app.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      // Winston 配置
      transports: [
        // 控制台输出（开发环境）
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
          level: 'debug',
        }),

        // 文件日志（生产环境）
        new winston.transports.DailyRotateFile({
          filename: 'logs/web/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          level: 'info',
        }),
      ],
    }),
  ],
})
export class LoggerModule { }