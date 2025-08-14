// order.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('orderQueue')
export class OrderProcessor extends WorkerHost {
  async process(job: Job<any>) {
    console.log('收到任务:', job.name, job.data);

    if (job.name === 'cancelOrder') {
      // 这里执行关闭订单逻辑
      console.log(`关闭订单 ID: ${job.data.orderId}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`任务完成: ${job.id}`);
  }
}
