import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  @ApiProperty({ title: "名称", default: '阿宇' })
  name: string;

  @IsNotEmpty({ message: "密码不能为空" })
  @ApiProperty({ title: "密码" , default: '123'})
  password: string;

  @IsNotEmpty({ message: "邮箱不能为空" })
  @IsEmail({}, { message: "邮箱格式不正确" })
  @ApiProperty({ title: "邮箱", default: 'admin@qq.com' })
  email: string;

  @ApiProperty({ title: '关联角色' , required: false, default: []})
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  roleIds?: number[];
}
