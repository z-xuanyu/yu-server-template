import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DbModule } from '@app/db';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import config from './config';
import { QueueModule } from './queue/queue.module';

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
    QueueModule
  ],
  providers: [CommonService],
  exports: [CommonService, RedisModule],
})
export class CommonModule { }
