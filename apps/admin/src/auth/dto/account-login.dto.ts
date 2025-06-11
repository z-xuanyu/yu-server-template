import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class AccountLoginDto {
  @ApiProperty({ title: '邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
  
  @ApiProperty({ title: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
