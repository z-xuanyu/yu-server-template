import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateDeptDto {

  @ApiProperty({ title: '名称' })
  @IsString()
  name: string;

  @ApiProperty({ title: '父级id' })
  @IsNumber()
  parentId?: number;

  @ApiProperty({ title: '排序' })
  @IsNumber()
  sort: number;

  @ApiProperty({ title: '状态' })
  @IsNumber()
  status: number;

  @ApiProperty({ title: '备注' })
  @IsString()
  remark: string;
}
