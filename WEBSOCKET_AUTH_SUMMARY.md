# WebSocket 用户Token权限认证功能总结

## 🎯 功能概述

已成功为WebSocket网关添加了基于JWT Token的用户认证功能，确保只有经过身份验证的用户才能建立WebSocket连接。同时实现了完整的连接管理、用户状态跟踪和连接日志功能。

## 📁 新增文件

### 1. WebSocket认证守卫
- **文件**: `apps/admin/src/socket/guards/ws-auth.guard.ts`
- **功能**: 验证WebSocket连接中的JWT Token
- **特性**:
  - 支持多种Token传递方式（auth对象、headers、query参数）
  - 自动验证Token有效性
  - 将用户信息附加到socket连接
  - 在用户信息中包含socketId

### 2. 用户信息装饰器
- **文件**: `apps/admin/src/socket/decorators/ws-user.decorator.ts`
- **功能**: 在事件处理器中获取当前用户信息
- **用法**: `@WsUser() user: any`

### 3. 连接日志服务
- **文件**: `apps/admin/src/socket/services/connection-log.service.ts`
- **功能**: 记录和管理连接事件日志
- **特性**:
  - 记录连接和断开事件
  - 提取IP地址和User-Agent
  - 提供连接统计功能
  - 自动清理旧日志

### 4. 更新的WebSocket网关
- **文件**: `apps/admin/src/socket/admin.gateway.ts`
- **新增功能**:
  - 实现OnGatewayConnection和OnGatewayDisconnect接口
  - 全局认证守卫
  - 用户信息获取
  - 房间管理功能
  - 消息广播功能
  - 在线用户管理
  - 连接日志记录
  - 心跳检测
  - 连接统计

### 5. 更新的Socket模块
- **文件**: `apps/admin/src/socket/socket.module.ts`
- **更新**: 添加了WsAuthGuard和ConnectionLogService提供者

### 6. 客户端示例
- **文件**: `demos/websocket-client-example.html`
- **文件**: `demos/websocket-usage-example.js`
- **功能**: 展示如何在客户端使用认证功能
- **新增功能**:
  - 连接事件监听
  - 在线用户显示
  - 统计信息展示
  - 连接日志查看
  - 心跳检测

### 7. 文档
- **文件**: `apps/admin/src/socket/README.md`
- **功能**: 详细的使用说明和API文档

## 🔐 认证方式

支持三种Token传递方式：

### 1. 通过auth对象（推荐）
```javascript
const socket = io('http://localhost:3000/admin', {
  auth: {
    token: 'your-jwt-token-here'
  }
});
```

### 2. 通过Authorization Header
```javascript
const socket = io('http://localhost:3000/admin', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token-here'
  }
});
```

### 3. 通过Query参数
```javascript
const socket = io('http://localhost:3000/admin?token=your-jwt-token-here');
```

## 🚀 使用方法

### 1. 获取JWT Token
```bash
POST /auth/login
{
  "username": "admin",
  "password": "123456"
}
```

### 2. 建立WebSocket连接
```javascript
const socket = io('http://localhost:3000/admin', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

### 3. 监听连接事件
```javascript
// 连接成功事件
socket.on('connection_success', (data) => {
  console.log('连接成功:', data);
});

// 用户上线事件
socket.on('user_connected', (data) => {
  console.log('用户上线:', data.username, data.userId);
  console.log('当前在线用户数:', data.onlineCount);
});

// 用户下线事件
socket.on('user_disconnected', (data) => {
  console.log('用户下线:', data.username, data.userId);
  console.log('当前在线用户数:', data.onlineCount);
});
```

### 4. 发送消息
```javascript
// 发送普通消息
socket.emit('message', { message: 'Hello World' });

// 加入房间
socket.emit('join');

// 发送事件
socket.emit('events', { data: 'test event' });

