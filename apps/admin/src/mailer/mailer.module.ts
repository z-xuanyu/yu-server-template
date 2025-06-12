import * as path from 'node:path';

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerService } from './mailer.service';
import { AllConfigKeyAndPath, IMailerConfig } from '@app/common/config';

const providers = [MailerService];
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigKeyAndPath>) => ({
        transport: configService.get<IMailerConfig>('mailer'),
        defaults: {
          from: {
            name: configService.get<IMailerConfig>('mailer').auth.from,
            address: configService.get<IMailerConfig>('mailer').auth.user,
          },
        },
        template: {
          dir: path.join(__dirname, 'mailer/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: providers,
})
export class MailerModule {}
