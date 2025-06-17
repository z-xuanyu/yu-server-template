/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-09 11:09:33
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-17 11:11:21
 * @Description:
 */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '名称不能为空' })
  @ApiProperty({ title: '角色名称' })
  name: string;

  @IsNotEmpty({ message: '编码不能为空' })
  @ApiProperty({ title: '角色编码' })
  code: string;

  @IsNotEmpty({ message: '备注不能为空' })
  @ApiProperty({ title: '备注' })
  remark: string;

  @ApiProperty({ title: '排序' })
  @IsNumber()
  sort?: number;

  @ApiProperty({
    title: '菜单',
    required: false,
    default: [],
    description: '菜单ID',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  menus?: number[];
}
