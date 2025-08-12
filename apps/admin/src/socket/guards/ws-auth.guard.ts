import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { jwtConstants } from '../../auth/constants';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        throw new WsException('token错误，请重新登录');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // 将用户信息附加到socket对象上，以便后续使用
      client.data.user = {
        ...payload,
        socketId: client.id, // 添加socketId到用户信息中
      };
      
      return true;
    } catch (error) {
      throw new WsException('token失效请重新登录');
    }
  }

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
}
