import { Module, Provider } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { AdminGateway } from './admin.gateway'
import { WsAuthGuard } from './guards/ws-auth.guard'
import { ConnectionLogService } from './services/connection-log.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../auth/constants'

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
