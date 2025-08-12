# WebSocket 认证问题修复说明

## 问题描述

之前的实现中，WebSocket连接时用户没有获取到，并且没有执行到WsAuthGuard。这是因为：

1. **WebSocket连接时守卫不会自动执行** - `@UseGuards(WsAuthGuard)` 只在事件处理器上生效，不会在连接建立时自动执行
2. **需要在连接时手动验证token** - 需要在 `handleConnection` 方法中手动验证JWT token并获取用户信息

## 修复方案

### 1. 移除网关级别的守卫

```typescript
// 之前
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'admin',
})
@UseGuards(WsAuthGuard)  // ❌ 移除这个
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {

// 修复后
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'admin',
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
```

### 2. 在连接时手动验证token

```typescript
// 连接成功处理
async handleConnection(client: Socket) {
  try {
    console.log('🔗 新的WebSocket连接尝试:', client.id);
    
    // 手动验证token并获取用户信息
    const user = await this.authenticateUser(client);
    if (!user) {
      console.log('❌ 认证失败，断开连接');
      client.disconnect();
      return;
    }

    // 将用户信息附加到socket对象上
    client.data.user = {
      ...user,
      socketId: client.id,
    };

    // ... 其他连接处理逻辑
  } catch (error) {
    console.error('❌ 连接处理错误:', error);
    client.disconnect();
  }
}
```

### 3. 添加认证方法

```typescript
// 手动认证用户
private async authenticateUser(client: Socket): Promise<any> {
  try {
    const token = this.extractTokenFromSocket(client);
    
    if (!token) {
      console.log('❌ 未提供token');
      return null;
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    console.log('✅ 用户认证成功:', payload);
    return payload;
  } catch (error) {
    console.error('❌ 用户认证失败:', error.message);
    return null;
  }
}

// 从socket中提取token
private extractTokenFromSocket(client: Socket): string | undefined {
  // 从handshake auth中获取token
  const auth = client.handshake.auth;
  if (auth && auth.token) {
    return auth.token;
  }

  // 从handshake headers中获取token
  const headers = client.handshake.headers;
  const authorization = headers.authorization;
  if (authorization) {
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  // 从query参数中获取token
  const query = client.handshake.query;
  if (query && query.token) {
    return query.token as string;
  }

  return undefined;
}
```

### 4. 在事件处理器上添加守卫

```typescript
@SubscribeMessage('events')
@UseGuards(WsAuthGuard)  // ✅ 在事件处理器上添加守卫
findAll(@MessageBody() data: any, @WsUser() user: any): Observable<WsResponse<number>> {
  console.log('用户信息:', user);
  // 更新用户活动时间
  this.updateUserActivity(user.socketId);
  return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
}
```

### 5. 更新模块配置

```typescript
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  providers: [AdminGateway, WsAuthGuard, ConnectionLogService],
  exports: [AdminGateway, ConnectionLogService],
})
export class SocketModule { }
```

## 修复后的工作流程

1. **连接建立** - 客户端发起WebSocket连接
2. **Token验证** - 在 `handleConnection` 中手动验证JWT token
3. **用户信息存储** - 将用户信息存储到 `client.data.user`
4. **连接成功** - 发送连接成功消息给客户端
5. **事件处理** - 后续的事件处理器使用 `@UseGuards(WsAuthGuard)` 进行保护

## 测试方法

1. 启动服务器: `npm run dev:admin`
2. 获取JWT Token: 通过登录接口获取有效的token
3. 打开测试页面: `demos/test-websocket-connection.html`
4. 输入JWT Token并连接
5. 测试各种功能

## 关键变化

- ✅ 移除了网关级别的守卫
- ✅ 在连接时手动验证token
- ✅ 在事件处理器上添加守卫
- ✅ 正确注入JwtService
- ✅ 用户信息包含socketId

现在WebSocket连接应该能够正确获取用户信息并执行认证了。
