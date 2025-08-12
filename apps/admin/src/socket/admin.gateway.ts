import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { WsUser } from './decorators/ws-user.decorator';
import { ConnectionLogService } from './services/connection-log.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'admin',
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connectionLogService: ConnectionLogService,
    private readonly jwtService: JwtService,
  ) {}

  // 存储在线用户信息
  private onlineUsers = new Map<string, {
    userId: string;
    username: string;
    socketId: string;
    connectedAt: Date;
    lastActivity: Date;
  }>();

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

      // 记录用户连接信息
      const userInfo = {
        userId: user.id,
        username: user.username || user.account,
        socketId: client.id,
        connectedAt: new Date(),
        lastActivity: new Date(),
      };

      // 存储用户信息
      this.onlineUsers.set(client.id, userInfo);

      // 记录连接日志
      this.connectionLogService.logConnection(
        user.id,
        userInfo.username,
        client.id,
        client
      );

      // 将用户加入个人房间
      await client.join(`user_${user.id}`);

      // 广播用户上线消息
      this.server.emit('user_connected', {
        userId: user.id,
        username: userInfo.username,
        socketId: client.id,
        timestamp: new Date().toISOString(),
        onlineCount: this.onlineUsers.size,
      });

      // 向用户发送连接成功消息
      client.emit('connection_success', {
        message: '连接成功',
        user: {
          id: user.id,
          username: userInfo.username,
        },
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ 用户连接成功: ${userInfo.username} (ID: ${user.id}, Socket: ${client.id})`);
      console.log(`📊 当前在线用户数: ${this.onlineUsers.size}`);

    } catch (error) {
      console.error('❌ 连接处理错误:', error);
      client.disconnect();
    }
  }

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

  // 断开连接处理
  async handleDisconnect(client: Socket) {
    try {
      const userInfo = this.onlineUsers.get(client.id);
      if (userInfo) {
        // 记录断开连接日志
        this.connectionLogService.logDisconnection(
          userInfo.userId,
          userInfo.username,
          client.id,
          client
        );

        // 从在线用户列表中移除
        this.onlineUsers.delete(client.id);

        // 广播用户下线消息
        this.server.emit('user_disconnected', {
          userId: userInfo.userId,
          username: userInfo.username,
          socketId: client.id,
          timestamp: new Date().toISOString(),
          onlineCount: this.onlineUsers.size,
        });

        console.log(`❌ 用户断开连接: ${userInfo.username} (ID: ${userInfo.userId}, Socket: ${client.id})`);
        console.log(`📊 当前在线用户数: ${this.onlineUsers.size}`);
      } else {
        console.log(`❌ 未知用户断开连接: ${client.id}`);
      }
    } catch (error) {
      console.error('❌ 断开连接处理错误:', error);
    }
  }

  // 更新用户活动时间
  private updateUserActivity(socketId: string) {
    const userInfo = this.onlineUsers.get(socketId);
    if (userInfo) {
      userInfo.lastActivity = new Date();
      this.onlineUsers.set(socketId, userInfo);
    }
  }

  @SubscribeMessage('events')
  @UseGuards(WsAuthGuard)
  findAll(@MessageBody() data: any, @WsUser() user: any): Observable<WsResponse<number>> {
    console.log('用户信息:', user);
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  @UseGuards(WsAuthGuard)
  async identity(@MessageBody() data: number, @WsUser() user: any): Promise<number> {
    console.log('用户信息:', user);
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    return data;
  }

  @SubscribeMessage('join')
  @UseGuards(WsAuthGuard)
  async handleJoin(@WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    // 将用户加入特定的房间
    const client: Socket = this.server.sockets.sockets.get(user.socketId);
    if (client) {
      client.join(`user_${user.id}`);
      return { event: 'joined', data: { message: '成功加入房间', userId: user.id } };
    }
    return { event: 'error', data: { message: '加入房间失败' } };
  }

  @SubscribeMessage('message')
  @UseGuards(WsAuthGuard)
  async handleMessage(@MessageBody() data: any, @WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    // 处理消息并广播给特定房间
    const message = {
      userId: user.id,
      username: user.username,
      message: data.message,
      timestamp: new Date().toISOString(),
    };
    
    this.server.to(`user_${user.id}`).emit('message', message);
    
    return { event: 'message_sent', data: message };
  }

  // 获取在线用户列表
  @SubscribeMessage('get_online_users')
  @UseGuards(WsAuthGuard)
  async getOnlineUsers(@WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    const onlineUsersList = Array.from(this.onlineUsers.values()).map(userInfo => ({
      userId: userInfo.userId,
      username: userInfo.username,
      connectedAt: userInfo.connectedAt,
      lastActivity: userInfo.lastActivity,
    }));

    return {
      event: 'online_users',
      data: {
        users: onlineUsersList,
        total: this.onlineUsers.size,
        timestamp: new Date().toISOString(),
      }
    };
  }

  // 心跳检测
  @SubscribeMessage('ping')
  @UseGuards(WsAuthGuard)
  async handlePing(@WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    return {
      event: 'pong',
      data: {
        timestamp: new Date().toISOString(),
        message: 'pong',
      }
    };
  }

  // 获取当前用户信息
  @SubscribeMessage('get_user_info')
  @UseGuards(WsAuthGuard)
  async getUserInfo(@WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    const userInfo = this.onlineUsers.get(user.socketId);
    
    return {
      event: 'user_info',
      data: {
        userId: user.id,
        username: user.username,
        socketId: user.socketId,
        connectedAt: userInfo?.connectedAt,
        lastActivity: userInfo?.lastActivity,
        timestamp: new Date().toISOString(),
      }
    };
  }

  // 获取在线用户数量
  @SubscribeMessage('get_online_count')
  @UseGuards(WsAuthGuard)
  async getOnlineCount(@WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    return {
      event: 'online_count',
      data: {
        count: this.onlineUsers.size,
        timestamp: new Date().toISOString(),
      }
    };
  }

  // 获取连接日志
  @SubscribeMessage('get_connection_logs')
  @UseGuards(WsAuthGuard)
  async getConnectionLogs(@WsUser() user: any, @MessageBody() data: { limit?: number }): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    const logs = this.connectionLogService.getConnectionLogs(data.limit || 50);
    
    return {
      event: 'connection_logs',
      data: {
        logs,
        total: logs.length,
        timestamp: new Date().toISOString(),
      }
    };
  }

  // 获取用户连接历史
  @SubscribeMessage('get_user_connection_history')
  @UseGuards(WsAuthGuard)
  async getUserConnectionHistory(@WsUser() user: any, @MessageBody() data: { userId?: string; limit?: number }): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    const targetUserId = data.userId || user.id;
    const logs = this.connectionLogService.getUserConnectionHistory(targetUserId, data.limit || 20);
    
    return {
      event: 'user_connection_history',
      data: {
        userId: targetUserId,
        logs,
        total: logs.length,
        timestamp: new Date().toISOString(),
      }
    };
  }

  // 获取连接统计信息
  @SubscribeMessage('get_connection_stats')
  @UseGuards(WsAuthGuard)
  async getConnectionStats(@WsUser() user: any): Promise<WsResponse<any>> {
    // 更新用户活动时间
    this.updateUserActivity(user.socketId);
    
    const stats = this.connectionLogService.getOnlineUserStats();
    
    return {
      event: 'connection_stats',
      data: {
        ...stats,
        currentOnline: this.onlineUsers.size,
        timestamp: new Date().toISOString(),
      }
    };
  }

  // 清理不活跃用户（可选：定期清理）
  private cleanupInactiveUsers() {
    const now = new Date();
    const inactiveThreshold = 30 * 60 * 1000; // 30分钟

    for (const [socketId, userInfo] of this.onlineUsers.entries()) {
      const timeSinceLastActivity = now.getTime() - userInfo.lastActivity.getTime();
      if (timeSinceLastActivity > inactiveThreshold) {
        const client = this.server.sockets.sockets.get(socketId);
        if (client) {
          client.disconnect();
        }
        this.onlineUsers.delete(socketId);
        console.log(`🧹 清理不活跃用户: ${userInfo.username}`);
      }
    }
  }

  // 获取在线用户统计信息
  getOnlineUsersStats() {
    return {
      total: this.onlineUsers.size,
      users: Array.from(this.onlineUsers.values()),
    };
  }
}