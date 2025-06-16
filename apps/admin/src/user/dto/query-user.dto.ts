/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-13 17:33:18
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-16 11:10:46
 * @Description:
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryUserDto {
  @ApiProperty({
    description: '用户名称',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({ title: '部门id', required: false })
  @IsOptional()
  deptId?: number;

  @ApiProperty({
    title: '页码',
    required: false,
    default: 1,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    title: '每页条数',
    required: false,
    default: 10,
  })
  @IsOptional()
  pageSize: number;
}
