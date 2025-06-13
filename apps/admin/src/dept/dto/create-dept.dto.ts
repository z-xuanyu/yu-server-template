import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateDeptDto {

  @ApiProperty({ title: '名称' })
  @IsOptional()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;

  @ApiProperty({ title: '父级id' })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ title: '排序' })
  @IsOptional()
  sort: number;

  @ApiProperty({ title: '备注' })
  @IsOptional()
  @IsNotEmpty({ message: '备注不能为空' })
  remark: string;
}
