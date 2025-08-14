import { Body, Controller, Get, LoggerService, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AlipayService } from './alipay.service';
import { CreateAlipayPaymentDto } from './dto/create-alipay-payment.dto';
import { apiSucceed } from '@app/common/response/result';

@ApiTags('支付宝支付')
@Controller('alipay')
export class AlipayController {
  constructor(
    private readonly alipayService: AlipayService,
    private readonly logger: LoggerService,
  ) {}

  @Post('scan')
  @ApiOperation({ summary: '获取支付二维码' })
  @ApiBearerAuth()
  async createScanOrder(@Body() body: CreateAlipayPaymentDto) {
    const { qrCodeUrl, outTradeNo } =
      await this.alipayService.createPayment(body);
    return apiSucceed({
      content: qrCodeUrl,
      outTradeNo,
    });
  }

  @Post('notify')
  @ApiOperation({ summary: '支付回调' })
  async alipayNotify(@Body() data: any) {
    // 1. 记录原始通知
    this.logger.log(`收到支付宝通知: ${JSON.stringify(data)}`);

    // 2. 验证签名
    if (!(await this.alipayService.verifySignature(data))) {
      this.logger.error('签名验证失败', data);
      return 'failure';
    }
    // 3. 验证订单状态
    if (data.trade_status !== 'TRADE_SUCCESS') {
      this.logger.warn('收到非成功状态通知', data);
      return 'failure';
    }
    // 4. 处理业务逻辑（幂等设计）
    try {
      // 更新订单状态
      // const info = await this.orderService.updateOrderStatus(data.out_trade_no);
      // 5. 触发业务通知
      // this.sseService.sendEventToDevice(String(info?.userId), {
      //   data: JSON.stringify({ code: 0, msg: '支付成功', data: true }),
      // });
      return 'success';
    } catch (err) {
      this.logger.error('订单处理失败', err.stack);
      return 'failure';
    }
  }

  // 新增订单状态查询接口
  @Get('orders/:outTradeNo/status')
  @ApiOperation({ summary: '查询支付订单状态' })
  @ApiParam({ name: 'outTradeNo', description: '订单号' })
  async checkOrderStatus(@Param('outTradeNo') outTradeNo: string) {
    console.log(outTradeNo);
    const res = await this.alipayService.verifyPayment(outTradeNo);
    return apiSucceed(res);
  }
}
