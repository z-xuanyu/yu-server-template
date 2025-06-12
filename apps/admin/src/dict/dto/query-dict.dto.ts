import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class QueryDictDto {
  @ApiProperty({ title: '字典名称' })
  @IsOptional()
  name: string;

  @ApiProperty({ title: '字典编码' })
  @IsOptional()
  code: string;

  @ApiProperty({ title: '页码' })
  @IsOptional()
  page: number;

  @ApiProperty({ title: '每页条数' })
  @IsOptional()
  pageSize: number;
}