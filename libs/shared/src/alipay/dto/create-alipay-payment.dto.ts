
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlipayPaymentDto {
  @ApiProperty({ title: '用户id' })
  userId?: string;

  @ApiProperty({ title: '订单类型' })
  type: string;

  @ApiProperty({ title: '充值面值id' })
  faceValueId?: string;

  @ApiProperty({ title: '金额' })
  amount: number;

  @ApiProperty({ title: '主题', description: '例如：会员充值' })
  subject: string;

  @ApiProperty({ title: 'body', description: 'body' })
  body?: string;
}
