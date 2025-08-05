import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonModule } from '@app/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { DeptModule } from './dept/dept.module';
import { DictModule } from './dict/dict.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from './logger/logger.module';
import { MailerModule } from './mailer/mailer.module';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { AuthService } from './auth/auth.service';
import { SocketModule } from './socket/socket.module';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [
    LoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 接口限制一分钟内30次请求
          limit: 30,
        },
      ],
    }),
    CommonModule,
    MailerModule,
    AuthModule,
    SseModule,
    SocketModule,
    UserModule,
    RoleModule,
    MenuModule,
    DeptModule,
    DictModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AdminModule {}
