/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-03-21 09:56:19
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-03-21 10:25:22
 * @Description:
 */
/*
https://docs.nestjs.com/providers#services
*/

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('orderQueue') private orderQueue: Queue) {}

  /**
   * 创建取消订单队列
   * @param orderId 订单id
   * @returns
   */
  async createCancelOrdeQueue(orderId: string) {
    // 添加延迟任务
    await this.orderQueue.add(
      'cancelOrder',
      { orderId: orderId },
      { delay: 1 * 10 * 1000 }, // 10s延迟
    );
    return orderId;
  }
}
