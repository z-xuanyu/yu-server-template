# 响应结果工具使用指南

## 基础用法

### 1. 基础成功响应
```typescript
import { apiSucceed } from '@app/common/response/result';

// 简单数据返回
return apiSucceed({ id: 1, name: 'test' });

// 无数据返回
return apiSucceed();
```

### 2. 带序列化的成功响应
```typescript
import { apiSucceedWithTransform } from '@app/common/response/result';
import { PublicRoleDto } from './dto/public-role.dto';

// 自动将数据转换为指定的 DTO 类型
const rawData = { id: 1, name: 'admin', permissions: [{ permissionId: 1 }] };
return apiSucceedWithTransform(rawData, PublicRoleDto);

// 带选项的序列化
return apiSucceedWithTransform(rawData, PublicRoleDto, {
  excludeExtraneousValues: true,  // 排除未在 DTO 中定义的属性
  enableImplicitConversion: true  // 启用隐式类型转换
});
```

### 3. 分页数据带序列化
```typescript
import { apiSucceedWithPagination } from '@app/common/response/result';
import { PublicRoleDto } from './dto/public-role.dto';

// 分页数据自动序列化
const paginationData = {
  total: 100,
  items: [
    { id: 1, name: 'admin', permissions: [{ permissionId: 1 }] },
    { id: 2, name: 'user', permissions: [{ permissionId: 2 }] }
  ]
};
return apiSucceedWithPagination(paginationData, PublicRoleDto);
```

## DTO 定义示例

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Expose } from 'class-transformer';

export class PublicRoleDto {
  @ApiProperty({ title: '角色ID' })
  @Expose()
  id: number;

  @ApiProperty({ title: '角色名称' })
  @Expose()
  name: string;

  @ApiProperty({ title: '权限' })
  @Transform(({ value }) => {
    return value?.map((item: any) => item.permissionId);
  })
  @Expose()
  permissions?: number[];

  @ApiProperty({ title: '菜单' })
  @Transform(({ value }) => {
    return value?.map((item: any) => item?.menuId);
  })
  @Expose()
  menus?: number[];
}
```

## 选项说明

- `excludeExtraneousValues`: 是否排除未在 DTO 中使用 `@Expose()` 装饰器定义的属性
- `enableImplicitConversion`: 是否启用隐式类型转换（如字符串转数字）

## 优势

1. **类型安全**: 提供完整的 TypeScript 类型支持
2. **自动序列化**: 自动将原始数据转换为指定的 DTO 类型
3. **数据过滤**: 可以排除不需要的字段
4. **类型转换**: 支持自动类型转换
5. **统一格式**: 保持 API 响应格式的一致性 