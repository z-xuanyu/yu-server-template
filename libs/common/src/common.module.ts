import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DbModule } from '@app/db';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import config from './config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production', '.env'],
      isGlobal: true,
      load: [...Object.values(config)],
    }),
    DbModule,
    RedisModule,
  ],
  providers: [CommonService],
  exports: [CommonService, RedisModule],
})
export class CommonModule { }
