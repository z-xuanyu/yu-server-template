/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-03-07 11:23:46
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-04-01 11:12:51
 * @Description:
 */
/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { AlipaySdk } from 'alipay-sdk';
import { CreateAlipayPaymentDto } from './dto/create-alipay-payment.dto';
import { QueueService } from '../queue/queue.service';
import { CacheService } from '@app/common/redis/cache.service';
@Injectable()
export class AlipayService {
  constructor(
    @Inject('ALIPAY_SDK') private readonly alipaySdk: AlipaySdk,
    private readonly cacheService: CacheService,
    private readonly queueService: QueueService,
  ) {}

  /**
   * 生成一个唯一的订单号
   * @returns 生成一个唯一的订单号
   */
  private generateOutTradeNo() {
    return Date.now().toString() + Math.floor(Math.random() * 10000);
  }

  /**
   * 验证支付宝通知的签名
   * @param data 支付宝通知数据
   * @returns
   */
  async verifySignature(data: any): Promise<boolean> {
    try {
      return this.alipaySdk.checkNotifySign(data);
    } catch (error) {
      console.error('签名验证失败:', error);
      return false;
    }
  }

  /**
   * 根据支付宝返回的 HTML 代码片段构建支付页面 URL
   * @param html 支付宝返回的 HTML 代码片段
   * @returns 支付宝支付页面 URL
   */
  buildUrlFromForm(html: string): string {
    const formTagMatch = html.match(/<form\s+[^>]*>/i);
    const formTag = formTagMatch[0];
    const actionMatch = formTag.match(/action\s*=\s*["']([^"']+)["']/i);
    const actionUrl = actionMatch[1];
    return actionUrl.toString();
  }
  /**
   * 创建支付宝扫码支付
   * @param order 订单信息
   * @returns 二维码图片地址和订单号
   */
  async createPayment(order: CreateAlipayPaymentDto) {
    const outTradeNo = this.generateOutTradeNo();
    // 查看 Redis 中是否已经存在该订单号
    // const existingOrder = await this.redis.get(
    //   `${order.userId}:${order.faceValueId}:alipay`,
    // );
    // if (existingOrder) {
    //   return {
    //     qrCodeUrl: await this.redis.get(
    //       `${order.userId}:${order.faceValueId}:alipay:qrcode`,
    //     ),
    //     outTradeNo: existingOrder,
    //   };
    // }
    try {
      // 支付页面接口，返回 HTML 代码片段，内容为 Form 表单
      const html = this.alipaySdk.pageExec('alipay.trade.page.pay', 'GET', {
        biz_content: {
          out_trade_no: outTradeNo,
          product_code: 'FAST_INSTANT_TRADE_PAY',
          subject: order.subject,
          body: order.body,
          total_amount: order.amount,
          qr_pay_mode: '4', // 二维码模式
          qrcode_width: 140, // 二维码宽度（可选）
        },
        return_url: 'https://www.shejiwan.cn/paySuccess',
        // 回调
        notify_url: 'https://api.shejiwan.cn/alipay/notify',
      });
      // 将订单号存入 Redis，用于后续验证支付结果
      // await this.redis.set(
      //   `${order.userId}:${order.faceValueId}:alipay`,
      //   outTradeNo,
      //   60 * 5,
      // ); // 5分钟有效期
      // 存储支付二维码地址 --5分钟
      // await this.redis.set(
      //   `${order.userId}:${order.faceValueId}:alipay:qrcode`,
      //   html,
      //   60 * 5,
      // );
      // // 6分钟后检查订单是否支付成功，如果未支付则取消订单
      // this.queueService.createCancelOrdeQueue(String(orderInfo._id));
      return {
        qrCodeUrl: html,
        outTradeNo,
      };
    } catch (error) {
      throw new Error(`支付宝扫码支付请求失败: ${error.message}`);
    }
  }

  /**
   * 验证支付是否成功
   * @returns 支付是否成功
   * */
  async verifyPayment(outTradeNo: string) {
    const result = await this.alipaySdk.exec('alipay.trade.query', {
      bizContent: { out_trade_no: outTradeNo },
    });
    const isPay = result.tradeStatus === 'TRADE_SUCCESS';
    return {
      orderNo: outTradeNo,
      status: isPay,
    };
  }
}
