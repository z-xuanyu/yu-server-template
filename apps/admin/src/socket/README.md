# WebSocket 认证功能说明

## 概述

本模块为WebSocket连接提供了基于JWT Token的认证功能，确保只有经过身份验证的用户才能建立WebSocket连接。同时提供了完整的连接管理、用户状态跟踪和连接日志功能。

## 功能特性

- 🔐 JWT Token认证
- 👤 用户信息获取
- 🏠 房间管理
- 💬 消息广播
- 🛡️ 权限控制
- 📊 在线用户管理
- 📋 连接日志记录
- 💓 心跳检测
- 📈 连接统计

## 文件结构

```
socket/
├── admin.gateway.ts              # WebSocket网关主文件
├── guards/
│   └── ws-auth.guard.ts         # WebSocket认证守卫
├── decorators/
│   └── ws-user.decorator.ts     # 用户信息装饰器
├── services/
│   └── connection-log.service.ts # 连接日志服务
├── socket.module.ts             # Socket模块配置
└── README.md                   # 说明文档
```

## 认证方式

WebSocket认证支持以下三种方式传递JWT Token：

### 1. 通过auth对象传递（推荐）

```javascript
const socket = io('http://localhost:3000/admin', {
  auth: {
    token: 'your-jwt-token-here'
  }
});
```

### 2. 通过Authorization Header传递

```javascript
const socket = io('http://localhost:3000/admin', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token-here'
  }
});
```

### 3. 通过Query参数传递

```javascript
const socket = io('http://localhost:3000/admin?token=your-jwt-token-here');
```

## 使用方法

### 1. 获取JWT Token

首先需要通过登录接口获取JWT Token：

```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

### 2. 建立WebSocket连接

使用获取到的Token建立WebSocket连接：

```javascript
const socket = io('http://localhost:3000/admin', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

socket.on('connect', () => {
  console.log('连接成功');
});

socket.on('connect_error', (error) => {
  console.log('连接失败:', error.message);
});
```

### 3. 连接事件监听

监听连接相关的事件：

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

连接成功后可以发送各种类型的消息：

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

### 5. 接收消息

监听服务器发送的消息：

```javascript
socket.on('message', (data) => {
  console.log('收到消息:', data);
});

socket.on('joined', (data) => {
  console.log('房间状态:', data);
});

socket.on('message_sent', (data) => {
  console.log('消息发送成功:', data);
});

socket.on('pong', (data) => {
  console.log('心跳响应:', data);
});
```

## 服务器端事件处理

### 现有事件

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

### 添加新事件

在 `admin.gateway.ts` 中添加新的事件处理器：

```typescript
@SubscribeMessage('custom-event')
async handleCustomEvent(@MessageBody() data: any, @WsUser() user: any): Promise<WsResponse<any>> {
  // 处理逻辑
  return { event: 'custom-response', data: { success: true } };
}
```

## 用户信息获取

在事件处理器中，可以使用 `@WsUser()` 装饰器获取当前用户信息：

```typescript
@SubscribeMessage('get-user-info')
async getUserInfo(@WsUser() user: any): Promise<WsResponse<any>> {
  return { 
    event: 'user-info', 
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      socketId: user.socketId
    }
  };
}
```

## 房间管理

系统支持基于用户ID的房间管理：

```typescript
// 将用户加入特定房间
client.join(`user_${user.id}`);

// 向特定房间广播消息
this.server.to(`user_${user.id}`).emit('message', messageData);
```

## 连接管理功能

### 连接成功处理

当用户成功连接时，系统会：

1. 验证用户身份
2. 记录用户连接信息
3. 将用户加入个人房间
4. 广播用户上线消息
5. 发送连接成功确认

### 断开连接处理

当用户断开连接时，系统会：

1. 记录断开连接日志
2. 从在线用户列表中移除
3. 广播用户下线消息
4. 清理相关资源

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

## 错误处理

认证失败时会抛出 `WsException`，客户端会收到连接错误：

- Token缺失：`token错误，请重新登录`
- Token无效：`token失效请重新登录`

## 测试

### 运行测试
```bash
# 运行WebSocket相关测试
npm test -- --testPathPattern=socket
```

### 手动测试

可以使用提供的测试页面 `demos/websocket-client-example.html` 来测试WebSocket功能：

1. 启动服务器: `npm run dev:admin`
2. 打开测试页面: `demos/websocket-client-example.html`
3. 输入有效的JWT Token
4. 点击连接按钮
5. 测试各种消息发送功能

### Node.js客户端测试

使用提供的Node.js客户端示例：

```bash
# 安装依赖
npm install socket.io-client

# 运行示例
node demos/websocket-usage-example.js <your-jwt-token>
```

## 注意事项

1. 确保JWT Token有效且未过期
2. WebSocket连接需要有效的认证才能建立
3. 用户信息会自动附加到socket连接中
4. 支持房间管理和消息广播功能
5. 所有事件处理器都会自动获取用户信息
6. 连接日志会记录所有连接和断开事件
7. 系统会自动清理不活跃的用户连接
8. 心跳检测用于保持连接活跃状态

## 扩展功能

可以基于此认证系统进一步扩展：

1. **权限控制**: 添加基于用户角色的权限验证
2. **消息历史**: 存储和检索消息历史
3. **群组聊天**: 支持群组房间功能
4. **文件传输**: 支持文件上传和下载
5. **实时通知**: 基于用户权限的实时通知系统
6. **在线状态**: 更详细的用户在线状态管理
7. **连接限制**: 限制单个用户的连接数量
8. **地理位置**: 记录用户连接的地理位置信息
