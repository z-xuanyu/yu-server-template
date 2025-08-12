import { Injectable, Logger } from '@nestjs/common';

export interface ConnectionLog {
  userId: string;
  username: string;
  socketId: string;
  event: 'connect' | 'disconnect';
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class ConnectionLogService {
  private readonly logger = new Logger(ConnectionLogService.name);
  private connectionLogs: ConnectionLog[] = [];
  private readonly maxLogs = 1000; // 最多保存1000条日志

  // 记录连接事件
  logConnection(userId: string, username: string, socketId: string, client: any): void {
    const log: ConnectionLog = {
      userId,
      username,
      socketId,
      event: 'connect',
      timestamp: new Date(),
      ip: this.extractIP(client),
      userAgent: this.extractUserAgent(client),
    };

    this.addLog(log);
    this.logger.log(`用户连接: ${username} (${userId}) - Socket: ${socketId}`);
  }

  // 记录断开事件
  logDisconnection(userId: string, username: string, socketId: string, client: any): void {
    const log: ConnectionLog = {
      userId,
      username,
      socketId,
      event: 'disconnect',
      timestamp: new Date(),
      ip: this.extractIP(client),
      userAgent: this.extractUserAgent(client),
    };

    this.addLog(log);
    this.logger.log(`用户断开: ${username} (${userId}) - Socket: ${socketId}`);
  }

  // 添加日志
  private addLog(log: ConnectionLog): void {
    this.connectionLogs.push(log);
    
    // 如果日志数量超过限制，删除最旧的日志
    if (this.connectionLogs.length > this.maxLogs) {
      this.connectionLogs = this.connectionLogs.slice(-this.maxLogs);
    }
  }

  // 提取IP地址
  private extractIP(client: any): string | undefined {
    try {
      return client.handshake?.address || 
             client.handshake?.headers?.['x-forwarded-for'] ||
             client.handshake?.headers?.['x-real-ip'] ||
             'unknown';
    } catch {
      return 'unknown';
    }
  }

  // 提取User-Agent
  private extractUserAgent(client: any): string | undefined {
    try {
      return client.handshake?.headers?.['user-agent'] || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // 获取连接日志
  getConnectionLogs(limit: number = 100): ConnectionLog[] {
    return this.connectionLogs.slice(-limit);
  }

  // 获取用户连接历史
  getUserConnectionHistory(userId: string, limit: number = 50): ConnectionLog[] {
    return this.connectionLogs
      .filter(log => log.userId === userId)
      .slice(-limit);
  }

  // 获取在线用户统计
  getOnlineUserStats(): {
    totalConnections: number;
    uniqueUsers: number;
    recentConnections: number;
  } {
    const uniqueUsers = new Set(this.connectionLogs.map(log => log.userId)).size;
    const recentConnections = this.connectionLogs
      .filter(log => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return log.timestamp > oneHourAgo;
      }).length;

    return {
      totalConnections: this.connectionLogs.length,
      uniqueUsers,
      recentConnections,
    };
  }

  // 清理旧日志
  cleanupOldLogs(daysToKeep: number = 7): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const originalCount = this.connectionLogs.length;
    
    this.connectionLogs = this.connectionLogs.filter(log => log.timestamp > cutoffDate);
    
    const removedCount = originalCount - this.connectionLogs.length;
    if (removedCount > 0) {
      this.logger.log(`清理了 ${removedCount} 条旧日志`);
    }
  }
}