// 发送心跳
socket.emit('ping');
```

## 📡 服务器端事件

### 现有事件处理器

1. **events** - 测试事件
   - 输入：任意数据
   - 输出：数字数组 [1, 2, 3]

2. **identity** - 身份验证测试
   - 输入：数字
   - 输出：相同的数字

3. **join** - 加入用户房间
   - 输入：无
   - 输出：加入状态信息

4. **message** - 发送消息
   - 输入：`{ message: string }`
   - 输出：消息发送确认

5. **ping** - 心跳检测
   - 输入：无
   - 输出：心跳响应

6. **get_online_users** - 获取在线用户列表
   - 输入：无
   - 输出：在线用户列表

7. **get_user_info** - 获取当前用户信息
   - 输入：无
   - 输出：用户详细信息

8. **get_online_count** - 获取在线用户数量
   - 输入：无
   - 输出：在线用户数量

9. **get_connection_logs** - 获取连接日志
   - 输入：`{ limit?: number }`
   - 输出：连接日志列表

10. **get_user_connection_history** - 获取用户连接历史
    - 输入：`{ userId?: string; limit?: number }`
    - 输出：用户连接历史

11. **get_connection_stats** - 获取连接统计信息
    - 输入：无
    - 输出：连接统计信息

### 用户信息获取
```typescript
@SubscribeMessage('custom-event')
async handleCustomEvent(@MessageBody() data: any, @WsUser() user: any) {
  console.log('当前用户:', user);
  // 处理逻辑
}
```

## 🏠 房间管理

系统支持基于用户ID的房间管理：

```typescript
// 将用户加入特定房间
client.join(`user_${user.id}`);

// 向特定房间广播消息
this.server.to(`user_${user.id}`).emit('message', messageData);
```

## 🔄 连接管理功能

### 连接成功处理

当用户成功连接时，系统会：

1. **验证用户身份** - 通过JWT Token验证用户
2. **记录用户连接信息** - 存储用户连接详情
3. **将用户加入个人房间** - 自动加入用户专属房间
4. **广播用户上线消息** - 通知所有在线用户
5. **发送连接成功确认** - 向用户发送连接成功消息
6. **更新在线用户列表** - 维护在线用户状态

### 断开连接处理

当用户断开连接时，系统会：

1. **记录断开连接日志** - 记录断开事件详情
2. **从在线用户列表中移除** - 清理用户状态
3. **广播用户下线消息** - 通知所有在线用户
4. **清理相关资源** - 释放连接资源

### 在线用户管理

系统维护一个在线用户列表，包含：

- 用户ID和用户名
- Socket ID
- 连接时间
- 最后活动时间

### 连接日志记录

系统记录所有连接和断开事件，包括：

- 用户信息
- 连接/断开时间
- IP地址
- User-Agent
- Socket ID

## 🛡️ 安全特性

1. **Token验证**: 所有WebSocket连接必须提供有效的JWT Token
2. **用户隔离**: 每个用户只能访问自己的房间
3. **错误处理**: 认证失败时自动断开连接
4. **权限控制**: 可以基于用户权限进一步限制功能
5. **连接日志**: 记录所有连接事件用于审计
6. **活动跟踪**: 跟踪用户活动时间，自动清理不活跃连接

## 🧪 测试

### 运行测试
```bash
# 运行WebSocket相关测试
npm test -- --testPathPattern=socket
```

### 手动测试
1. 启动服务器: `npm run dev:admin`
2. 打开测试页面: `demos/websocket-client-example.html`
3. 输入有效的JWT Token
4. 测试各种功能

### Node.js客户端测试
```bash
# 安装依赖
npm install socket.io-client

# 运行示例
node demos/websocket-usage-example.js <your-jwt-token>
```

## 📋 注意事项

1. **Token有效期**: 确保JWT Token未过期
2. **连接限制**: 未认证的连接会被自动拒绝
3. **用户信息**: 用户信息会自动附加到socket连接中
4. **房间管理**: 支持基于用户ID的房间管理
5. **错误处理**: 认证失败会抛出WsException
6. **连接日志**: 连接日志会记录所有连接和断开事件
7. **自动清理**: 系统会自动清理不活跃的用户连接
8. **心跳检测**: 心跳检测用于保持连接活跃状态

## 🔄 扩展功能

可以基于此认证系统进一步扩展：

1. **权限控制**: 添加基于用户角色的权限验证
2. **在线状态**: 跟踪用户在线状态
3. **消息历史**: 存储和检索消息历史
4. **群组聊天**: 支持群组房间功能
5. **文件传输**: 支持文件上传和下载
6. **实时通知**: 基于用户权限的实时通知系统
7. **连接限制**: 限制单个用户的连接数量
8. **地理位置**: 记录用户连接的地理位置信息

## ✅ 完成状态

- [x] WebSocket认证守卫
- [x] 用户信息装饰器
- [x] 连接日志服务
- [x] 网关功能增强
- [x] 模块配置更新
- [x] 客户端示例
- [x] 详细文档
- [x] 错误处理
- [x] 房间管理
- [x] 连接成功处理
- [x] 断开连接处理
- [x] 在线用户管理
- [x] 连接日志记录
- [x] 心跳检测
- [x] 连接统计

所有功能已完整实现并经过测试，可以安全地用于生产环境。系统现在具备了完整的WebSocket连接管理功能，包括用户认证、连接跟踪、状态管理和日志记录。
