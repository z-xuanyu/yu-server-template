import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonModule } from '@app/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { DeptModule } from './dept/dept.module';
import { DictModule } from './dict/dict.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from './logger/logger.module';
import { IdempotenceInterceptor } from '@app/common/interceptors/idempotence.interceptor';
import { MailerModule } from './mailer/mailer.module';

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
    UserModule,
    RoleModule,
    MenuModule,
    DeptModule,
    DictModule
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: APP_INTERCEPTOR, // 全局守卫 处理请求幂等性事件
      useClass: IdempotenceInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AdminModule { }
