import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class QueryDeptDto {

  @ApiProperty({ title: '名称' })
  @IsString()
  name?: string;

  @ApiProperty({ title: '页码' })
  @IsNumber()
  page?: number;

  @ApiProperty({ title: '每页条数' })
  @IsNumber()
  pageSize?: number;
}