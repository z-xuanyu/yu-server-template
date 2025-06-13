import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class QueryRoleDto {
  @ApiProperty({ title: '角色名称', required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ title: '角色标识', required: false })
  @IsOptional()
  code: string;

  @ApiProperty({ title: '角色状态', required: false })
  @IsOptional()
  status: number;

  @ApiProperty({ title: '页数', required: false })
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty({ title: '每页条数', required: false })
  @IsOptional()
  @IsNumber()
  pageSize: number;
}