/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-12 09:32:48
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-17 16:00:35
 * @Description:
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
