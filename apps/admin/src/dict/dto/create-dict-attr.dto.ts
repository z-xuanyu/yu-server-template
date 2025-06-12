import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateDictAttrDto {
  @ApiProperty({ description: '字典属性名称' })
  @IsNotEmpty({ message: '字典属性名称不能为空' })
  label: string;

  @ApiProperty({ description: '字典属性值' })
  @IsNotEmpty({ message: '字典属性值不能为空' })
  value: string;

  @ApiProperty({ title: '备注' })
  @IsOptional()
  remark: string;

  @ApiProperty({ title: '排序' })
  @IsOptional()
  sort: number;
}