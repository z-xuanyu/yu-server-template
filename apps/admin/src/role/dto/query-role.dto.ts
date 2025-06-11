import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class QueryRoleDto {
  @ApiProperty({ title: '角色名称' })
  @IsOptional()
  name: string;

  @ApiProperty({ title: '角色标识' })
  @IsOptional()
  code: string;

  @ApiProperty({ title: '角色状态' })
  @IsOptional()
  status: number;

  @ApiProperty({ title: '页数' })
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty({ title: '每页条数' })
  @IsOptional()
  @IsNumber()
  pageSize: number;
}