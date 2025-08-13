
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { OrderProcessor } from './processor/order.processor';
import { QueueService } from './queue.service';
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('REDIS_URL');
        const port = configService.get('REDIS_PORT');
        return {
          connection: {
            host: url,
            port: port,
          },
          defaultJobOptions: {
            attempts: 3, // 尝试次数
            removeOnComplete: true, // 任务完成后删除
            removeOnFail: false, // 任务失败后不删除
          }
        };
      },
    }),
    BullModule.registerQueue({
      name: 'orderQueue',
    }),
  ],
  controllers: [],
  providers: [QueueService, OrderProcessor],
  exports: [QueueService, OrderProcessor],
})
export class QueueModule { }
