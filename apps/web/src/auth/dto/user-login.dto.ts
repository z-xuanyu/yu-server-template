import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class UserLoginDto {
  @ApiProperty({ title: '手机号码' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsPhoneNumber('CN', { message: '手机号格式不正确' })
  phone: string;

  @ApiProperty({ title: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}