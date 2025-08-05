# 响应结果工具变更日志

## [1.1.0] - 2024-12-19

### 新增功能

#### 序列化支持
- 新增 `apiSucceedWithTransform` 函数：支持将数据自动转换为指定的 DTO 类型
- 新增 `apiSucceedWithPagination` 函数：支持分页数据的自动序列化
- 支持 `class-transformer` 的所有功能，包括：
  - `@Expose()` 装饰器：控制字段的序列化
  - `@Transform()` 装饰器：自定义数据转换逻辑
  - `excludeExtraneousValues` 选项：排除未定义的字段
  - `enableImplicitConversion` 选项：启用隐式类型转换

#### 类型安全
- 完整的 TypeScript 类型支持
- 泛型参数确保类型安全
- 支持复杂的嵌套数据结构

### 使用示例

#### 基础序列化
```typescript
// 自动过滤敏感信息并转换数据格式
return apiSucceedWithTransform(userData, PublicUserDto, {
  excludeExtraneousValues: true
});
```

#### 分页数据序列化
```typescript
// 分页数据自动序列化
return apiSucceedWithPagination(paginationData, PublicUserDto, {
  excludeExtraneousValues: true
});
```

### 优势

1. **数据安全**: 自动过滤敏感信息（如密码）
2. **类型安全**: 完整的 TypeScript 类型支持
3. **数据转换**: 支持复杂的数据转换逻辑
4. **统一格式**: 保持 API 响应格式的一致性
5. **易于使用**: 简单的 API 设计，易于集成

### 向后兼容

- 原有的 `apiSucceed` 函数保持不变
- 新增的函数是可选功能，不影响现有代码

### 依赖

- `class-transformer`: ^0.5.1
- `class-validator`: ^0.14.2