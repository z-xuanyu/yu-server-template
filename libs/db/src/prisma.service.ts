/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-05 11:50:23
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-17 09:26:48
 * @Description:
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
