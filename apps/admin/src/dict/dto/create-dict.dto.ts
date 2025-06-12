import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateDictDto {

  @ApiProperty({ title: '字典名称' })
  @IsOptional()
  name: string;

  @ApiProperty({ title: '字典code' })
  @IsOptional()
  code: string;

  @ApiProperty({ title: '字典描述' })
  @IsOptional()
  remark: string;

  @ApiProperty({ title: '排序' })
  @IsOptional()
  sort: number;
}
