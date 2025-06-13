import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class QueryUserDto {
  @ApiProperty({
    description: '用户名称',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    title: '页码',
    required: false,
    default: 1,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '每页条数',
    required: false,
    default: 10,
  })
  @IsOptional()
  pageSize: number;
}