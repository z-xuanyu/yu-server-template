/*
 * @Author: xuanyu
 * @LastEditors: 阿宇 969718197@qq.com
 * @email: 969718197@qq.com
 * @github: https://github.com/z-xuanyu
 * @Date: 2021-12-27 10:30:12
 * @LastEditTime: 2024-05-15 15:06:11
 * @Description: 接口返回
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';

// 成功返回
export class ApiSucceedResult<T> {
  code: number;
  data?: T;
  message: string;
}

// 分页返回
export class PaginationResult<T> {
  total: number;
  items: T;
}

// 成功 - 基础版本
export function apiSucceed<T>(data?: T): ApiSucceedResult<T> {
  return {
    code: 0,
    data,
    message: '成功',
  };
}

// 成功 - 带序列化类型版本
export function apiSucceedWithTransform<T, R>(
  data: T,
  dto: ClassConstructor<R>,
  options?: {
    excludeExtraneousValues?: boolean;
    enableImplicitConversion?: boolean;
  }
): ApiSucceedResult<R> {
  const transformedData = plainToInstance(dto, data, {
    excludeExtraneousValues: options?.excludeExtraneousValues ?? false,
    enableImplicitConversion: options?.enableImplicitConversion ?? true,
  });
  
  return {
    code: 0,
    data: transformedData,
    message: '成功',
  };
}

// 分页成功 - 带序列化类型版本
export function apiSucceedWithPagination<T, R>(
  data: PaginationResult<T>,
  dto: ClassConstructor<R>,
  options?: {
    excludeExtraneousValues?: boolean;
    enableImplicitConversion?: boolean;
  }
): ApiSucceedResult<PaginationResult<R>> {
  const transformedItems = plainToInstance(dto, data.items, {
    excludeExtraneousValues: options?.excludeExtraneousValues ?? false,
    enableImplicitConversion: options?.enableImplicitConversion ?? true,
  });
  
  return {
    code: 0,
    data: {
      total: data.total,
      items: transformedItems,
    },
    message: '成功',
  };
}

// 失败
export class ApiFail extends HttpException {
  constructor(code = 101, message = '失败') {
    super(
      {
        code,
        message,
      },
      HttpStatus.OK,
    );
  }
}
