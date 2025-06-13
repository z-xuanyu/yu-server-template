import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class QueryDeptDto {

  @ApiProperty({ title: '名称', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ title: '页码', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ title: '每页条数', required: false })
  @IsOptional()
  pageSize?: number;
}